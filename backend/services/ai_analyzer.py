from groq import Groq
import json, os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_resume(resume_text: str, job_title: str = None) -> dict:
    job_section = ""
    if job_title:
        job_section = f"""
Also evaluate how well this resume matches the role: "{job_title}".
Include "match_score" (0-100) and "match_feedback" (list of strings) in your JSON.
"""

    prompt = f"""You are an expert career coach and ATS specialist.
Analyze the following resume and return ONLY a valid JSON object. No extra text, no markdown, no backticks.

JSON structure:
{{
  "overall_score": <integer 0-100>,
  "ats_score": <integer 0-100>,
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "suggestions": ["...", "...", "..."],
  "match_score": <integer 0-100 or null>,
  "match_feedback": ["...", "..."] or []
}}
{job_section}

Resume:
\"\"\"{resume_text[:6000]}\"\"\"
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
    )

    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    result = json.loads(raw)
    result.setdefault("match_score", None)
    result.setdefault("match_feedback", [])
    return result