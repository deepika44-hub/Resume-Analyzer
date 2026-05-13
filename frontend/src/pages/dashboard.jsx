import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHistory } from '../api/client'
import { FileText, TrendingUp, Award, Plus, Clock } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function Dashboard() {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getHistory().then(({ data }) => setAnalyses(data)).finally(() => setLoading(false))
  }, [])

  const avg = (arr, key) => arr.length ? Math.round(arr.reduce((s, a) => s + a[key], 0) / arr.length) : 0
  const best = analyses.length ? analyses.reduce((b, a) => a.overall_score > b.overall_score ? a : b) : null
  const scoreColor = (s) => s >= 75 ? 'var(--success)' : s >= 50 ? 'var(--warning)' : 'var(--danger)'

  const radarData = [
    { subject: 'Overall', value: avg(analyses, 'overall_score') },
    { subject: 'ATS',     value: avg(analyses, 'ats_score') },
    { subject: 'Match',   value: avg(analyses.filter(a => a.match_score != null), 'match_score') || 0 },
  ]

  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>
        Welcome back, {user?.full_name?.split(' ')[0] || 'there'} 👋
      </h1>
      <p style={{ color:'var(--muted)', marginBottom:32 }}>Here's your resume performance at a glance.</p>

      <div className="stats-row">
        <div className="card stat-card">
          <div className="stat-num" style={{ color:'var(--accent)' }}>{analyses.length}</div>
          <div className="stat-label"><FileText size={13} style={{ verticalAlign:'middle', marginRight:4 }} />Analyses Done</div>
        </div>
        <div className="card stat-card">
          <div className="stat-num" style={{ color: scoreColor(avg(analyses, 'overall_score')) }}>
            {analyses.length ? avg(analyses, 'overall_score') : '—'}
          </div>
          <div className="stat-label"><TrendingUp size={13} style={{ verticalAlign:'middle', marginRight:4 }} />Avg Overall Score</div>
        </div>
        <div className="card stat-card">
          <div className="stat-num" style={{ color:'var(--accent2)' }}>
            {best ? Math.round(best.overall_score) : '—'}
          </div>
          <div className="stat-label"><Award size={13} style={{ verticalAlign:'middle', marginRight:4 }} />Best Score</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
        {analyses.length > 0 && (
          <div className="card">
            <div className="section-title">📈 Performance Overview</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#252a38" />
                <PolarAngleAxis dataKey="subject" tick={{ fill:'#7a7f9a', fontSize:13 }} />
                <Radar dataKey="value" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.25} />
                <Tooltip contentStyle={{ background:'#13161e', border:'1px solid #252a38', borderRadius:8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div className="section-title">⚡ Quick Actions</div>
          <Link to="/analyze" className="btn btn-primary" style={{ justifyContent:'center' }}>
            <Plus size={16} /> Analyze New Resume
          </Link>
          <Link to="/history" className="btn btn-outline" style={{ justifyContent:'center' }}>
            <Clock size={16} /> View Full History
          </Link>
        </div>
      </div>

      {analyses.length > 0 && (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid var(--border)' }}>
            <div className="section-title" style={{ marginBottom:0 }}>🕐 Recent Analyses</div>
          </div>
          {analyses.slice(0, 5).map((a) => (
            <Link to={`/history/${a.id}`} key={a.id} style={{ textDecoration:'none', color:'inherit' }}>
              <div className="history-item">
                <FileText size={18} color="var(--accent)" />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.filename}</div>
                  <div className="history-meta">{new Date(a.created_at).toLocaleDateString()}</div>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color: scoreColor(a.overall_score) }}>
                  {Math.round(a.overall_score)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {analyses.length === 0 && !loading && (
        <div className="card" style={{ textAlign:'center', padding:64 }}>
          <FileText size={48} style={{ color:'var(--accent)', marginBottom:16, opacity:0.6 }} />
          <h3 style={{ marginBottom:8 }}>No analyses yet</h3>
          <p style={{ color:'var(--muted)', marginBottom:24 }}>Upload your first resume to get AI feedback in seconds.</p>
          <Link to="/analyze" className="btn btn-primary">🚀 Analyze My Resume</Link>
        </div>
      )}
    </div>
  )
}