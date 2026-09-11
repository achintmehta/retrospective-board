import './JoinToastStack.css';

export default function JoinToastStack({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="join-toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className="join-toast">
          <span className="join-toast-wave">👋</span>
          <span className="join-toast-text"><strong>{toast.username}</strong> joined</span>
          <button className="join-toast-close" onClick={() => onRemove(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
