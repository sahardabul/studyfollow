import { supabase } from './supabase'

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  if (!user) throw new Error('No authenticated user found')

  return user.id
}

function mapRowToExam(row) {
  return {
    id: row.id,
    title: row.title ?? '',
    course: row.course ?? '',
    date: row.exam_date ?? '',
    time: row.exam_time ?? '',
    location: row.location ?? '',
    status: row.status ?? 'Upcoming',
  }
}

function mapExamToRow(exam, userId) {
  return {
    user_id: userId,
    title: exam.title,
    course: exam.course || '',
    exam_date: exam.date,
    exam_time: exam.time,
    location: exam.location,
    status: exam.status,
  }
}

export async function fetchExams() {
  const userId = await getCurrentUserId()

  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('user_id', userId)
    .order('exam_date', { ascending: true })

  if (error) throw error
  return data.map(mapRowToExam)
}

export async function createExam(exam) {
  const userId = await getCurrentUserId()
  const { error } = await supabase.from('exams').insert(mapExamToRow(exam, userId))
  if (error) throw error
}

export async function updateExam(examId, exam) {
  const userId = await getCurrentUserId()

  const { error } = await supabase
    .from('exams')
    .update(mapExamToRow(exam, userId))
    .eq('id', examId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function deleteExam(examId) {
  const userId = await getCurrentUserId()

  const { error } = await supabase
    .from('exams')
    .delete()
    .eq('id', examId)
    .eq('user_id', userId)

  if (error) throw error
}