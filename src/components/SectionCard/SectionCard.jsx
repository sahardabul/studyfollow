export default function SectionCard({ title, action, onAction, children, className = '' }) {
  return (
    <section className={`glass-card section-card ${className}`.trim()}>
      <div className="section-head">
        <h3>{title}</h3>
        {action ? (
          <button className="text-link" onClick={onAction} type="button">
            {action}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  )
}
