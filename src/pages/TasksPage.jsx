import { useEffect, useMemo, useState } from 'react'
import TaskRow from '../components/TaskRow/TaskRow'
import { getStoredTasks, isDueSoon, playSuccessSound, saveStoredTasks } from '../data/appData'

const emptyForm = {
  title: '',
  subtitle: '',
  course: '',
  dueDate: '',
  priority: 'Medium',
  status: 'To Do',
}

export default function TasksPage() {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [taskList, setTaskList] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const syncTasks = () => setTaskList(getStoredTasks())
    syncTasks()
    window.addEventListener('studyfollow-data-updated', syncTasks)
    window.addEventListener('storage', syncTasks)
    return () => {
      window.removeEventListener('studyfollow-data-updated', syncTasks)
      window.removeEventListener('storage', syncTasks)
    }
  }, [])

  const filtered = useMemo(() => {
    return taskList.filter((task) => {
      const matchesFilter =
        filter === 'All'
          ? true
          : filter === 'Due Soon'
            ? task.status === 'Due Soon' || (task.status !== 'Done' && isDueSoon(task.dueDate))
            : task.status === filter

      const matchesQuery = `${task.title} ${task.course} ${task.subtitle}`.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [taskList, filter, query])

  const persist = (next) => {
    setTaskList(next)
    saveStoredTasks(next)
  }

  const handleCompleteTask = (taskId) => {
    let becameDone = false
    const next = taskList.map((task) => {
      if (task.id !== taskId) return task
      if (task.status !== 'Done') becameDone = true
      return { ...task, status: 'Done' }
    })
    persist(next)
    if (becameDone) {
      playSuccessSound()
      window.dispatchEvent(new CustomEvent('studyfollow-confetti'))
      window.dispatchEvent(new CustomEvent('studyfollow-toast', { detail: { title: 'Task completed', message: 'The task moved to Done and your dashboard was updated.' } }))
    }
  }

  const handleUndoTask = (taskId) => {
    persist(taskList.map((task) => (task.id === taskId ? { ...task, status: 'To Do' } : task)))
    window.dispatchEvent(new CustomEvent('studyfollow-toast', { detail: { title: 'Task restored', message: 'The task is back in your active list.' } }))
  }

  const handleDeleteTask = (taskId) => {
    persist(taskList.filter((task) => task.id !== taskId))
    window.dispatchEvent(new CustomEvent('studyfollow-toast', { detail: { title: 'Task deleted', message: 'The task was removed from your list.' } }))
  }

  const openCreateForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm((prev) => !prev)
  }

  const handleEditTask = (task) => {
    setEditingId(task.id)
    setForm({
      title: task.title,
      subtitle: task.subtitle,
      course: task.course,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    })
    setShowForm(true)
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    const payload = { ...form }

    if (editingId) {
      persist(taskList.map((task) => (task.id === editingId ? { ...task, ...payload } : task)))
      window.dispatchEvent(new CustomEvent('studyfollow-toast', { detail: { title: 'Task updated', message: 'Your changes were saved successfully.' } }))
    } else {
      const newTask = {
        id: Date.now(),
        ...payload,
      }
      persist([newTask, ...taskList])
      window.dispatchEvent(new CustomEvent('studyfollow-toast', { detail: { title: 'New task added', message: 'The new task is now part of your plan.' } }))
    }

    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <span className="label-chip">Task control</span>
        <h1>נהל את כל המטלות שלך במקום אחד</h1>
        <p className="muted-text large-text">סנן, חפש, ערוך ותעדף את מה שצריך לסיים השבוע.</p>
      </section>

      <section className="toolbar glass-card">
        <div className="search-shell">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש משימה או קורס..."
          />
        </div>
        <div className="filter-group">
          {['All', 'Due Soon', 'In Progress', 'To Do', 'Done'].map((item) => (
            <button
              key={item}
              className={`filter-button ${filter === item ? 'active' : ''}`}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <button className="primary-button add-button" type="button" onClick={openCreateForm}>
          {showForm && !editingId ? 'Close' : '+ Add Task'}
        </button>
      </section>

      {showForm && (
        <section className="glass-card table-card form-card fade-in-up">
          <form className="profile-form task-form-grid" onSubmit={handleAddTask}>
            <label>
              <span>Task Title</span>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label>
              <span>Subtitle</span>
              <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </label>
            <label>
              <span>Course</span>
              <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required />
            </label>
            <label>
              <span>Due Date</span>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
            </label>
            <label>
              <span>Priority</span>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
            <label>
              <span>Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>To Do</option>
                <option>Due Soon</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </label>
            <div className="form-actions-inline form-actions-span">
              <button className="primary-button" type="submit">{editingId ? 'Update Task' : 'Save Task'}</button>
              <button className="secondary-button" type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="glass-card table-card tasks-table-card">
        <div className="table-head tasks-head-wide">
          <span>Task</span>
          <span>Course</span>
          <span>Due</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Actions</span>
        </div>
        <div className="data-table">
          {filtered.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onUndo={handleUndoTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
          {filtered.length === 0 ? <div className="empty-state">No tasks found for this filter.</div> : null}
        </div>
      </section>
    </div>
  )
}
