from sqlalchemy import Column, Integer, String, Text, Boolean, JSON
from database import Base

# --- Bilingual design note ---------------------------------------------------
# Every content table carries a `lang` column ("en" or "fa"). The public site
# requests rows for one language at a time (?lang=fa), and the admin edits one
# language at a time. This keeps every text field a simple string (no nested
# {en, fa} objects), so page rendering and admin forms stay unchanged — the
# only new concept is "which language am I looking at right now".
# -----------------------------------------------------------------------------


class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class Profile(Base):
    """One row PER LANGUAGE holding the main identity / hero data."""
    __tablename__ = "profile"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    name = Column(String, default="")
    role = Column(String, default="")            # e.g. PhD Candidate
    institution = Column(String, default="")
    location = Column(String, default="")
    email = Column(String, default="")
    photo_url = Column(String, default="")
    cv_url = Column(String, default="")
    bio = Column(Text, default="")               # About Me text
    research_interests = Column(JSON, default=list)   # ["Systems for ML", ...]
    # Contact page extras
    emails = Column(JSON, default=list)          # [{label, value}]
    office = Column(JSON, default=dict)          # {room, address, map_url}
    department = Column(JSON, default=dict)       # {name, university}
    contact_note = Column(String, default="")    # "Open to research collaborations..."
    socials = Column(JSON, default=list)          # [{label, url, icon}]


class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    date = Column(String, default="")            # "May 2026"
    text = Column(Text, default="")
    sort_order = Column(Integer, default=0)


class Education(Base):
    __tablename__ = "education"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    degree = Column(String, default="")
    institution = Column(String, default="")
    field = Column(String, default="")
    start = Column(String, default="")
    end = Column(String, default="")
    duration = Column(String, default="")        # "4 years"
    supervisor = Column(String, default="")
    thesis = Column(Text, default="")
    sort_order = Column(Integer, default=0)


class Publication(Base):
    __tablename__ = "publications"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    number = Column(Integer, default=0)
    type = Column(String, default="Conference")  # Conference / Journal / Workshop
    year = Column(String, default="")
    status = Column(String, default="published")  # published / under_review
    title = Column(Text, default="")
    authors = Column(Text, default="")
    venue = Column(Text, default="")
    submitted_to = Column(String, default="")
    pdf_url = Column(String, default="")
    slides_url = Column(String, default="")
    code_url = Column(String, default="")
    doi_url = Column(String, default="")
    citations = Column(Integer, default=0)
    downloads = Column(Integer, default=0)
    sort_order = Column(Integer, default=0)


class Experience(Base):
    __tablename__ = "experience"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    role = Column(String, default="")
    company = Column(String, default="")
    location = Column(String, default="")
    start = Column(String, default="")
    end = Column(String, default="")
    current = Column(Boolean, default=False)
    description = Column(Text, default="")
    bullets = Column(JSON, default=list)         # achievement bullet points (resume style)
    tags = Column(JSON, default=list)
    sort_order = Column(Integer, default=0)


class TeachingInstitution(Base):
    __tablename__ = "teaching"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    name = Column(String, default="")
    logo_url = Column(String, default="")
    years = Column(String, default="")           # "2023 - 2026"
    courses_count = Column(Integer, default=0)
    role = Column(String, default="")            # "Lead TA x5" / "Lecturer x1"
    courses = Column(JSON, default=list)         # [{name, count}]
    sort_order = Column(Integer, default=0)


class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    name = Column(String, default="")
    level = Column(String, default="")           # MSc / BSc / PhD
    university = Column(String, default="")
    period = Column(String, default="")
    status = Column(String, default="active")    # active / alumni
    topic = Column(Text, default="")
    sort_order = Column(Integer, default=0)


class SkillCategory(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    category = Column(String, default="")
    icon = Column(String, default="code")
    skills = Column(JSON, default=list)          # [{name, level}] level: expert/proficient/familiar
    sort_order = Column(Integer, default=0)


class Award(Base):
    __tablename__ = "awards"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    title = Column(String, default="")
    issuer = Column(String, default="")
    year = Column(String, default="")
    description = Column(Text, default="")
    sort_order = Column(Integer, default=0)

# ---------------------------------------------------------------------------
# NEW: industry-resume sections
# ---------------------------------------------------------------------------
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    title = Column(String, default="")
    role = Column(String, default="")            # your role on the project
    description = Column(Text, default="")
    url = Column(String, default="")             # live/repo link
    start = Column(String, default="")
    end = Column(String, default="")
    current = Column(Boolean, default=False)
    bullets = Column(JSON, default=list)         # highlight bullet points
    tags = Column(JSON, default=list)            # tech / keywords
    sort_order = Column(Integer, default=0)


class Certification(Base):
    __tablename__ = "certifications"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    name = Column(String, default="")
    issuer = Column(String, default="")
    year = Column(String, default="")
    credential_id = Column(String, default="")
    url = Column(String, default="")
    sort_order = Column(Integer, default=0)


class Language(Base):
    """Spoken/written languages (distinct from programming languages in Skills)."""
    __tablename__ = "languages"
    id = Column(Integer, primary_key=True, index=True)
    lang = Column(String, default="en", index=True)
    name = Column(String, default="")            # e.g. English, Persian
    level = Column(String, default="")           # Native / Fluent / Intermediate / Basic
    sort_order = Column(Integer, default=0)


# ---------------------------------------------------------------------------
# NEW: global presentation settings (the "customization" layer)
# One row, shared across languages. Controls branding, theme, and which
# sections appear on the resume and in what order.
# ---------------------------------------------------------------------------
class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    brand_name = Column(String, default="")      # overrides profile name in nav/footer if set
    tagline = Column(String, default="")
    accent = Column(String, default="emerald")   # palette key (see frontend palettes)
    accent_custom = Column(String, default="")   # optional custom hex; overrides palette if set
    logo_seed = Column(String, default="Portfolio")
    logo_style = Column(String, default="cloud") # cloud | constellation | prism | orbit
    logo_complexity = Column(Integer, default=6) # 3..10, controls generated detail
    logo_show_nodes = Column(Boolean, default=True)
    font = Column(String, default="classic")     # latin font pairing key
    template = Column(String, default="aurora")  # layout/template key
    density = Column(String, default="comfortable")  # comfortable | compact
    show_photo = Column(Boolean, default=True)
    show_fx = Column(Boolean, default=True)      # animated aurora + grain background
    default_lang = Column(String, default="en")
    # Ordered list of {key, enabled}. Defines section order + visibility.
    sections = Column(JSON, default=list)
