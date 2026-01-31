import { useEffect, useRef } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function SettingsModal({ isOpen, onClose, children }: SettingsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync React state with dialog element state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle backdrop click - native dialog doesn't close on backdrop click by default
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="settings-modal"
    >
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-btn" aria-label="Close settings">
          X
        </button>
        {children}
      </div>
    </dialog>
  );
}

export default SettingsModal;
