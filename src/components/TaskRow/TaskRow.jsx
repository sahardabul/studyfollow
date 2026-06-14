import StatusBadge from '../StatusBadge/StatusBadge'
import { formatRelativeDate } from '../../data/appData'

export default function TaskRow({
  task,
  onComplete,
  onUndo,
  onEdit,
  onDelete,
  compact = false,
}) {
  const isDone = task.status === 'Done'

  return (
<<<<<<< HEAD
    <div className={`data-row task-grid-row task-row ${compact ? 'compact-row' : ''}`}>
      <div className="cell-main task-title-cell">
        <div className="row-title">{task.title}</div>
        <div className="muted-text">{task.subtitle || 'No extra notes'}</div>
      </div>

      <div className="cell-pill">
        <div className="course-pill" title={task.course}>
          {task.course}
        </div>
      </div>

      <div>{formatRelativeDate(task.dueDate)}</div>

      <div>
        <StatusBadge value={task.status} />
      </div>

      <div className={`priority priority-${task.priority.toLowerCase()}`}>
        {task.priority}
      </div>

=======
    <div className={`data-row task-grid-row ${compact ? 'compact-row' : ''}`}>
      <div className="cell-main">
        <div className="row-title">{task.title}</div>
        <div className="muted-text">{task.subtitle || 'No extra notes'}</div>
      </div>
      <div className="cell-pill"><div className="course-pill" title={task.course}>{task.course}</div></div>
      <div>{formatRelativeDate(task.dueDate)}</div>
      <StatusBadge value={task.status} />
      <div className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</div>
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
      <div className="row-actions-wrap">
        {isDone ? (
          <button className="row-action" type="button" onClick={() => onUndo?.(task.id)}>
            Undo
          </button>
        ) : (
          <button className="row-action" type="button" onClick={() => onComplete?.(task.id)}>
            Complete
          </button>
        )}
<<<<<<< HEAD

=======
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
        {!compact ? (
          <>
            <button className="row-action ghost-blue" type="button" onClick={() => onEdit?.(task)}>
              Edit
            </button>
            <button className="row-action ghost-danger" type="button" onClick={() => onDelete?.(task.id)}>
              Delete
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
