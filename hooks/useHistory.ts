import { useState, useCallback, useRef } from 'react';

export function useHistory<T>(initialState: T) {
  const [index, setIndex] = useState(0);
  const historyRef = useRef<T[]>([initialState]);

  // We use a ref for history to avoid stale closures in callbacks, 
  // but we trigger re-renders via setIndex.

  const currentState = historyRef.current[index];

  const setState = useCallback((newState: T, overwrite = false) => {
    const currentIndex = index;
    // If overwrite is true, we replace the current tip (useful for rapid typing)
    if (overwrite) {
       historyRef.current[currentIndex] = newState;
       // Force update if needed, though usually typing drives the render
       return;
    }

    const newHistory = historyRef.current.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    // Limit history size to 50
    if (newHistory.length > 50) {
      newHistory.shift();
      historyRef.current = newHistory;
      // Index stays at end
    } else {
      historyRef.current = newHistory;
      setIndex(newHistory.length - 1);
    }
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(prev => prev - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < historyRef.current.length - 1) {
      setIndex(prev => prev + 1);
    }
  }, [index]);

  return {
    state: currentState,
    set: setState,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < historyRef.current.length - 1
  };
}