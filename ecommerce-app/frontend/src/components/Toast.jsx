import './Toast.css';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      <div className="toast">
        {toast.image && <img src={toast.image} alt={toast.name} className="toast-img" />}
        <div className="toast-body">
          <div className="toast-title">
            <span className="toast-check">✓</span> Added to cart
          </div>
          <div className="toast-name">{toast.name}</div>
        </div>
      </div>
    </div>
  );
}