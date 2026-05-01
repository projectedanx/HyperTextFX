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


// Helper to find all leaf nodes from a given root/ancestor.
  const getLeafNodes = useCallback((startId: string): HistoryNode<T>[] => {
    const startNode = nodesRef.current.get(startId);
    if (!startNode) return [];

    if (startNode.childrenIds.length === 0) {
      return [startNode];
    }

    let leaves: HistoryNode<T>[] = [];
    for (const childId of startNode.childrenIds) {
      leaves = leaves.concat(getLeafNodes(childId));
    }
    return leaves;
  }, []);

  const getLowestCommonAncestor = useCallback((node1Id: string, node2Id: string): HistoryNode<T> | null => {
      // Find path from root to node1
      const getPath = (id: string): string[] => {
          const path = [id];
          let curr = nodesRef.current.get(id);
          while (curr && curr.parentId) {
              path.unshift(curr.parentId);
              curr = nodesRef.current.get(curr.parentId);
          }
          return path;
      };

      const path1 = getPath(node1Id);
      const path2 = getPath(node2Id);

      let lcaId = null;
      for (let i = 0; i < Math.min(path1.length, path2.length); i++) {
          if (path1[i] === path2[i]) {
              lcaId = path1[i];
          } else {
              break;
          }
      }

      return lcaId ? nodesRef.current.get(lcaId) || null : null;
  }, []);

  const getDivergentBranches = useCallback(() => {
    const rootId = Array.from(nodesRef.current.values()).find(n => n.parentId === null)?.id;
    if (!rootId) return null;

    const leaves = getLeafNodes(rootId);
    if (leaves.length > 1) {
      return leaves;
    }

    return null;
  }, [getLeafNodes]);

  const mergeBranches = useCallback((branchIds: string[], synthesizedState: T, origin: 'user' | 'ai' | 'system' | 'synthesis' = 'synthesis') => {
    const newId = generateId();

    const primaryParentId = branchIds.length > 0 ? branchIds[0] : currentId;

    const newNode: HistoryNode<T> = {
      id: newId,
      parentId: primaryParentId,
      parentIds: branchIds,
      childrenIds: [],
      state: synthesizedState,
      timestamp: Date.now(),
      origin,
    };

    branchIds.forEach(id => {
       const branch = nodesRef.current.get(id);
       if (branch) {
           branch.childrenIds.push(newId);
       }
    });

    nodesRef.current.set(newId, newNode);
    setCurrentId(newId);
  }, [currentId]);

  return {
    state: currentState,
    set: setState,
    undo,
    redo,
    canUndo,
    canRedo,
    nodes: nodesRef.current, // Exposing nodes for visualization if needed
    currentId,
    getDivergentBranches,
    mergeBranches,
    getLowestCommonAncestor
  };
}
