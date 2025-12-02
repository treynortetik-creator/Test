import { useState, useCallback } from 'react';

export type UndoAction = {
  type: 'habit_completion' | 'habit_skip' | 'habit_delete' | 'habit_create';
  description: string;
  undo: () => void;
  timestamp: number;
};

const UNDO_TIMEOUT = 10000; // 10 seconds to undo

export function useUndo() {
  const [lastAction, setLastAction] = useState<UndoAction | null>(null);
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);

  const addUndoAction = useCallback((action: Omit<UndoAction, 'timestamp'>) => {
    // Clear previous timeout
    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }

    const fullAction: UndoAction = {
      ...action,
      timestamp: Date.now(),
    };

    setLastAction(fullAction);

    // Auto-clear after timeout
    const timeout = setTimeout(() => {
      setLastAction(null);
    }, UNDO_TIMEOUT);

    setUndoTimeout(timeout);
  }, [undoTimeout]);

  const executeUndo = useCallback(() => {
    if (lastAction) {
      lastAction.undo();
      setLastAction(null);
      if (undoTimeout) {
        clearTimeout(undoTimeout);
      }
    }
  }, [lastAction, undoTimeout]);

  const clearUndo = useCallback(() => {
    setLastAction(null);
    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }
  }, [undoTimeout]);

  return {
    lastAction,
    addUndoAction,
    executeUndo,
    clearUndo,
  };
}
