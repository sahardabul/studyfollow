<<<<<<< HEAD
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem('studyfollow_active_user')

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
=======
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const activeUser = localStorage.getItem('studyfollow_active_user')

  if (!activeUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
>>>>>>> 7c11c7f5e773f6e90ea0d1d5e7877ebeed637251
