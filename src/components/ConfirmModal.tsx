
interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export function ConfirmModal({ isOpen, onConfirm, onCancel, title, message }: ConfirmModalProps) {
  if (!isOpen) return null;

  return(
	<div 
	  className="modal-overlay"
	  onClick={onCancel}>
	  <div 
		className="modal-content"
		onClick={(e)=> e.stopPropagation()}>
		<h3>{title}</h3>
		<p>{message}</p>
		<div className="modal-buttons">
		  <button onClick={onConfirm}
			className="modal-btn-confirm">Yes</button>
		  <button className="modal-btn-cancel"
			onClick={onCancel}>No</button>
		</div>
	  </div>
	</div>
  );
}
