import os
import secrets
import uuid
from typing import List

from config import load_env_file
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_env_file(os.path.join(BASE_DIR, ".env"))

import models
import auth
from database import Base, engine, get_db, SessionLocal

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

Base.metadata.create_all(bind=engine)


def ensure_settings_columns():
    """Add newly introduced settings columns for existing local SQLite DBs."""
    if engine.dialect.name != "sqlite":
        return
    existing = {c["name"] for c in inspect(engine).get_columns("settings")}
    additions = {
        "logo_seed": "VARCHAR DEFAULT 'Portfolio'",
        "logo_style": "VARCHAR DEFAULT 'cloud'",
        "logo_complexity": "INTEGER DEFAULT 6",
        "logo_show_nodes": "BOOLEAN DEFAULT 1",
    }
    with engine.begin() as conn:
        for name, ddl in additions.items():
            if name not in existing:
                conn.execute(text(f"ALTER TABLE settings ADD COLUMN {name} {ddl}"))


ensure_settings_columns()

# The two languages the site supports. "en" = English (LTR), "fa" = Persian (RTL).
LANGS = ("en", "fa")

# The canonical set of resume sections, in a sensible default order. Each entry
# becomes {key, enabled} in Settings.sections. The admin can reorder them and
# toggle any on/off; the public resume renders only enabled ones, in order.
# "summary", "research_interests" and "contact" are driven by the Profile row;
# the rest map to their own content tables.
DEFAULT_SECTIONS = [
    "summary",            # professional summary / about (from profile.bio)
    "experience",         # work experience
    "projects",           # projects
    "education",          # education
    "skills",             # skills
    "publications",       # academic
    "teaching",           # academic (+ students advised)
    "research_interests", # academic (from profile.research_interests)
    "certifications",     # certifications / courses
    "languages",          # spoken languages
    "awards",             # awards & honors
    "news",               # recent news / updates
    "contact",            # contact + socials
]

CONTENT_MODELS = {
    "news": models.News,
    "education": models.Education,
    "publications": models.Publication,
    "experience": models.Experience,
    "teaching": models.TeachingInstitution,
    "students": models.Student,
    "skills": models.SkillCategory,
    "awards": models.Award,
    "projects": models.Project,
    "certifications": models.Certification,
    "languages": models.Language,
}


def default_sections():
    return [{"key": k, "enabled": True} for k in DEFAULT_SECTIONS]

app = FastAPI(title="Academic Portfolio API")


def parse_cors_origins() -> list[str]:
    raw = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    origins = [item.strip() for item in raw.split(",") if item.strip()]
    return origins or ["http://localhost:5173", "http://127.0.0.1:5173"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


def norm_lang(lang: str) -> str:
    """Fall back to English for anything we don't recognise."""
    return lang if lang in LANGS else "en"


# ---------------------------------------------------------------------------
# Bootstrap: create default admin + one empty profile row PER LANGUAGE
# ---------------------------------------------------------------------------
@app.on_event("startup")
def bootstrap():
    db = SessionLocal()
    try:
        if not db.query(models.AdminUser).first():
            username = os.environ.get("ADMIN_USERNAME", "admin")
            password = os.environ.get("ADMIN_PASSWORD")
            if not password:
                password = secrets.token_urlsafe(18)
                print("[bootstrap] ADMIN_PASSWORD was not set.")
                print(f"[bootstrap] Temporary admin password for '{username}': {password}")
                print("[bootstrap] Set ADMIN_PASSWORD before first production startup.")
            db.add(models.AdminUser(username=username, hashed_password=auth.hash_password(password)))
            db.commit()
            print(f"[bootstrap] Created admin user '{username}'. Change the password after first login.")
        # Make sure there is exactly one profile row for each language.
        for lg in LANGS:
            if not db.query(models.Profile).filter(models.Profile.lang == lg).first():
                db.add(models.Profile(lang=lg, name="", role="", research_interests=[],
                                      emails=[], office={}, department={}, socials=[]))
        # Create the single global settings row with sensible defaults.
        if not db.query(models.Settings).first():
            db.add(models.Settings(sections=default_sections()))
        db.commit()
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


@app.post("/api/auth/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.AdminUser).filter(models.AdminUser.username == form.username).first()
    if not user or not auth.verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = auth.create_access_token({"sub": user.username})
    return {"access_token": token}


@app.get("/api/auth/me")
def me(current=Depends(auth.get_current_admin)):
    return {"username": current.username}


@app.post("/api/auth/change-password")
def change_password(data: PasswordChange, current=Depends(auth.get_current_admin),
                    db: Session = Depends(get_db)):
    if not auth.verify_password(data.current_password, current.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current.hashed_password = auth.hash_password(data.new_password)
    db.commit()
    return {"ok": True}


# ---------------------------------------------------------------------------
# File upload
# ---------------------------------------------------------------------------
@app.post("/api/upload")
def upload_file(file: UploadFile = File(...), current=Depends(auth.get_current_admin)):
    allowed_exts = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    max_bytes = int(os.environ.get("MAX_UPLOAD_BYTES", str(5 * 1024 * 1024)))

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed_exts or file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, WebP, and GIF image uploads are allowed",
        )

    fname = f"{uuid.uuid4().hex}{ext}"
    dest = os.path.join(UPLOAD_DIR, fname)
    written = 0
    with open(dest, "wb") as f:
        while True:
            chunk = file.file.read(1024 * 1024)
            if not chunk:
                break
            written += len(chunk)
            if written > max_bytes:
                f.close()
                os.remove(dest)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="Uploaded file is too large",
                )
            f.write(chunk)
    return {"url": f"/uploads/{fname}"}


def serialize(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


# ---------------------------------------------------------------------------
# Profile — one row per language, selected via ?lang=
# ---------------------------------------------------------------------------
def get_or_create_profile(db: Session, lang: str) -> models.Profile:
    p = db.query(models.Profile).filter(models.Profile.lang == lang).first()
    if not p:
        p = models.Profile(lang=lang, research_interests=[], emails=[],
                            office={}, department={}, socials=[])
        db.add(p)
        db.commit()
        db.refresh(p)
    return p


@app.get("/api/profile")
def get_profile(lang: str = Query("en"), db: Session = Depends(get_db)):
    return serialize(get_or_create_profile(db, norm_lang(lang)))


@app.put("/api/profile")
def update_profile(data: dict, lang: str = Query("en"),
                   current=Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    p = get_or_create_profile(db, norm_lang(lang))
    # `lang` and `id` are managed by the server, never overwritten from the body.
    allowed = {c.name for c in models.Profile.__table__.columns} - {"id", "lang"}
    for k, v in data.items():
        if k in allowed:
            setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return serialize(p)


# ---------------------------------------------------------------------------
# Settings — a single global row controlling branding, theme, and section
# visibility/order. Not language-specific.
# ---------------------------------------------------------------------------
def get_or_create_settings(db: Session) -> models.Settings:
    s = db.query(models.Settings).first()
    if not s:
        s = models.Settings(sections=default_sections())
        db.add(s)
        db.commit()
        db.refresh(s)
    defaults = {
        "logo_seed": "Portfolio",
        "logo_style": "cloud",
        "logo_complexity": 6,
        "logo_show_nodes": True,
    }
    changed = False
    for key, value in defaults.items():
        if getattr(s, key, None) is None:
            setattr(s, key, value)
            changed = True
    # If a deployment predates a newly added section, append any missing keys so
    # the admin can still see and toggle them (kept disabled to avoid surprises).
    if s.sections is not None:
        present = {item.get("key") for item in s.sections}
        missing = [k for k in DEFAULT_SECTIONS if k not in present]
        if missing:
            s.sections = list(s.sections) + [{"key": k, "enabled": False} for k in missing]
            changed = True
    if changed:
        db.commit()
        db.refresh(s)
    return s


@app.get("/api/settings")
def get_settings(db: Session = Depends(get_db)):
    return serialize(get_or_create_settings(db))


@app.put("/api/settings")
def update_settings(data: dict, current=Depends(auth.get_current_admin),
                    db: Session = Depends(get_db)):
    s = get_or_create_settings(db)
    allowed = {c.name for c in models.Settings.__table__.columns} - {"id"}
    for k, v in data.items():
        if k in allowed:
            setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return serialize(s)
def register_crud(path: str, model):
    # Columns a client may set, minus the ones the server owns.
    cols = {c.name for c in model.__table__.columns} - {"id", "lang"}
    has_order = "sort_order" in cols

    @app.get(f"/api/{path}", name=f"list_{path}")
    def list_items(lang: str = Query("en"), db: Session = Depends(get_db),
                   _model=model, _has_order=has_order):
        # Only return rows for the requested language.
        q = db.query(_model).filter(_model.lang == norm_lang(lang))
        if _has_order:
            q = q.order_by(_model.sort_order.asc(), _model.id.asc())
        else:
            q = q.order_by(_model.id.asc())
        return [serialize(o) for o in q.all()]

    @app.post(f"/api/{path}", name=f"create_{path}")
    def create_item(data: dict, lang: str = Query("en"),
                    current=Depends(auth.get_current_admin),
                    db: Session = Depends(get_db), _model=model, _cols=cols):
        # The new row is tagged with the language the admin is currently editing.
        obj = _model(lang=norm_lang(lang), **{k: v for k, v in data.items() if k in _cols})
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return serialize(obj)

    @app.put(f"/api/{path}/{{item_id}}", name=f"update_{path}")
    def update_item(item_id: int, data: dict, current=Depends(auth.get_current_admin),
                    db: Session = Depends(get_db), _model=model, _cols=cols):
        obj = db.query(_model).get(item_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Not found")
        # An item never changes language on edit.
        for k, v in data.items():
            if k in _cols:
                setattr(obj, k, v)
        db.commit()
        db.refresh(obj)
        return serialize(obj)

    @app.delete(f"/api/{path}/{{item_id}}", name=f"delete_{path}")
    def delete_item(item_id: int, current=Depends(auth.get_current_admin),
                    db: Session = Depends(get_db), _model=model):
        obj = db.query(_model).get(item_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Not found")
        db.delete(obj)
        db.commit()
        return {"ok": True}

    @app.post(f"/api/{path}/reorder", name=f"reorder_{path}")
    def reorder(order: List[int], current=Depends(auth.get_current_admin),
                db: Session = Depends(get_db), _model=model, _has_order=has_order):
        if not _has_order:
            return {"ok": True}
        for idx, item_id in enumerate(order):
            obj = db.query(_model).get(item_id)
            if obj:
                obj.sort_order = idx
        db.commit()
        return {"ok": True}


register_crud("news", models.News)
register_crud("education", models.Education)
register_crud("publications", models.Publication)
register_crud("experience", models.Experience)
register_crud("teaching", models.TeachingInstitution)
register_crud("students", models.Student)
register_crud("skills", models.SkillCategory)
register_crud("awards", models.Award)
register_crud("projects", models.Project)
register_crud("certifications", models.Certification)
register_crud("languages", models.Language)


# ---------------------------------------------------------------------------
# Aggregated stats — counted within one language
# ---------------------------------------------------------------------------
@app.get("/api/export")
def export_site(current=Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    return {
        "version": 1,
        "profiles": [serialize(p) for p in db.query(models.Profile).order_by(models.Profile.lang.asc()).all()],
        "settings": serialize(get_or_create_settings(db)),
        "content": {
            key: [serialize(o) for o in db.query(model).order_by(model.lang.asc(), model.id.asc()).all()]
            for key, model in CONTENT_MODELS.items()
        },
    }


@app.post("/api/import")
def import_site(payload: dict, current=Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    profiles = payload.get("profiles", [])
    content = payload.get("content", {})
    settings_data = payload.get("settings") or {}

    db.query(models.Profile).delete()
    profile_cols = {c.name for c in models.Profile.__table__.columns} - {"id"}
    for row in profiles:
        db.add(models.Profile(**{k: v for k, v in row.items() if k in profile_cols}))

    for key, model in CONTENT_MODELS.items():
        db.query(model).delete()
        cols = {c.name for c in model.__table__.columns} - {"id"}
        for row in content.get(key, []):
            db.add(model(**{k: v for k, v in row.items() if k in cols}))

    settings = get_or_create_settings(db)
    setting_cols = {c.name for c in models.Settings.__table__.columns} - {"id"}
    for k, v in settings_data.items():
        if k in setting_cols:
            setattr(settings, k, v)
    db.commit()
    return {"ok": True}


@app.get("/api/stats")
def stats(lang: str = Query("en"), db: Session = Depends(get_db)):
    pubs = db.query(models.Publication).filter(models.Publication.lang == norm_lang(lang)).all()
    published = [p for p in pubs if p.status == "published"]
    return {
        "papers": len(pubs),
        "published": len(published),
        "citations": sum(p.citations or 0 for p in pubs),
        "downloads": sum(p.downloads or 0 for p in pubs),
    }


@app.get("/api/health")
def health():
    return {"status": "ok"}
