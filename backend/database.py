from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from config import load_env_file

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_env_file(os.path.join(BASE_DIR, ".env"))
DB_PATH = os.path.join(BASE_DIR, "portfolio.db")

# To switch to PostgreSQL later, set DATABASE_URL env var, e.g.
# postgresql+psycopg2://user:pass@host:5432/dbname
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DB_PATH}")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
