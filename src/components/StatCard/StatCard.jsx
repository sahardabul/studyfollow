export default function StatCard({ title, value, helper, tone }) {
  return (
    <article className={`glass-card stat-card tone-${tone}`}>
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="muted-text">{helper}</div>
    </article>
  )
}
