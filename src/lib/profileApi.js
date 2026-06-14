import { supabase } from './supabase'

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  if (!user) throw new Error('No authenticated user found')

  return user
}

function mapRowToProfile(row, userEmail) {
  return {
    fullName: row?.full_name ?? '',
    email: row?.email ?? userEmail ?? '',
    track: row?.track ?? '',
    year: row?.year ?? '',
    mode: 'Deep Work Active',
  }
}

export async function fetchProfile() {
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw error

  return mapRowToProfile(data, user.email)
}

export async function saveProfile(profile) {
  const user = await getCurrentUser()

  const payload = {
    user_id: user.id,
    full_name: profile.fullName,
    email: user.email,
    track: profile.track,
    year: profile.year,
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'user_id' })

  if (error) throw error

  return {
    fullName: profile.fullName,
    email: user.email,
    track: profile.track,
    year: profile.year,
    mode: 'Deep Work Active',
  }
}