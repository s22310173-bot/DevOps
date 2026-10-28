export function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="error-banner">
      <span>{message}</span>
      <button type="button" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
