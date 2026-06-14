<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { fetchProfile, saveProfile } from '../lib/profileApi'

export default function ProfilePage() {
  const [activeUser, setActiveUser] = useState(
    JSON.parse(localStorage.getItem('studyfollow_active_user') || 'null')
  )
=======
import { useState } from 'react'

export default function ProfilePage() {
  const activeUser = JSON.parse(localStorage.getItem('studyfollow_active_user') || 'null')
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
  const [fullName, setFullName] = useState(activeUser?.fullName || '')
  const [track, setTrack] = useState(activeUser?.track || '')
  const [year, setYear] = useState(activeUser?.year || '')
  const [saved, setSaved] = useState(false)

<<<<<<< HEAD
  const loadProfile = async () => {
    try {
      const profile = await fetchProfile()
      setActiveUser(profile)
      setFullName(profile.fullName || '')
      setTrack(profile.track || '')
      setYear(profile.year || '')
      localStorage.setItem('studyfollow_active_user', JSON.stringify(profile))
    } catch (error) {
      console.error('Failed to load profile:', error)
      window.dispatchEvent(
        new CustomEvent('studyfollow-toast', {
          detail: {
            title: 'Load failed',
            message: 'Could not load profile from Supabase.',
          },
        })
      )
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      const updated = await saveProfile({ fullName, track, year })
      setActiveUser(updated)
      localStorage.setItem('studyfollow_active_user', JSON.stringify(updated))

      setSaved(true)
      window.dispatchEvent(
        new CustomEvent('studyfollow-toast', {
          detail: {
            title: 'Profile updated',
            message: 'Your personal details were saved successfully.',
          },
        })
      )
      setTimeout(() => setSaved(false), 1800)
    } catch (error) {
      console.error('Failed to save profile:', error)
      window.dispatchEvent(
        new CustomEvent('studyfollow-toast', {
          detail: {
            title: 'Save failed',
            message: 'Could not save your profile.',
          },
        })
      )
    }
=======
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
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <span className="label-chip">המרחב האישי</span>
<<<<<<< HEAD
        <h1 className="profile-title-nowrap">
          הגדר את <span dir="ltr" className="brand-inline">StudyFollow</span>{' '}
          <span className="keep-together">לפי שגרת הלמידה שלך</span>
        </h1>
        <p className="muted-text large-text">
          עדכון פרטים אישיים, מסלול לימודים והעדפות שימוש במקום אחד נעים ומסודר.
        </p>
=======
        <h1 className="profile-title-nowrap">הגדר את <span dir="ltr" className="brand-inline">StudyFollow</span> <span className="keep-together">לפי שגרת הלמידה שלך</span></h1>
        <p className="muted-text large-text">עדכון פרטים אישיים, מסלול לימודים והעדפות שימוש במקום אחד נעים ומסודר.</p>
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
      </section>

      <div className="profile-grid">
        <section className="glass-card profile-card hover-rise">
          <div className="profile-avatar soft-float">{fullName?.charAt(0) || 'S'}</div>
          <h3>{fullName}</h3>
          <div className="muted-text">{activeUser?.email}</div>
<<<<<<< HEAD

          <div className="profile-kpis">
            <div>
              <strong>Track</strong>
              <span>{track}</span>
            </div>
            <div>
              <strong>Year</strong>
              <span>{year}</span>
            </div>
            <div>
              <strong>Mode</strong>
              <span>{activeUser?.mode}</span>
            </div>
=======
          <div className="profile-kpis">
            <div><strong>Track</strong><span>{track}</span></div>
            <div><strong>Year</strong><span>{year}</span></div>
            <div><strong>Mode</strong><span>{activeUser?.mode}</span></div>
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
          </div>
        </section>

        <section className="glass-card profile-form-card hover-rise">
          <h3>Edit profile</h3>
<<<<<<< HEAD

=======
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
          <form className="profile-form" onSubmit={handleSave}>
            <label>
              Full Name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </label>
<<<<<<< HEAD

=======
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
            <label>
              Study Track
              <input value={track} onChange={(e) => setTrack(e.target.value)} />
            </label>
<<<<<<< HEAD

=======
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
            <label>
              Academic Year
              <input value={year} onChange={(e) => setYear(e.target.value)} />
            </label>
<<<<<<< HEAD

            <button className="primary-button" type="submit">
              Save Changes
            </button>

            {saved ? <div className="success-message">השינויים נשמרו בהצלחה.</div> : null}
=======
            <button className="primary-button" type="submit">Save Changes</button>
            {saved ? <div className="success-message">השינויים נשמרו מקומית בדפדפן.</div> : null}
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
          </form>
        </section>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
