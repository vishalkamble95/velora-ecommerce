import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-dialog-overlay">
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Confirmation"
      >
        <div className="confirm-dialog-icon">
          <AlertTriangle size={28} />
        </div>

        <h3>Are you sure?</h3>

        <p className="confirm-dialog-message">{message}</p>

        <div className="confirm-dialog-actions">
          <button className="confirm-cancel-button" onClick={onCancel}>
            Cancel
          </button>

          <button className="confirm-action-button" onClick={onConfirm}>
            Yes, Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
