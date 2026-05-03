export default function StatusBadge({ value }) {
  const map = {
    'Due Soon': 'warning',
    'In Progress': 'primary',
    'To Do': 'neutral',
    'Done': 'success',
    'Upcoming': 'secondary',
    'Important': 'warning',
  }
  const tone = map[value] || 'neutral'
  return <span className={`badge badge-${tone}`}>{value}</span>
}
