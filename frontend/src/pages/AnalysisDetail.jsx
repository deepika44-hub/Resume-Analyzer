import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAnalysis, deleteAnalysis } from '../api/client'
import ScoreRing from '../components/ScoreRing'
import FeedbackSection from '../components/FeedbackSection'
import { ArrowLeft, Trash2 } from 'lucide-react'

export default function AnalysisDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getAnalysis(id).then(({ data }) => setAnalysis(data))
      .catch(() => navigate('/history')).finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this analysis?')) return
    await deleteAnalysis(id); navigate('/history')
  }

  if (loading) return <div className="loader-full"><span className="spinner" /></div>
  if (!analysis) return null

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <Link to="/history" className="btn btn-outline" style={{ padding:'7px 14px' }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <div style={{ flex:1 }}>
          <h1 style={{ fontSize:22, fontWeight:800 }}>{analysis.filename}</h1>
          <p style={{ color:'var(--muted)', fontSize:13 }}>
            {analysis.job_title && <span>🎯 {analysis.job_title} · </span>}
            {new Date(analysis.created_at).toLocaleString()}
          </p>
        </div>
        <button className="btn btn-danger" onClick={handleDelete}><Trash2 size={14} /> Delete</button>
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div className="section-title">Scores</div>
        <div className="scores-row">
          <div className="score-card card" style={{ padding:20, textAlign:'center' }}>
            <ScoreRing score={analysis.overall_score} label="Overall Score" size={110} />
          </div>
          <div className="score-card card" style={{ padding:20, textAlign:'center' }}>
            <ScoreRing score={analysis.ats_score} label="ATS Score" size={110} color="#6c63ff" />
          </div>
          {analysis.match_score != null && (
            <div className="score-card card" style={{ padding:20, textAlign:'center' }}>
              <ScoreRing score={analysis.match_score} label="Match Score" size={110} color="#00d4aa" />
            </div>
          )}
        </div>
      </div>

      <div className="results-grid">
        <FeedbackSection type="strengths" items={analysis.strengths} />
        <FeedbackSection type="weaknesses" items={analysis.weaknesses} />
      </div>
      <div style={{ marginTop:20 }}>
        <FeedbackSection type="suggestions" items={analysis.suggestions} />
      </div>

      {analysis.raw_text_preview && (
        <div className="card" style={{ marginTop:20 }}>
          <div className="section-title">📄 Resume Preview</div>
          <pre style={{ fontSize:12, color:'var(--muted)', whiteSpace:'pre-wrap', lineHeight:1.7 }}>
            {analysis.raw_text_preview}…
          </pre>
        </div>
      )}
    </div>
  )
}