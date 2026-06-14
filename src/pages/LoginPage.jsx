import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [fullName, setFullName] = useState('')
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

        const { data: profileRow } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        let profile

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
  }

  return (
    <div className="auth-page">
      <div className="auth-background-orb orb-one" />
      <div className="auth-background-orb orb-two" />

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

          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to continue to your focused dashboard.'
              : 'Create a real account with Supabase and enter the app.'}
          </p>

          <div className="mode-toggle">
            <button
              className={`mode-button ${mode === 'login' ? 'selected' : ''}`}
              onClick={() => setMode('login')}
              type="button"
            >
              Log In
            </button>

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
            </label>

            {message ? <div className="form-message">{message}</div> : null}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="auth-showcase glass-card">
          <span className="label-chip alt">Focused learning mode</span>
          <h2>Build rhythm. Reduce chaos. Win the semester.</h2>

          <p className="muted-text large-text">
            A unique glassmorphism dashboard for classes, tasks, exams, and reminders — all under one bold visual system.
          </p>

          <div className="showcase-grid">
            <div className="showcase-kpi">
              <div className="showcase-big">84%</div>
              <div className="muted-text">weekly consistency</div>
            </div>

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
}