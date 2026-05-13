export default function ScoreRing({ score, label, size = 100, color }) {
  const r = (size - 14) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const c = color || (score >= 75 ? '#00d4aa' : score >= 50 ? '#ffa94d' : '#ff6b6b')

  return (
    <div className="score-ring-wrap">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#252a38" strokeWidth="7" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transform:'rotate(-90deg)', transformOrigin:'center', transition:'stroke-dashoffset 1s ease' }} />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fill={c} fontSize="18" fontWeight="800" fontFamily="Syne, sans-serif">
          {Math.round(score)}
        </text>
      </svg>
      <span>{label}</span>
    </div>
  )
}