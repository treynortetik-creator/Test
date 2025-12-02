import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, X } from 'lucide-react';
import type { UndoAction } from '../../hooks/useUndo';
import './UndoToast.css';

interface UndoToastProps {
  action: UndoAction | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ action, onUndo, onDismiss }: UndoToastProps) {
  if (!action) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="undo-toast"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <div className="undo-toast-content">
          <span className="undo-toast-message">{action.description}</span>
          <div className="undo-toast-actions">
            <button className="undo-btn" onClick={onUndo}>
              <Undo2 size={18} />
              <span>Undo</span>
            </button>
            <button className="dismiss-btn" onClick={onDismiss} aria-label="Dismiss">
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
