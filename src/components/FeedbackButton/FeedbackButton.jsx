export default function FeedbackButton() {
  const handleOpenFeedback = () => {
    window.open('https://tally.so/r/44GzeO', '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      className="feedback-floating-button"
      onClick={handleOpenFeedback}
      type="button"
    >
      Feedback?
    </button>
  )
}