from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional, List
import models, schemas
from auth_utils import get_current_user
from services.pdf_parser import extract_text_from_pdf
from services.ai_analyzer import analyze_resume

router = APIRouter()


@router.post("/analyze", response_model=schemas.AnalysisOut)
async def analyze(
    file: UploadFile = File(...),
    job_title: Optional[str] = Form(None),
    current_user: models.User = Depends(get_current_user),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be under 5 MB.")

    try:
        resume_text = extract_text_from_pdf(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        result = analyze_resume(resume_text, job_title=job_title)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    analysis = models.ResumeAnalysis(
        user_id=str(current_user.id),
        filename=file.filename,
        overall_score=result["overall_score"],
        ats_score=result["ats_score"],
        job_title=job_title,
        match_score=result.get("match_score"),
        strengths=result.get("strengths", []),
        weaknesses=result.get("weaknesses", []),
        suggestions=result.get("suggestions", []),
        raw_text_preview=resume_text[:500],
    )
    await analysis.insert()
    return _to_schema(analysis)


@router.get("/history", response_model=List[schemas.AnalysisOut])
async def history(current_user: models.User = Depends(get_current_user)):
    analyses = await models.ResumeAnalysis.find(
        models.ResumeAnalysis.user_id == str(current_user.id)
    ).sort(-models.ResumeAnalysis.created_at).to_list()
    return [_to_schema(a) for a in analyses]


@router.get("/history/{analysis_id}", response_model=schemas.AnalysisOut)
async def get_analysis(
    analysis_id: str,
    current_user: models.User = Depends(get_current_user),
):
    analysis = await models.ResumeAnalysis.get(analysis_id)
    if not analysis or analysis.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return _to_schema(analysis)


@router.delete("/history/{analysis_id}")
async def delete_analysis(
    analysis_id: str,
    current_user: models.User = Depends(get_current_user),
):
    analysis = await models.ResumeAnalysis.get(analysis_id)
    if not analysis or analysis.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Analysis not found.")
    await analysis.delete()
    return {"message": "Deleted successfully"}


def _to_schema(a: models.ResumeAnalysis) -> schemas.AnalysisOut:
    return schemas.AnalysisOut(
        id=str(a.id),
        filename=a.filename,
        overall_score=a.overall_score,
        ats_score=a.ats_score,
        job_title=a.job_title,
        match_score=a.match_score,
        strengths=a.strengths,
        weaknesses=a.weaknesses,
        suggestions=a.suggestions,
        raw_text_preview=a.raw_text_preview,
        created_at=a.created_at,
    )