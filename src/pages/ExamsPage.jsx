import { useEffect, useMemo, useState } from 'react'
import ExamRow from '../components/ExamRow/ExamRow'
import SectionCard from '../components/SectionCard/SectionCard'
import { formatDateInputForUi } from '../data/appData'
import { fetchExams, createExam, updateExam, deleteExam } from '../lib/examsApi'

const emptyForm = {
  title: '',
  course: '',
  date: '',
  time: '',
  location: '',
  status: 'Upcoming',
}

export default function ExamsPage() {
  const [examList, setExamList] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const loadExams = async () => {
    try {
      const data = await fetchExams()
      setExamList(data)
    } catch (error) {
      console.error('Failed to load exams:', error)
      window.dispatchEvent(
        new CustomEvent('studyfollow-toast', {
          detail: {
            title: 'Load failed',
            message: 'Could not load exams from Supabase.',
          },
        })
      )
    }
  }

  useEffect(() => {
    loadExams()
  }, [])

  const orderedExams = useMemo(
    () => [...examList].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [examList]
  )

  const handleAddExam = async (e) => {
    e.preventDefault()
    const payload = { ...form }

    try {
      if (editingId) {
        await updateExam(editingId, payload)
        window.dispatchEvent(
          new CustomEvent('studyfollow-toast', {
            detail: {
              title: 'Exam updated',
              message: 'The exam details were updated.',
            },
          })
        )
      } else {
        await createExam(payload)
        window.dispatchEvent(
          new CustomEvent('studyfollow-toast', {
            detail: {
              title: 'New exam added',
              message: 'The new exam was added to your calendar.',
            },
          })
        )
      }

      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
      await loadExams()
    } catch (error) {
      console.error('Failed to save exam:', error)
      window.dispatchEvent(
        new CustomEvent('studyfollow-toast', {
          detail: {
            title: 'Save failed',
            message: 'Could not save the exam.',
          },
        })
      )
    }
  }

  const handleViewExam = (exam) => {
    window.dispatchEvent(
      new CustomEvent('studyfollow-toast', {
        detail: {
          title: exam.title,
          message: `${exam.course} · ${formatDateInputForUi(exam.date)} · ${exam.time}`,
        },
      })
    )
  }

  const handleEditExam = (exam) => {
    setEditingId(exam.id)
    setForm({
      title: exam.title,
      course: exam.course,
      date: exam.date,
      time: exam.time,
      location: exam.location,
      status: exam.status,
    })
    setShowForm(true)
  }

  const handleDeleteExam = async (examId) => {
    try {
      await deleteExam(examId)
      await loadExams()

      window.dispatchEvent(
        new CustomEvent('studyfollow-toast', {
          detail: {
            title: 'Exam deleted',
            message: 'The exam was removed.',
          },
        })
      )
    } catch (error) {
      console.error('Failed to delete exam:', error)
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <span className="label-chip alt">Exam radar</span>
        <h1>שמור על שליטה מלאה במבחנים הקרובים</h1>
        <p className="muted-text large-text">
          ריכוז של מועדים, זמנים ומיקומים באותו מבט ברור — עם יכולת עריכה מלאה.
        </p>
      </section>

      <section className="toolbar glass-card">
        <div />
        <button
          className="primary-button add-button"
          type="button"
          onClick={() => {
            setShowForm((p) => !p)
            if (showForm) {
              setEditingId(null)
              setForm(emptyForm)
            }
          }}
        >
          {showForm && !editingId ? 'Close' : '+ Add Exam'}
        </button>
      </section>

      {showForm && (
        <section className="glass-card table-card form-card fade-in-up">
          <form className="profile-form task-form-grid" onSubmit={handleAddExam}>
            <label>
              <span>Exam Title</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>

            <label>
              <span>Course</span>
              <input
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                required
              />
            </label>

            <label>
              <span>Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </label>

            <label>
              <span>Time</span>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </label>

            <label>
              <span>Location</span>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </label>

            <label>
              <span>Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Upcoming</option>
                <option>Important</option>
              </select>
            </label>

            <div className="form-actions-inline form-actions-span">
              <button className="primary-button" type="submit">
                {editingId ? 'Update Exam' : 'Save Exam'}
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setForm(emptyForm)
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="exam-cards-grid">
        {orderedExams.map((exam) => (
          <SectionCard key={exam.id} title={exam.title} className="interactive-card">
            <div className="exam-highlight">
              <span className="course-pill">{exam.course}</span>
              <div className="exam-date">{formatDateInputForUi(exam.date)}</div>
              <div className="muted-text">
                {exam.time} · {exam.location}
              </div>
            </div>
          </SectionCard>
        ))}
      </section>

      <section className="glass-card table-card exams-table-card">
        <div className="table-head exams-head-wide">
          <span>Exam</span>
          <span>Date</span>
          <span>Time</span>
          <span>Location</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="data-table">
          {orderedExams.map((exam) => (
            <ExamRow
              key={exam.id}
              exam={exam}
              onView={handleViewExam}
              onEdit={handleEditExam}
              onDelete={handleDeleteExam}
            />
          ))}

          {orderedExams.length === 0 ? (
            <div className="empty-state">No exams saved yet.</div>
          ) : null}
        </div>
      </section>
    </div>
  )
}