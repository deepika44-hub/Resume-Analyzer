from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "resume_analyzer")


async def init_db():
    from models import User, ResumeAnalysis
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    await init_beanie(
        database=db,
        document_models=[User, ResumeAnalysis],
    )
    print(f"✅ Connected to MongoDB: {DB_NAME}")