import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'

const configs = {
  strengths:   { icon: CheckCircle2, color: '#00d4aa', title: '✅ Strengths' },
  weaknesses:  { icon: XCircle,      color: '#ff6b6b', title: '❌ Weaknesses' },
  suggestions: { icon: Lightbulb,    color: '#6c63ff', title: '💡 Suggestions' },
}

export default function FeedbackSection({ type, items }) {
  const { icon: Icon, color, title } = configs[type]
  return (
    <div className="card">
      <div className="section-title">{title}</div>
      {items.length === 0
        ? <p style={{ color:'var(--muted)', fontSize:14 }}>None found.</p>
        : items.map((item, i) => (
            <div className="list-item" key={i}>
              <Icon size={16} color={color} className="list-icon" />
              <span>{item}</span>
            </div>
          ))}
    </div>
  )
}