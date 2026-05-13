import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { analyzeResume } from '../api/client'
import ScoreRing from '../components/ScoreRing'
import FeedbackSection from '../components/FeedbackSection'
import { Upload, FileText, Target } from 'lucide-react'

export default function Analyze() {
  const [file, setFile]       = useState(null)
  const [jobTitle, setJobTitle] = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const onDrop = useCallback((accepted) => { if (accepted.length) setFile(accepted[0]) }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true); setError(''); setResult(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (jobTitle.trim()) fd.append('job_title', jobTitle.trim())
      const { data } = await analyzeResume(fd)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:8 }}>Analyze Resume</h1>
      <p style={{ color:'var(--muted)', marginBottom:28 }}>Upload a PDF and get instant AI-powered feedback.</p>

      <div className="card" style={{ marginBottom:24 }}>
        <div {...getRootProps()} className={`dropzone${isDragActive ? ' active' : ''}`}>
          <input {...getInputProps()} />
          <div className="dropzone-icon"><Upload size={36} /></div>
          <h3>{isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}</h3>
          <p>or click to browse — PDF only, max 5 MB</p>
        </div>

        {file && (
          <div className="file-selected">
            <FileText size={18} color="var(--success)" />
            <span>{file.name}</span>
            <button style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:18 }}
              onClick={() => setFile(null)}>×</button>
          </div>
        )}

        <div className="form-group" style={{ marginTop:20, marginBottom:0 }}>
          <label><Target size={14} style={{ verticalAlign:'middle', marginRight:4 }} />
            Target Job Title <span style={{ color:'var(--muted)', fontSize:12 }}>(optional)</span>
          </label>
          <input className="input" placeholder="e.g. Senior Software Engineer, Product Manager…"
            value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        </div>

        {error && <p className="form-error" style={{ marginTop:12 }}>{error}</p>}

        <button className="btn btn-primary"
          style={{ marginTop:20, width:'100%', justifyContent:'center', fontSize:15, padding:'13px' }}
          onClick={handleAnalyze} disabled={!file || loading}>
          {loading
            ? <><span className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> Analyzing with AI…</>
            : '🚀 Analyze Resume'}
        </button>
      </div>

      {loading && (
        <div className="card" style={{ textAlign:'center', padding:48 }}>
          <span className="spinner" style={{ width:48, height:48 }} />
          <p style={{ marginTop:20, color:'var(--muted)' }}>Claude is reading your resume…</p>
        </div>
      )}

      {result && <ResultView result={result} />}
    </div>
  )
}

function ResultView({ result }) {
  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20 }}>📊 Analysis Results</h2>
      <div className="card" style={{ marginBottom:20 }}>
        <div className="section-title">Scores</div>
        <div className="scores-row">
          <div className="score-card card" style={{ padding:20, textAlign:'center' }}>
            <ScoreRing score={result.overall_score} label="Overall Score" size={110} />
          </div>
          <div className="score-card card" style={{ padding:20, textAlign:'center' }}>
            <ScoreRing score={result.ats_score} label="ATS Score" size={110} color="#6c63ff" />
          </div>
          {result.match_score != null && (
            <div className="score-card card" style={{ padding:20, textAlign:'center' }}>
              <ScoreRing score={result.match_score} label={`Match: ${result.job_title}`} size={110} color="#00d4aa" />
            </div>
          )}
        </div>
      </div>
      <div className="results-grid">
        <FeedbackSection type="strengths" items={result.strengths} />
        <FeedbackSection type="weaknesses" items={result.weaknesses} />
      </div>
      <div style={{ marginTop:20 }}>
        <FeedbackSection type="suggestions" items={result.suggestions} />
      </div>
      {result.match_score != null && result.match_feedback?.length > 0 && (
        <div className="card" style={{ marginTop:20 }}>
          <div className="section-title">🎯 Job Match Feedback</div>
          {result.match_feedback.map((item, i) => (
            <div className="list-item" key={i}><span>→ {item}</span></div>
          ))}
        </div>
      )}
    </div>
  )
}