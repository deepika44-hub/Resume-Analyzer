from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserOut(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    created_at: datetime


class AnalysisOut(BaseModel):
    id: str
    filename: str
    overall_score: float
    ats_score: float
    job_title: Optional[str]
    match_score: Optional[float]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    raw_text_preview: Optional[str]
    created_at: datetime