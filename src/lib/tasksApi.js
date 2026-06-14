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

function mapRowToTask(row) {
  return {
    id: row.id,
    title: row.title ?? '',
    subtitle: row.subtitle ?? '',
    course: row.course ?? '',
    dueDate: row.due_date ?? '',
    priority: row.priority ?? 'Medium',
    status: row.status ?? 'To Do',
  }
}

function mapTaskToRow(task, userId) {
  return {
    user_id: userId,
    title: task.title,
    subtitle: task.subtitle || '',
    course: task.course || '',
    due_date: task.dueDate,
    priority: task.priority,
    status: task.status,
  }
}

export async function fetchTasks() {
  const userId = await getCurrentUserId()

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true })

  if (error) throw error
  return data.map(mapRowToTask)
}

export async function createTask(task) {
  const userId = await getCurrentUserId()
  const { error } = await supabase.from('tasks').insert(mapTaskToRow(task, userId))
  if (error) throw error
}

export async function updateTask(taskId, task) {
  const userId = await getCurrentUserId()

  const { error } = await supabase
    .from('tasks')
    .update(mapTaskToRow(task, userId))
    .eq('id', taskId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function deleteTask(taskId) {
  const userId = await getCurrentUserId()

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function setTaskStatus(taskId, status) {
  const userId = await getCurrentUserId()

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .eq('user_id', userId)

  if (error) throw error
}