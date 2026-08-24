
import { ExclamationTriangleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutDialog({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="logout-overlay" role="presentation" onMouseDown={onCancel}>
      <div className="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title" onMouseDown={(e) => e.stopPropagation()}>
        <div className="logout-dialog-icon"><ExclamationTriangleIcon /></div>
        <div className="logout-dialog-body">
          <span className="logout-dialog-eyebrow">SIGN OUT</span>
          <h2 id="logout-title">Log out of ExpenseManager?</h2>
          <p>You can sign in again anytime. Your saved expenses and profile data will remain in your account.</p>
          <div className="logout-dialog-actions">
            <button type="button" className="logout-cancel" onClick={onCancel}>Cancel</button>
            <button type="button" className="logout-confirm" onClick={onConfirm}><ArrowRightOnRectangleIcon />Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
