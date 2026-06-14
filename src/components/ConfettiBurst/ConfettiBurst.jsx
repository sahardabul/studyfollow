import { useEffect, useState } from 'react'

export default function ConfettiBurst() {
  const [bursts, setBursts] = useState([])

  useEffect(() => {
    const onCelebrate = () => {
      const burstId = Date.now()
      const pieces = Array.from({ length: 24 }, (_, index) => ({
        id: `${burstId}-${index}`,
        left: 8 + Math.random() * 84,
        delay: Math.random() * 220,
        drift: -70 + Math.random() * 140,
        rotate: Math.random() * 360,
        tone: ['cyan', 'blue', 'purple', 'gold'][index % 4],
      }))
      setBursts((current) => [...current, { id: burstId, pieces }])
      window.setTimeout(() => {
        setBursts((current) => current.filter((item) => item.id !== burstId))
      }, 1800)
    }

    window.addEventListener('studyfollow-confetti', onCelebrate)
    return () => window.removeEventListener('studyfollow-confetti', onCelebrate)
  }, [])

  return (
    <div className="confetti-layer" aria-hidden="true">
      {bursts.map((burst) => (
        <div className="confetti-burst" key={burst.id}>
          {burst.pieces.map((piece) => (
            <span
              key={piece.id}
              className={`confetti-piece confetti-${piece.tone}`}
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}ms`,
                '--confetti-drift': `${piece.drift}px`,
                transform: `rotate(${piece.rotate}deg)`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
