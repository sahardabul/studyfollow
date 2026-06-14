import StatusBadge from '../StatusBadge/StatusBadge'
import { formatDateInputForUi } from '../../data/appData'

export default function ExamRow({
  exam,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="data-row exams-grid-row exam-row">
      <div className="cell-main exam-title-cell">
        <div className="row-title">{exam.title}</div>
        <div className="muted-text">{exam.course || 'No course'}</div>
      </div>

      <div>{formatDateInputForUi(exam.date)}</div>

      <div>{exam.time}</div>

      <div>{exam.location}</div>

      <div>
        <StatusBadge value={exam.status} />
      </div>

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
    </div>
  )
}