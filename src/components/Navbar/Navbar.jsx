import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'לוח בקרה' },
  { to: '/tasks', label: 'משימות' },
  { to: '/exams', label: 'מבחנים' },
  { to: '/profile', label: 'פרופיל' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('studyfollow_active_user') || 'null')

  const handleLogout = () => {
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
          <button className="ghost-button" onClick={handleLogout}>יציאה</button>
        </div>
      </div>
    </header>
  )
}
