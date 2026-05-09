import React from 'react';
import { X } from 'lucide-react';

/**
 * Contract defining the parameters for the modal geometry boundary.
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * A structural Z-Axis extrusion used to capture user input without abandoning the primary editor context.
 * Represents a temporary focus shift rather than a full state routing change.
 *
 * @param {ModalProps} props - Render triggers, closure callbacks, and internal content payload.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-editor-panel border border-editor-border shadow-xl rounded-lg w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-3 border-b border-editor-border">
          <h3 className="text-sm font-semibold text-editor-fg">{title}</h3>
          <button onClick={onClose} className="text-editor-fg hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};