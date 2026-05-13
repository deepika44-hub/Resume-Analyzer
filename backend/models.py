from beanie import Document
from pydantic import EmailStr
from typing import Optional, List
from datetime import datetime


class User(Document):
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = None
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"


class ResumeAnalysis(Document):
    user_id: str
    filename: str
    overall_score: float
    ats_score: float
    job_title: Optional[str] = None
    match_score: Optional[float] = None
    strengths: List[str] = []
    weaknesses: List[str] = []
    suggestions: List[str] = []
    raw_text_preview: Optional[str] = None
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "resume_analyses"