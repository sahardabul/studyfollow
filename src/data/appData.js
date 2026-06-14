export const dashboardStats = [
  { title: "Today's Classes", value: '0', helper: 'No classes scheduled', tone: 'primary' },
  { title: 'Pending Tasks', value: '0', helper: 'No pending tasks', tone: 'accent' },
  { title: 'Upcoming Exams', value: '0', helper: 'No upcoming exams', tone: 'secondary' },
]

export const focusTip = {
  title: 'Focus Engine',
  body: 'Start with the hardest task when your energy is highest. One focused sprint now saves hours later.',
  cta: 'Start Session',
  minutes: 45,
}

export const dailyInsights = [
  'הריכוז שלך נמצא בשיאו. זמן לצלוח את המשימות הקשות.',
  'פתיחה עם המשימה הכי חשובה תחסוך לך לחץ בסוף היום.',
  'אם יש מבחן קרוב, עדיף לחלק את הלמידה לבלוקים קצרים וממוקדים.',
  'סיום שתי משימות קטנות עכשיו עדיף על דחייה של כולן למחר.',
]

export const reminders = [
  'Submit UI assignment before 23:59',
  'Review Data Structures for tomorrow',
  'Meet project partner at 18:30',
]

export const tasks = [
  {
    id: 1,
    title: 'UI Assignment 5',
    subtitle: 'Polish mockups and upload the final PDF',
    course: 'Human Computer Interaction',
    dueDate: '2026-05-04',
    priority: 'High',
    status: 'To Do',
  },
  {
    id: 2,
    title: 'Algorithms Practice Set',
    subtitle: 'Solve sorting and complexity questions',
    course: 'Algorithms',
    dueDate: '2026-05-05',
    priority: 'High',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'Database Summary Sheet',
    subtitle: 'Review joins, normalization and keys',
    course: 'Databases',
    dueDate: '2026-05-12',
    priority: 'Medium',
    status: 'To Do',
  },
  {
    id: 4,
    title: 'English Reflection',
    subtitle: 'Write one-page response',
    course: 'Business English',
    dueDate: '2026-05-14',
    priority: 'Low',
    status: 'Done',
  },
  {
    id: 5,
    title: 'React Review',
    subtitle: 'Read component patterns and hooks notes',
    course: 'Web Development',
    dueDate: '2026-05-17',
    priority: 'Medium',
    status: 'To Do',
  },
]

export const exams = [
  {
    id: 1,
    title: 'Data Structures Midterm',
    course: 'Data Structures',
    date: '2026-05-20',
    time: '10:00',
    location: 'Room 304',
    status: 'Upcoming',
  },
  {
    id: 2,
    title: 'Algorithms Quiz',
    course: 'Algorithms',
    date: '2026-05-24',
    time: '13:30',
    location: 'Zoom',
    status: 'Important',
  },
  {
    id: 3,
    title: 'Databases Final',
    course: 'Databases',
    date: '2026-06-01',
    time: '09:00',
    location: 'Auditorium B',
    status: 'Upcoming',
  },
]

export const schedule = [
  { time: '09:00', title: 'UI Design', location: 'Studio 2' },
  { time: '11:00', title: 'Algorithms', location: 'Room 101' },
  { time: '13:00', title: 'Library Deep Work', location: 'Quiet Zone' },
]

export const defaultUser = {
  fullName: 'Sahar Student',
  email: 'demo@studyfollow.app',
  password: '123456',
  track: 'Information Systems',
  year: 'Year 2',
  mode: 'Deep Work Active',
}

const TASKS_KEY = 'studyfollow_tasks'
const EXAMS_KEY = 'studyfollow_exams'

function emitDataUpdated(type) {
  window.dispatchEvent(new CustomEvent('studyfollow-data-updated', { detail: { type } }))
}

export function getStoredTasks() {
  const stored = localStorage.getItem(TASKS_KEY)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  return tasks
}

export function saveStoredTasks(nextTasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(nextTasks))
  emitDataUpdated('tasks')
}

export function getStoredExams() {
  const stored = localStorage.getItem(EXAMS_KEY)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(EXAMS_KEY, JSON.stringify(exams))
  return exams
}

export function saveStoredExams(nextExams) {
  localStorage.setItem(EXAMS_KEY, JSON.stringify(nextExams))
  emitDataUpdated('exams')
}

function parseDateInput(value) {
  if (!value) return null
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function formatRelativeDate(value) {
  const date = parseDateInput(value)
  if (!date) return value || ''

  const now = startOfDay(new Date())
  const target = startOfDay(date)
  const diffDays = Math.round((target - now) / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'

  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

export function formatDateInputForUi(value) {
  const date = parseDateInput(value)
  if (!date) return value || ''
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function isDueSoon(value) {
  const relative = formatRelativeDate(value)
  return relative === 'Today' || relative === 'Tomorrow'
}


function parseTimeToMinutes(value) {
  if (!value || !value.includes(':')) return null
  const [hours, minutes] = value.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

export function getDynamicDashboardStats(taskList = [], examList = [], scheduleList = schedule) {
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const todayClasses = scheduleList.length
  const nextClass =
    scheduleList
      .slice()
      .sort((a, b) => (parseTimeToMinutes(a.time) ?? 0) - (parseTimeToMinutes(b.time) ?? 0))
      .find((item) => (parseTimeToMinutes(item.time) ?? -1) >= nowMinutes) || scheduleList[0]

  const pendingTasks = taskList.filter((task) => task.status !== 'Done').length
  const dueSoonCount = taskList.filter((task) => task.status !== 'Done' && isDueSoon(task.dueDate)).length

  const upcomingExamsList = examList
    .filter((exam) => {
      const examDate = parseDateInput(exam.date)
      if (!examDate) return false
      return startOfDay(examDate) >= startOfDay(now)
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const closestExam = upcomingExamsList[0]

  return [
    {
      title: "Today's Classes",
      value: String(todayClasses),
      helper: nextClass ? `Next: ${nextClass.title} at ${nextClass.time}` : 'No classes scheduled',
      tone: 'primary',
    },
    {
      title: 'Pending Tasks',
      value: String(pendingTasks),
      helper:
        dueSoonCount > 0
          ? `${dueSoonCount} due in the next 24h`
          : pendingTasks > 0
            ? 'Nothing urgent in the next 24h'
            : 'All tasks are completed',
      tone: 'accent',
    },
    {
      title: 'Upcoming Exams',
      value: String(upcomingExamsList.length),
      helper: closestExam ? `Closest: ${closestExam.course}` : 'No upcoming exams',
      tone: 'secondary',
    },
  ]
}

export function playSuccessSound() {
  if (typeof window === 'undefined') return
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return

  try {
    const context = new AudioContextClass()
    const master = context.createGain()
    master.gain.value = 0.04
    master.connect(context.destination)

    const notes = [523.25, 659.25, 783.99]
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.09)
      gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + index * 0.09 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + index * 0.09 + 0.22)
      oscillator.connect(gain)
      gain.connect(master)
      oscillator.start(context.currentTime + index * 0.09)
      oscillator.stop(context.currentTime + index * 0.09 + 0.24)
    })

    window.setTimeout(() => {
      context.close().catch(() => {})
    }, 700)
  } catch {
    // no-op
  }
}
