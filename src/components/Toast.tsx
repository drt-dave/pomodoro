import { useEffect } from "react";

interface ToastProps {
  isVisible: boolean;
  message: string;
  duration?: number;
  type?: 'work' | 'break';
  onClose: () => void;
};

export const Toast =({
  isVisible,
  message,
  duration,
  type = 'work',
	onClose
}: ToastProps) => {
  useEffect(() => {
	if (isVisible) {
	  const timer = setTimeout( () => { 
		onClose();
	  }, 4000); // Auto-dismiss after 4 seconds
	  return () => clearTimeout(timer);
	}
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const formatDuration = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;

	if (mins === 0) return `${secs} seconds` ;
	if (secs === 0) return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;

	return `${mins}m ${secs}s`;
  };

  return (
	<div 
	  className={`toast toast--${type}`}
	  role="alert"
	  aria-live="polite"
	>
	  <div className="toast__content">
		<span className="toast__icon" aria-hidden="true">
		  {type === 'work' ? '✅' : '☕'}
		</span>
		<div className="toast__text">
		  <span className="toast__message">{message}</span>
		  {duration !== undefined && (
			<span className="toast__duration">
			  Duration: {formatDuration(duration)}
			</span>
		  )}
		</div>
	  </div>
	  <button 
		className="toast__close"
		onClick={onClose}
		aria-label="Close notification"
	  >
		X
	  </button>
	</div>
  );
};
