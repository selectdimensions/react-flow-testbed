import os
from sqlalchemy import create_engine, Column, String, Text, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

# Get database URL from environment or use SQLite as fallback
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./flows.db")

# Create SQLAlchemy engine and session factory
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Define Flow model
class Flow(Base):
    __tablename__ = "flows"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    data = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Create all tables
Base.metadata.create_all(bind=engine)

# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()