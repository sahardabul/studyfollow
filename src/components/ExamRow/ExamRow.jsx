import StatusBadge from '../StatusBadge/StatusBadge'
import { formatRelativeDate, formatDateInputForUi } from '../../data/appData'

export default function ExamRow({ exam, onView, onEdit, onDelete }) {
  return (
    <div className="data-row exams-grid-row">
      <div className="cell-main">
        <div className="row-title">{exam.title}</div>
        <div className="muted-text">{exam.course}</div>
      </div>
      <div>{formatRelativeDate(exam.date)}</div>
      <div>{exam.time}</div>
      <div>{exam.location}</div>
      <StatusBadge value={exam.status} />
      <div className="row-actions-wrap">
        <button className="row-action" type="button" onClick={() => onView?.(exam)}>
          View
        </button>
        <button className="row-action ghost-blue" type="button" onClick={() => onEdit?.(exam)}>
          Edit
        </button>
        <button className="row-action ghost-danger" type="button" onClick={() => onDelete?.(exam.id)}>
          Delete
        </button>
      </div>
      <div className="sr-only">{formatDateInputForUi(exam.date)}</div>
    </div>
  )
}
