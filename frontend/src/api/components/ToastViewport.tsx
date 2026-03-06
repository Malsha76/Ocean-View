import { useToast } from '../context/ToastContext';

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-wrap">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => removeToast(toast.id)} aria-label="Close toast">x</button>
        </div>
      ))}
    </div>
  );
}
