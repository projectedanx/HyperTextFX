import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { HistoryNode } from '../types';
import { synthesizeBranches } from '../services/gemini';
import { GitMerge, Loader2 } from 'lucide-react';

interface DSPModalProps {
  isOpen: boolean;
  onClose: () => void;
  ancestorNode: HistoryNode<string>;
  branches: HistoryNode<string>[];
  onMerge: (branchIds: string[], synthesizedText: string) => void;
}

export const DSPModal: React.FC<DSPModalProps> = ({ isOpen, onClose, ancestorNode, branches, onMerge }) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedText, setSynthesizedText] = useState<string | null>(null);

  if (!isOpen || branches.length < 2) return null;

  const handleSynthesize = async () => {
    setIsSynthesizing(true);
    try {
      const branchA = branches[0];
      const branchB = branches[1]; // Handle first two branches for now

      const result = await synthesizeBranches(
        ancestorNode.state,
        { origin: branchA.origin, text: branchA.state },
        { origin: branchB.origin, text: branchB.state }
      );

      setSynthesizedText(result);
    } catch (error) {
      console.error("Failed to synthesize", error);
      alert("Failed to synthesize branches.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleApply = () => {
    if (synthesizedText) {
      onMerge(branches.slice(0, 2).map(b => b.id), synthesizedText);
      setSynthesizedText(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dialectical Synthesis Plane (DSP)">
      <div className="space-y-4">
        <p className="text-xs text-gray-400 mb-4">
          Divergent branches detected. The Dialectical Synthesis Plane resolves conflicts by intent, not line-by-line diffs.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-editor-border p-2 rounded bg-editor-bg overflow-auto h-48">
            <div className="text-xs font-bold mb-2 flex items-center justify-between text-editor-accent">
              <span>Branch A ({branches[0].origin})</span>
            </div>
            <pre className="text-[10px] whitespace-pre-wrap">{branches[0].state}</pre>
          </div>
          <div className="border border-editor-border p-2 rounded bg-editor-bg overflow-auto h-48">
            <div className="text-xs font-bold mb-2 flex items-center justify-between text-green-500">
              <span>Branch B ({branches[1].origin})</span>
            </div>
            <pre className="text-[10px] whitespace-pre-wrap">{branches[1].state}</pre>
          </div>
        </div>

        <div className="flex justify-center my-4">
            <button
                onClick={handleSynthesize}
                disabled={isSynthesizing}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded text-sm transition-colors"
            >
                {isSynthesizing ? <Loader2 className="animate-spin" size={16} /> : <GitMerge size={16} />}
                Synthesize Intent
            </button>
        </div>

        {synthesizedText && (
          <div className="border border-purple-500/50 p-3 rounded bg-purple-900/10 h-64 overflow-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="text-xs font-bold mb-2 text-purple-400">Dialectical Merge Result:</div>
            <pre className="text-[10px] whitespace-pre-wrap text-gray-200">{synthesizedText}</pre>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-editor-border gap-2">
            <button onClick={onClose} className="px-4 py-1.5 bg-editor-panel hover:bg-editor-border rounded text-sm">Cancel</button>
            <button
                onClick={handleApply}
                disabled={!synthesizedText}
                className="px-4 py-1.5 bg-editor-accent hover:bg-blue-600 disabled:bg-blue-800 disabled:opacity-50 rounded text-white text-sm"
            >
                Apply Synthesis
            </button>
        </div>
      </div>
    </Modal>
  );
};
