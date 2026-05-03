import { useState } from 'react'

export default function ProfilePage() {
  const activeUser = JSON.parse(localStorage.getItem('studyfollow_active_user') || 'null')
  const [fullName, setFullName] = useState(activeUser?.fullName || '')
  const [track, setTrack] = useState(activeUser?.track || '')
  const [year, setYear] = useState(activeUser?.year || '')
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    const updated = { ...activeUser, fullName, track, year }
    localStorage.setItem('studyfollow_active_user', JSON.stringify(updated))

    const users = JSON.parse(localStorage.getItem('studyfollow_users') || '[]').map((user) =>
      user.email === updated.email ? updated : user
    )
    localStorage.setItem('studyfollow_users', JSON.stringify(users))
    setSaved(true)
    window.dispatchEvent(new CustomEvent('studyfollow-toast', { detail: { title: 'Profile updated', message: 'Your personal details were saved locally in the browser.' } }))
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <span className="label-chip">המרחב האישי</span>
        <h1 className="profile-title-nowrap">הגדר את <span dir="ltr" className="brand-inline">StudyFollow</span> <span className="keep-together">לפי שגרת הלמידה שלך</span></h1>
        <p className="muted-text large-text">עדכון פרטים אישיים, מסלול לימודים והעדפות שימוש במקום אחד נעים ומסודר.</p>
      </section>

      <div className="profile-grid">
        <section className="glass-card profile-card hover-rise">
          <div className="profile-avatar soft-float">{fullName?.charAt(0) || 'S'}</div>
          <h3>{fullName}</h3>
          <div className="muted-text">{activeUser?.email}</div>
          <div className="profile-kpis">
            <div><strong>Track</strong><span>{track}</span></div>
            <div><strong>Year</strong><span>{year}</span></div>
            <div><strong>Mode</strong><span>{activeUser?.mode}</span></div>
          </div>
        </section>

        <section className="glass-card profile-form-card hover-rise">
          <h3>Edit profile</h3>
          <form className="profile-form" onSubmit={handleSave}>
            <label>
              Full Name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </label>
            <label>
              Study Track
              <input value={track} onChange={(e) => setTrack(e.target.value)} />
            </label>
            <label>
              Academic Year
              <input value={year} onChange={(e) => setYear(e.target.value)} />
            </label>
            <button className="primary-button" type="submit">Save Changes</button>
            {saved ? <div className="success-message">השינויים נשמרו מקומית בדפדפן.</div> : null}
          </form>
        </section>
      </div>
    </div>
  )
}
