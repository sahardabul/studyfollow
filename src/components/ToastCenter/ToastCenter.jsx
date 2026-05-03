import { useEffect, useState } from 'react'

export default function ToastCenter() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const onToast = (event) => {
      const id = Date.now() + Math.random()
      const title = event.detail?.title || 'Live update'
      const message = event.detail?.message || 'Saved successfully'
      const variant = event.detail?.variant || 'default'

      setToasts((current) => [...current, { id, title, message, variant }])
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id))
      }, 3200)
    }

    window.addEventListener('studyfollow-toast', onToast)
    return () => window.removeEventListener('studyfollow-toast', onToast)
  }, [])

  return (
    <div className="toast-center" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.variant}`}>
          <span className="toast-dot" />
          <div className="toast-body">
            <strong className="toast-title">{toast.title}</strong>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
