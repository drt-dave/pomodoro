import { usePomodoro } from '../hooks/PomodoroContext';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export function ConfirmModal({ isOpen, onConfirm, onCancel, title, message }: ConfirmModalProps) {
  const { mode } = usePomodoro();

  if (!isOpen) return null;

  return (
    <div
      className={[
        styles.confirmModal,
        mode === 'work' ? styles.confirmModalWork : styles.confirmModalBreak
      ].join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
    >
      <div className={styles.confirmModalContent}>
        <span className={styles.confirmModalIcon} aria-hidden="true">
          ❓
        </span>
        <div className={styles.confirmModalText}>
          <h3 id="confirm-modal-title" className={styles.confirmModalTitle}>
            {title}
          </h3>
          <p id="confirm-modal-message" className={styles.confirmModalMessage}>
            {message}
          </p>
        </div>
      </div>
      <div className={styles.confirmModalActions}>
        <button
          className={styles.confirmModalButtonCancel}
          onClick={onCancel}
          aria-label="Cancel"
        >
          No
        </button>
        <button
          className={styles.confirmModalButtonConfirm}
          onClick={onConfirm}
          aria-label="Confirm"
        >
          Yes
        </button>
      </div>
    </div>
  );
}
