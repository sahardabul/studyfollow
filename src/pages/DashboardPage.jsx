import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard/StatCard'
import SectionCard from '../components/SectionCard/SectionCard'
import TaskRow from '../components/TaskRow/TaskRow'
import {
  dailyInsights,
  focusTip,
  schedule,
  formatDateInputForUi,
  formatRelativeDate,
  getDynamicDashboardStats,
  getStoredExams,
  getStoredTasks,
  playSuccessSound,
  saveStoredTasks,
} from '../data/appData'

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('studyfollow_active_user') || 'null')
  const navigate = useNavigate()

  const [taskList, setTaskList] = useState([])
  const [examList, setExamList] = useState([])
  const [sessionRunning, setSessionRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(focusTip.minutes * 60)
  const [insightIndex, setInsightIndex] = useState(0)

  useEffect(() => {
    const syncData = () => {
      setTaskList(getStoredTasks())
      setExamList(getStoredExams())
    }
    syncData()
    window.addEventListener('studyfollow-data-updated', syncData)
    window.addEventListener('storage', syncData)
    return () => {
      window.removeEventListener('studyfollow-data-updated', syncData)
      window.removeEventListener('storage', syncData)
    }
  }, [])

  useEffect(() => {
    const insightTimer = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % dailyInsights.length)
    }, 4200)
    return () => clearInterval(insightTimer)
  }, [])

  useEffect(() => {
    if (!sessionRunning) return

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setSessionRunning(false)
          return focusTip.minutes * 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionRunning])

  const handleCompleteTask = (taskId) => {
    let becameDone = false
    const next = taskList.map((task) => {
      if (task.id !== taskId) return task
      if (task.status !== 'Done') becameDone = true
      return { ...task, status: 'Done' }
    })
    setTaskList(next)
    saveStoredTasks(next)
    if (becameDone) {
      playSuccessSound()
      window.dispatchEvent(new CustomEvent('studyfollow-confetti'))
      window.dispatchEvent(new CustomEvent('studyfollow-toast', { detail: { title: 'Task completed', message: 'Great job — your progress was updated.' } }))
    }
  }

  const handleUndoTask = (taskId) => {
    const next = taskList.map((task) =>
      task.id === taskId ? { ...task, status: 'To Do' } : task
    )
    setTaskList(next)
    saveStoredTasks(next)
    window.dispatchEvent(new CustomEvent('studyfollow-toast', { detail: { title: 'Task restored', message: 'The task was returned to your active tasks.' } }))
  }

  const progress = useMemo(() => {
    const total = focusTip.minutes * 60
    return ((total - secondsLeft) / total) * 100
  }, [secondsLeft])

  const stats = useMemo(() => getDynamicDashboardStats(taskList, examList, schedule), [taskList, examList])
  const completedTasks = useMemo(() => taskList.filter((task) => task.status === 'Done').length, [taskList])
  const totalTasks = taskList.length || 1
  const completionRate = Math.round((completedTasks / totalTasks) * 100)

  const todayBoard = useMemo(() => {
    const activeTasks = taskList
      .filter((task) => task.status !== 'Done')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 2)
      .map((task) => ({
        id: `task-${task.id}`,
        time: formatRelativeDate(task.dueDate),
        title: task.title,
        detail: `משימה · ${task.course}`,
      }))

    const upcomingExams = examList
      .filter((exam) => new Date(exam.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 1)
      .map((exam) => ({
        id: `exam-${exam.id}`,
        time: exam.time || formatRelativeDate(exam.date),
        title: exam.title,
        detail: `מבחן · ${exam.course} · ${formatRelativeDate(exam.date)}`,
      }))

    return [...activeTasks, ...upcomingExams].slice(0, 3)
  }, [taskList, examList])

  const liveReminders = useMemo(() => {
    const taskReminders = taskList
      .filter((task) => task.status !== 'Done')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 2)
      .map((task) => `לסיים את ${task.title} · ${formatRelativeDate(task.dueDate)}`)

    const examReminders = examList
      .filter((exam) => new Date(exam.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2)
      .map((exam) => `להתכונן ל-${exam.title} · ${formatDateInputForUi(exam.date)} בשעה ${exam.time}`)

    return [...taskReminders, ...examReminders].slice(0, 4)
  }, [taskList, examList])

  return (
    <div className="page-stack">
      <section className="hero-grid glass-card hero-panel">
        <div className="hero-copy fade-in-up">
          <span className="label-chip">תובנה יומית</span>
          <h1 key={insightIndex} className="rotating-insight">{dailyInsights[insightIndex]}</h1>
          <p className="muted-text large-text">
            ברוך הבא, {user?.fullName || 'Student'}. כל המידע שלך זמין במקום אחד עם מבט נקי, חד וממוקד.
          </p>
        </div>
        <div className="score-orb soft-float" style={{ '--completion': `${completionRate}%` }}>
          <div className="score-orb-inner">
            <div className="score-value">{completionRate}%</div>
            <div className="muted-text">התקדמות משימות</div>
            <div className="orb-subtext"><span className="he-count"><span className="num">{completedTasks}</span><span>מתוך</span><span className="num">{taskList.length}</span><span>הושלמו</span></span></div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="dashboard-grid">
        <SectionCard title="מומלץ עבורך" className="hover-rise">
          <div className="focus-box">
            <div className="focus-ring pulse-glow" style={{ '--progress': `${progress}%` }}>
              <strong>{formatSeconds(secondsLeft)}</strong>
              <span>ספירה לאחור</span>
            </div>
            <div>
              <div className="row-title">מנוע פוקוס</div>
              <p className="muted-text">התחל עם המשימה הכי קשה כשהריכוז שלך בשיא. ספרינט אחד ממוקד עכשיו חוסך שעות אחר כך.</p>
              <div className="button-stack-inline">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setSessionRunning((prev) => !prev)}
                >
                  {sessionRunning ? 'השהה סשן' : 'התחל סשן'}
                </button>
                <button className="text-link" type="button" onClick={() => setSecondsLeft(focusTip.minutes * 60)}>
                  איפוס
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="משימות קרובות" action="View all" onAction={() => navigate('/tasks')} className="hover-rise overflow-guard">
          <div className="data-table compact-table dashboard-task-preview">
            {taskList
              .slice()
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 3)
              .map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  compact
                  onComplete={handleCompleteTask}
                  onUndo={handleUndoTask}
                />
              ))}
          </div>
        </SectionCard>
      </section>

      <section className="dashboard-grid lower-grid">
        <SectionCard title="לוח היום" className="hover-rise">
          <div className="schedule-list">
            {todayBoard.length > 0 ? todayBoard.map((item) => (
              <div className="schedule-item interactive-card" key={item.id}>
                <div className="schedule-time">{item.time}</div>
                <div>
                  <div className="row-title">{item.title}</div>
                  <div className="muted-text">{item.detail}</div>
                </div>
              </div>
            )) : (
              <div className="reminder-item interactive-card">אין משימות או מבחנים קרובים כרגע.</div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="תזכורות" action="למבחנים" onAction={() => navigate('/exams')} className="hover-rise">
          <div className="reminder-list">
            {liveReminders.length > 0 ? liveReminders.map((reminder, index) => (
              <div className="reminder-item interactive-card" key={reminder} style={{ animationDelay: `${index * 120}ms` }}>{reminder}</div>
            )) : (
              <div className="reminder-item interactive-card">אין תזכורות פעילות. כל הכבוד.</div>
            )}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
