import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const activeUser = localStorage.getItem('studyfollow_active_user')

  if (!activeUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
