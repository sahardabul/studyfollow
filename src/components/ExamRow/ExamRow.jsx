import StatusBadge from '../StatusBadge/StatusBadge'
<<<<<<< HEAD
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

=======
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
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
      <div className="row-actions-wrap">
        <button className="row-action" type="button" onClick={() => onView?.(exam)}>
          View
        </button>
<<<<<<< HEAD

        <button className="row-action ghost-blue" type="button" onClick={() => onEdit?.(exam)}>
          Edit
        </button>

=======
        <button className="row-action ghost-blue" type="button" onClick={() => onEdit?.(exam)}>
          Edit
        </button>
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
        <button className="row-action ghost-danger" type="button" onClick={() => onDelete?.(exam.id)}>
          Delete
        </button>
      </div>
<<<<<<< HEAD
    </div>
  )
}
=======
      <div className="sr-only">{formatDateInputForUi(exam.date)}</div>
    </div>
  )
}
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
