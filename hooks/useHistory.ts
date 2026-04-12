import { useState, useCallback, useRef } from 'react';
import { HistoryNode } from '../types';

export function useHistory<T>(initialState: T) {
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const rootId = generateId();
  const initialNode: HistoryNode<T> = {
    id: rootId,
    parentId: null,
    childrenIds: [],
    state: initialState,
    timestamp: Date.now(),
    origin: 'system',
  };

  const [currentId, setCurrentId] = useState<string>(rootId);
  const nodesRef = useRef<Map<string, HistoryNode<T>>>(new Map([[rootId, initialNode]]));

  const currentState = nodesRef.current.get(currentId)?.state ?? initialState;

  const setState = useCallback((newState: T, overwrite = false, origin: 'user' | 'ai' | 'system' = 'user') => {
    const parentNode = nodesRef.current.get(currentId);
    if (!parentNode) return;

    if (overwrite) {
       parentNode.state = newState;
       parentNode.timestamp = Date.now();
       parentNode.origin = origin;
       setCurrentId(parentNode.id);
       return;
    }

    const newId = generateId();
    const newNode: HistoryNode<T> = {
      id: newId,
      parentId: currentId,
      childrenIds: [],
      state: newState,
      timestamp: Date.now(),
      origin,
    };

    parentNode.childrenIds.push(newId);
    nodesRef.current.set(newId, newNode);
    
    // Pruning logic (simplified limit)
    if (nodesRef.current.size > 500) {
      // Find oldest leaf node or something similar, or just allow it to grow for the DAG implementation
      // For now, we will let it grow or implement a more complex garbage collection later
    }

    setCurrentId(newId);
  }, [currentId]);

  const undo = useCallback(() => {
    const currentNode = nodesRef.current.get(currentId);
    if (currentNode && currentNode.parentId) {
      setCurrentId(currentNode.parentId);
    }
  }, [currentId]);

  const redo = useCallback(() => {
    const currentNode = nodesRef.current.get(currentId);
    if (currentNode && currentNode.childrenIds.length > 0) {
      // Moving to the most recent child (last added)
      setCurrentId(currentNode.childrenIds[currentNode.childrenIds.length - 1]);
    }
  }, [currentId]);

  const canUndo = nodesRef.current.get(currentId)?.parentId !== null;
  const canRedo = (nodesRef.current.get(currentId)?.childrenIds.length ?? 0) > 0;

  return {
    state: currentState,
    set: setState,
    undo,
    redo,
    canUndo,
    canRedo,
    nodes: nodesRef.current, // Exposing nodes for visualization if needed
    currentId
  };
}
