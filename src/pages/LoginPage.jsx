import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { supabase } from '../lib/supabase'
=======
import { defaultUser } from '../data/appData'

function getUsers() {
  const stored = localStorage.getItem('studyfollow_users')
  if (stored) return JSON.parse(stored)
  localStorage.setItem('studyfollow_users', JSON.stringify([defaultUser]))
  return [defaultUser]
}
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [fullName, setFullName] = useState('')
<<<<<<< HEAD
  const [email, setEmail] = useState('saharg4343@gmail.com')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setMessage('האימייל או הסיסמה לא נכונים')
          setLoading(false)
          return
        }

        const user = data.user

        let profile = null
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileRow) {
          profile = {
            fullName: profileRow.full_name || '',
            email: profileRow.email || user.email || '',
            track: profileRow.track || 'Information Systems',
            year: profileRow.year || 'Year 2',
            mode: 'Deep Work Active',
          }
        } else {
          profile = {
            fullName: user.email?.split('@')[0] || 'Student',
            email: user.email || '',
            track: 'Information Systems',
            year: 'Year 2',
            mode: 'Deep Work Active',
          }
        }

        localStorage.setItem('studyfollow_active_user', JSON.stringify(profile))
        navigate('/dashboard')
        setLoading(false)
        return
      }

      if (!fullName.trim()) {
        setMessage('צריך למלא שם מלא')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      const user = data.user

      if (user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: user.id,
          full_name: fullName,
          email,
          track: 'Information Systems',
          year: 'Year 2',
        })

        if (profileError) {
          console.error('Profile insert failed:', profileError)
        }

        localStorage.setItem(
          'studyfollow_active_user',
          JSON.stringify({
            fullName,
            email,
            track: 'Information Systems',
            year: 'Year 2',
            mode: 'Deep Work Active',
          })
        )

        navigate('/dashboard')
      } else {
        setMessage('נוצר משתמש, אבל צריך לאשר את האימייל לפני התחברות')
      }
    } catch (error) {
      console.error(error)
      setMessage('משהו השתבש, נסה שוב')
    }

    setLoading(false)
=======
  const [email, setEmail] = useState('demo@studyfollow.app')
  const [password, setPassword] = useState('123456')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const users = getUsers()

    if (mode === 'login') {
      const match = users.find((user) => user.email === email && user.password === password)
      if (!match) {
        setMessage('האימייל או הסיסמה לא נכונים')
        return
      }
      localStorage.setItem('studyfollow_active_user', JSON.stringify(match))
      navigate('/dashboard')
      return
    }

    if (!fullName.trim()) {
      setMessage('צריך למלא שם מלא')
      return
    }

    if (users.some((user) => user.email === email)) {
      setMessage('כבר קיים משתמש עם האימייל הזה')
      return
    }

    const newUser = {
      fullName,
      email,
      password,
      track: 'Information Systems',
      year: 'Year 2',
      mode: 'Deep Work Active',
    }

    const updated = [...users, newUser]
    localStorage.setItem('studyfollow_users', JSON.stringify(updated))
    localStorage.setItem('studyfollow_active_user', JSON.stringify(newUser))
    navigate('/dashboard')
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
  }

  return (
    <div className="auth-page">
      <div className="auth-background-orb orb-one" />
      <div className="auth-background-orb orb-two" />
<<<<<<< HEAD

=======
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
      <div className="auth-shell container">
        <div className="auth-card glass-card">
          <div className="brand-inline">
            <div className="brand-mark">S</div>
            <div>
              <div className="brand-name">StudyFollow</div>
              <div className="brand-tag">Deep work meets visual planning</div>
            </div>
          </div>

          <span className="label-chip">Student productivity hub</span>
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your portal'}</h1>
<<<<<<< HEAD

          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to continue to your focused dashboard.'
              : 'Create a real account with Supabase and enter the app.'}
=======
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to continue to your focused dashboard.'
              : 'Register with placeholder data and instantly enter the app.'}
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
          </p>

          <div className="mode-toggle">
            <button
              className={`mode-button ${mode === 'login' ? 'selected' : ''}`}
              onClick={() => setMode('login')}
              type="button"
            >
              Log In
            </button>
<<<<<<< HEAD

=======
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
            <button
              className={`mode-button ${mode === 'register' ? 'selected' : ''}`}
              onClick={() => setMode('register')}
              type="button"
            >
              Create Account
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label>
                Full Name
<<<<<<< HEAD
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </label>
            )}

            <label>
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
=======
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
              </label>
            )}
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
            </label>

            {message ? <div className="form-message">{message}</div> : null}

<<<<<<< HEAD
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          
=======
            <button className="primary-button" type="submit">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-helper">Demo user: demo@studyfollow.app / 123456</div>
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
        </div>

        <div className="auth-showcase glass-card">
          <span className="label-chip alt">Focused learning mode</span>
          <h2>Build rhythm. Reduce chaos. Win the semester.</h2>
<<<<<<< HEAD

=======
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
          <p className="muted-text large-text">
            A unique glassmorphism dashboard for classes, tasks, exams, and reminders — all under one bold visual system.
          </p>

          <div className="showcase-grid">
            <div className="showcase-kpi">
              <div className="showcase-big">84%</div>
              <div className="muted-text">weekly consistency</div>
            </div>
<<<<<<< HEAD

=======
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
            <div className="showcase-panel">
              <div className="muted-text">This week</div>
              <ul>
                <li>7 active tasks</li>
                <li>2 upcoming exams</li>
                <li>45 minute focus block ready</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
