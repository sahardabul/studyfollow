import { NavLink, useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { supabase } from '../lib/supabase'
=======
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251

const navItems = [
  { to: '/dashboard', label: 'לוח בקרה' },
  { to: '/tasks', label: 'משימות' },
  { to: '/exams', label: 'מבחנים' },
  { to: '/profile', label: 'פרופיל' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('studyfollow_active_user') || 'null')

<<<<<<< HEAD
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }

=======
  const handleLogout = () => {
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
    localStorage.removeItem('studyfollow_active_user')
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="brand-wrap">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-name">StudyFollow</div>
            <div className="brand-tag">Smart tools for serious students</div>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="nav-user-pill">{user?.fullName?.split(' ')[0] || 'User'}</div>
<<<<<<< HEAD
          <button className="ghost-button" onClick={handleLogout} type="button">
            יציאה
          </button>
=======
          <button className="ghost-button" onClick={handleLogout}>יציאה</button>
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
        </div>
      </div>
    </header>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
