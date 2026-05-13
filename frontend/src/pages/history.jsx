import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHistory, deleteAnalysis } from '../api/client'
import { FileText, Trash2, ChevronRight } from 'lucide-react'

export default function History() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getHistory().then(({ data }) => setAnalyses(data)).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, e) => {
    e.preventDefault(); e.stopPropagation()
    if (!confirm('Delete this analysis?')) return
    await deleteAnalysis(id)
    setAnalyses((prev) => prev.filter((a) => a.id !== id))
  }

  const scoreColor = (s) => s >= 75 ? 'badge-green' : s >= 50 ? 'badge-yellow' : 'badge-red'

  if (loading) return <div className="loader-full"><span className="spinner" /></div>

  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:8 }}>Analysis History</h1>
      <p style={{ color:'var(--muted)', marginBottom:28 }}>All your past resume analyses, newest first.</p>
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {analyses.length === 0 ? (
          <div style={{ padding:48, textAlign:'center', color:'var(--muted)' }}>
            <FileText size={40} style={{ marginBottom:12, opacity:0.4 }} />
            <p>No analyses yet. <Link to="/analyze" style={{ color:'var(--accent)' }}>Analyze your first resume →</Link></p>
          </div>
        ) : analyses.map((a) => (
          <Link to={`/history/${a.id}`} key={a.id} style={{ textDecoration:'none', color:'inherit' }}>
            <div className="history-item">
              <FileText size={20} color="var(--accent)" style={{ flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.filename}</div>
                <div className="history-meta">
                  {a.job_title && <span style={{ marginRight:12 }}>🎯 {a.job_title}</span>}
                  {new Date(a.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                <span className={`badge ${scoreColor(a.overall_score)}`}>{Math.round(a.overall_score)}</span>
                <span className="badge badge-purple">ATS {Math.round(a.ats_score)}</span>
                <button className="btn btn-danger" style={{ padding:'5px 10px', fontSize:12 }}
                  onClick={(e) => handleDelete(a.id, e)}><Trash2 size={13} /></button>
                <ChevronRight size={16} color="var(--muted)" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}