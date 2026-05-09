
import React, { useState, useRef, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { StatusBar } from './components/StatusBar';
import { Editor } from './components/Editor';
import { Modal } from './components/ui/Modal';
import { DSPModal } from './components/DSPModal';
import { AIPanel } from './components/AIPanel';
import { useHistory } from './hooks/useHistory';
import { streamGeminiResponse } from './services/gemini';
import { 
  processText, 
  insertAtColumn, 
  deleteAtColumn,
  numberLines
} from './services/textOps';
import { 
  CursorPos, 
  FileInfo, 
  TextTransformType, 
  EditorSettings, 
  FindReplaceOptions,
  ChatMessage,
  AIContext
} from './types';

/**
 * The central orchestration kernel of the Pluriversal Editor.
 * Manages the Symbiotic Paraconsistent Undo Graph (SPUG), bridges deterministic TextFX operations
 * with asynchronous AI stream interactions, and handles structural geometric updates (Cursor tracking, UI State).
 * Establishes the topological boundary between Human Sovereign execution and AI Orthogonal Tension.
 *
 * @returns {React.ReactElement} The assembled application manifold.
 */
export default function App() {
  // --- State ---
  const { state: content, set: setContent, undo, redo, getDivergentBranches, mergeBranches, getLowestCommonAncestor, nodes, currentId } = useHistory<string>('// Welcome to HyperTextFX\n// Start typing or drop a file here...\n// Toggle Gemini AI in the toolbar to start coding intelligently.');
  
  const [fileInfo, setFileInfo] = useState<FileInfo>({ name: 'Untitled.txt', isModified: false });
  const [cursor, setCursor] = useState<CursorPos>({ line: 1, col: 1, selectionStart: 0, selectionEnd: 0 });
  const [settings, setSettings] = useState<EditorSettings>({
    wordWrap: false,
    showLineNumbers: true,
    fontSize: 14,
    autoSaveInterval: 0, // Disabled by default, can be 5000, 15000, 30000, etc.
  });
  
  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);


  // DSP State
  const [isDSPOpen, setIsDSPOpen] = useState(false);
  const [divergentBranches, setDivergentBranches] = useState<any[] | null>(null);

  // Compute branches lazily or debounced
  useEffect(() => {
    const timeout = setTimeout(() => {
        const branches = getDivergentBranches();
        setDivergentBranches(branches);
    }, 1000); // Debounce graph traversal
    return () => clearTimeout(timeout);
  }, [content, getDivergentBranches]);

  // AI State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Modal Input States
  const [findOpts, setFindOpts] = useState<FindReplaceOptions>({ findText: '', replaceText: '', useRegex: false, matchCase: false });
  const [gotoLine, setGotoLine] = useState<string>('');
  const [colOpData, setColOpData] = useState({ column: 1, text: '', count: 1 });
  const [numberingOpts, setNumberingOpts] = useState({ start: 1, prefix: '', suffix: '. ' });

  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef(content);

  // Sync ref with content for AutoSave interval
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // --- Auto-Save Logic ---
  useEffect(() => {
    // Load draft on mount
    const saved = localStorage.getItem('htfx_autosave_content');
    if (saved) {
      setContent(saved, true, 'system');
    }
    
    // Load settings on mount
    const savedSettings = localStorage.getItem('htfx_settings');
    if (savedSettings) {
        try {
            setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
        } catch {}
    }
  }, []); // Run once

  useEffect(() => {
    // Persist settings
    localStorage.setItem('htfx_settings', JSON.stringify(settings));

    if (settings.autoSaveInterval === 0) return;

    const intervalId = setInterval(() => {
       localStorage.setItem('htfx_autosave_content', contentRef.current);
       // Optional: Could trigger a subtle UI indicator here
    }, settings.autoSaveInterval);

    return () => clearInterval(intervalId);
  }, [settings.autoSaveInterval]);


  // --- Helpers ---
  const handleContentChange = (newContent: string, origin: 'user' | 'ai' | 'system' = 'user') => {
    setContent(newContent, false, origin);
    setFileInfo(prev => ({ ...prev, isModified: true }));
  };

  // --- AI Logic ---
  const handleAIMessage = async (text: string, isThinking: boolean) => {
    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setAiMessages(prev => [...prev, newUserMsg]);
    setIsAIProcessing(true);

    const context: AIContext = {
      fullText: content,
      selection: content.substring(cursor.selectionStart, cursor.selectionEnd),
      cursor,
      fileName: fileInfo.name
    };

    let modelResponseText = '';
    const modelMsgId = (Date.now() + 1).toString();

    // Tool Callback
    const handleToolCall = async (call: any) => {
      if (call.name === 'update_editor') {
         const { text: newText, target } = call.args;
         
         if (target === 'document' || !context.selection) {
            handleContentChange(newText, 'ai');
            return "Document updated successfully.";
         } else {
            // Replace selection
            const before = content.substring(0, cursor.selectionStart);
            const after = content.substring(cursor.selectionEnd);
            handleContentChange(before + newText + after, 'ai');
            return "Selection updated successfully.";
         }
      }
      return "Unknown tool";
    };

    try {
      const stream = streamGeminiResponse(
        [...aiMessages, newUserMsg], 
        context, 
        isThinking,
        handleToolCall
      );

      for await (const chunk of stream) {
        if (chunk.type === 'text') {
           modelResponseText += chunk.content;
           setAiMessages(prev => {
             const existing = prev.find(m => m.id === modelMsgId);
             if (existing) {
               return prev.map(m => m.id === modelMsgId ? { ...m, text: modelResponseText } : m);
             } else {
               return [...prev, { id: modelMsgId, role: 'model', text: modelResponseText }];
             }
           });
        } else if (chunk.type === 'tool') {
           // Notify user in chat that a tool was used
           modelResponseText += `\n*[Performed Action: ${chunk.name}]*\n`;
           setAiMessages(prev => {
            const existing = prev.find(m => m.id === modelMsgId);
            if (existing) {
              return prev.map(m => m.id === modelMsgId ? { ...m, text: modelResponseText } : m);
            } else {
              return [...prev, { id: modelMsgId, role: 'model', text: modelResponseText }];
            }
          });
        }
      }

    } catch (e) {
      console.error(e);
      setAiMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsAIProcessing(false);
    }
  };

  // --- Actions ---

  const handleNew = () => {
    if (window.confirm('Clear all content? Unsaved changes will be lost.')) {
      setContent('', true, 'system'); // Overwrite history for new file
      setFileInfo({ name: 'Untitled.txt', isModified: false });
    }
  };

  const handleOpen = async () => {
    try {
      // @ts-ignore - File System Access API
      const [handle] = await window.showOpenFilePicker();
      const file = await handle.getFile();
      const text = await file.text();
      setContent(text, true, 'system');
      setFileInfo({ name: file.name, handle, isModified: false });
    } catch (e) {
      // Fallback for browsers without File System Access API or cancellation
      if ((e as Error).name !== 'AbortError') {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (e) => {
           const file = (e.target as HTMLInputElement).files?.[0];
           if (file) {
             const text = await file.text();
             setContent(text, true, 'system');
             setFileInfo({ name: file.name, isModified: false });
           }
        };
        input.click();
      }
    }
  };

  const handleSave = async () => {
    try {
      if (fileInfo.handle) {
        // @ts-ignore
        const writable = await fileInfo.handle.createWritable();
        await writable.write(content);
        await writable.close();
        setFileInfo(prev => ({ ...prev, isModified: false }));
      } else {
        // Save As / Download
        // @ts-ignore
        if (window.showSaveFilePicker) {
             // @ts-ignore
            const handle = await window.showSaveFilePicker({ suggestedName: fileInfo.name });
            // @ts-ignore
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
            setFileInfo({ name: handle.name, handle, isModified: false });
        } else {
            // Blob download fallback
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileInfo.name;
            a.click();
            URL.revokeObjectURL(url);
            setFileInfo(prev => ({ ...prev, isModified: false }));
        }
      }
    } catch (e) {
      console.error('Save failed', e);
    }
  };

  const handleTransform = (type: TextTransformType) => {
    const textarea = editorRef.current;
    if (textarea && textarea.selectionStart !== textarea.selectionEnd && 
       (type === TextTransformType.UPPERCASE || type === TextTransformType.LOWERCASE || type === TextTransformType.URL_ENCODE)) {
         const start = textarea.selectionStart;
         const end = textarea.selectionEnd;
         const selectedText = content.substring(start, end);
         const processedPart = processText(selectedText, type);
         const newContent = content.substring(0, start) + processedPart + content.substring(end);
         handleContentChange(newContent);
         // Restore selection
         setTimeout(() => {
            textarea.setSelectionRange(start, start + processedPart.length);
            textarea.focus();
         }, 0);
         return;
    }

    const newText = processText(content, type);
    handleContentChange(newText);
  };

  const handleFindNext = () => {
    if (!findOpts.findText) return;
    
    const textarea = editorRef.current;
    if (!textarea) return;

    let searchContent = content;
    let searchText = findOpts.findText;
    
    // Start searching from after current selection
    const searchStartIndex = textarea.selectionEnd;
    
    let matchIndex = -1;

    if (findOpts.useRegex) {
        try {
            const flags = findOpts.matchCase ? 'g' : 'gi';
            const regex = new RegExp(searchText, flags);
            regex.lastIndex = searchStartIndex;
            const match = regex.exec(searchContent);
            if (match) {
                matchIndex = match.index;
                searchText = match[0]; // Adjust length for highlighting
            } else {
                // Wrap around
                regex.lastIndex = 0;
                const wrapMatch = regex.exec(searchContent);
                if (wrapMatch) {
                    matchIndex = wrapMatch.index;
                    searchText = wrapMatch[0];
                }
            }
        } catch (e) {
            alert('Invalid Regex');
            return;
        }
    } else {
        const flags = findOpts.matchCase ? '' : 'i';
        // Basic search
        if (!findOpts.matchCase) {
             searchContent = searchContent.toLowerCase();
             searchText = searchText.toLowerCase();
        }
        matchIndex = searchContent.indexOf(searchText, searchStartIndex);
        if (matchIndex === -1) {
            // Wrap around
            matchIndex = searchContent.indexOf(searchText);
        }
    }

    if (matchIndex !== -1) {
        textarea.focus();
        textarea.setSelectionRange(matchIndex, matchIndex + searchText.length);
        // Scroll into view logic handled natively by textarea focus usually, but helper might be needed
    } else {
        alert('Text not found');
    }
  };

  const handleReplace = () => {
      const textarea = editorRef.current;
      if (!textarea) return;
      
      // Check if current selection matches find text
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);

      let matches = false;
      if (findOpts.useRegex) {
          try {
            const regex = new RegExp(findOpts.findText, findOpts.matchCase ? '' : 'i');
            matches = regex.test(selected);
          } catch {}
      } else {
          matches = findOpts.matchCase 
            ? selected === findOpts.findText 
            : selected.toLowerCase() === findOpts.findText.toLowerCase();
      }

      if (matches) {
          const newContent = content.substring(0, start) + findOpts.replaceText + content.substring(end);
          handleContentChange(newContent);
          // Move to next
          setTimeout(handleFindNext, 0);
      } else {
          handleFindNext();
      }
  };

  const handleReplaceAll = () => {
     let newContent = content;
     if (findOpts.useRegex) {
        try {
            const flags = findOpts.matchCase ? 'g' : 'gi';
            const regex = new RegExp(findOpts.findText, flags);
            newContent = content.replace(regex, findOpts.replaceText);
        } catch { return; }
     } else {
        if (!findOpts.matchCase) {
             const regex = new RegExp(findOpts.findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
             newContent = content.replace(regex, findOpts.replaceText);
        } else {
             newContent = content.split(findOpts.findText).join(findOpts.replaceText);
        }
     }
     handleContentChange(newContent);
  };

  const handleGoToLine = () => {
    const line = parseInt(gotoLine, 10);
    if (isNaN(line)) return;

    const lines = content.split('\n');
    if (line < 1 || line > lines.length) {
        alert(`Line number must be between 1 and ${lines.length}`);
        return;
    }

    // Calculate char index
    let charIdx = 0;
    for (let i = 0; i < line - 1; i++) {
        charIdx += lines[i].length + 1; // +1 for newline
    }

    if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(charIdx, charIdx);
        // Approximate scroll
        editorRef.current.scrollTop = (line - 1) * 24; 
    }
    setActiveModal(null);
  };

  const handleColInsert = () => {
      const newText = insertAtColumn(content, colOpData.column, colOpData.text);
      handleContentChange(newText);
      setActiveModal(null);
  };

  const handleColDelete = () => {
      const newText = deleteAtColumn(content, colOpData.column, colOpData.count);
      handleContentChange(newText);
      setActiveModal(null);
  };
  
  const handleNumberLines = () => {
    const newText = numberLines(content, numberingOpts.start, numberingOpts.prefix, numberingOpts.suffix);
    handleContentChange(newText);
    setActiveModal(null);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleOpen();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setActiveModal('find');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        setActiveModal('goto');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, fileInfo]); 

  return (
    <div className="flex flex-col h-screen w-screen bg-editor-bg text-editor-fg">
      <Toolbar 
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onTransform={handleTransform}
        onOpenModal={setActiveModal}
        onToggleWrap={() => setSettings(p => ({ ...p, wordWrap: !p.wordWrap }))}
        onToggleAI={() => setIsAIOpen(!isAIOpen)}
        wordWrap={settings.wordWrap}
        isAIOpen={isAIOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Editor 
          content={content}
          onChange={handleContentChange}
          onCursorChange={setCursor}
          wordWrap={settings.wordWrap}
          fontSize={settings.fontSize}
          inputRef={editorRef}
        />
        
        <AIPanel 
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          messages={aiMessages}
          onSendMessage={handleAIMessage}
          isProcessing={isAIProcessing}
        />
      </div>

      <div className="relative">

      <StatusBar
        cursor={cursor}
        fileInfo={fileInfo}
        wordCount={content.split(/\s+/).filter(w => w.length > 0).length}
        charCount={content.length}
      />

      {divergentBranches && (
        <div className="absolute bottom-10 right-4">
          <button
            onClick={() => setIsDSPOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 animate-pulse"
          >
            Divergent Branches Detected - Open DSP
          </button>
        </div>
      )}
        {/* AutoSave Indicator */}
        {settings.autoSaveInterval > 0 && (
            <div className="absolute right-2 top-0 bottom-0 flex items-center pr-8 pointer-events-none opacity-50">
                <span className="text-[10px] text-gray-400 mr-1">AutoSave On</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
        )}
      </div>

      {/* --- Modals --- */}
      
      <Modal 
        isOpen={activeModal === 'find'} 
        onClose={() => setActiveModal(null)} 
        title="Find & Replace"
      >
        <div className="space-y-4">
            <div>
                <label className="block text-xs mb-1 text-gray-400">Find what:</label>
                <input 
                    className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm focus:border-editor-accent outline-none"
                    value={findOpts.findText}
                    onChange={e => setFindOpts({...findOpts, findText: e.target.value})}
                    autoFocus
                />
            </div>
            <div>
                <label className="block text-xs mb-1 text-gray-400">Replace with:</label>
                <input 
                    className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm focus:border-editor-accent outline-none"
                    value={findOpts.replaceText}
                    onChange={e => setFindOpts({...findOpts, replaceText: e.target.value})}
                />
            </div>
            <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={findOpts.matchCase} onChange={e => setFindOpts({...findOpts, matchCase: e.target.checked})} />
                    Match Case
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={findOpts.useRegex} onChange={e => setFindOpts({...findOpts, useRegex: e.target.checked})} />
                    Regular Expression
                </label>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-editor-border">
                <button onClick={handleFindNext} className="px-3 py-1 bg-editor-panel hover:bg-editor-border rounded border border-editor-border text-sm">Find Next</button>
                <button onClick={handleReplace} className="px-3 py-1 bg-editor-panel hover:bg-editor-border rounded border border-editor-border text-sm">Replace</button>
                <button onClick={handleReplaceAll} className="px-3 py-1 bg-editor-accent hover:bg-blue-600 rounded text-white text-sm">Replace All</button>
            </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'goto'} 
        onClose={() => setActiveModal(null)} 
        title="Go To Line"
      >
        <div className="space-y-4">
            <input 
                type="number"
                placeholder="Line number"
                className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm focus:border-editor-accent outline-none"
                value={gotoLine}
                onChange={e => setGotoLine(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGoToLine()}
                autoFocus
            />
            <div className="flex justify-end">
                <button onClick={handleGoToLine} className="px-4 py-1.5 bg-editor-accent hover:bg-blue-600 rounded text-white text-sm">Go</button>
            </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'colInsert'} 
        onClose={() => setActiveModal(null)} 
        title="Column Mode: Insert"
      >
        <div className="space-y-3">
             <p className="text-xs text-gray-400">Inserts text at the specified column index for EVERY line.</p>
            <div>
                <label className="block text-xs mb-1">Column Index:</label>
                <input 
                    type="number"
                    min="0"
                    className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm"
                    value={colOpData.column}
                    onChange={e => setColOpData({...colOpData, column: parseInt(e.target.value)})}
                />
            </div>
            <div>
                <label className="block text-xs mb-1">Text to Insert:</label>
                <input 
                    className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm"
                    value={colOpData.text}
                    onChange={e => setColOpData({...colOpData, text: e.target.value})}
                />
            </div>
            <div className="flex justify-end">
                <button onClick={handleColInsert} className="px-4 py-1.5 bg-editor-accent hover:bg-blue-600 rounded text-white text-sm">Insert</button>
            </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'colDelete'} 
        onClose={() => setActiveModal(null)} 
        title="Column Mode: Delete"
      >
        <div className="space-y-3">
            <p className="text-xs text-gray-400">Deletes characters at the specified column for EVERY line.</p>
            <div>
                <label className="block text-xs mb-1">Start Column Index:</label>
                <input 
                    type="number"
                    min="0"
                    className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm"
                    value={colOpData.column}
                    onChange={e => setColOpData({...colOpData, column: parseInt(e.target.value)})}
                />
            </div>
            <div>
                <label className="block text-xs mb-1">Character Count to Delete:</label>
                <input 
                    type="number"
                    min="1"
                    className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm"
                    value={colOpData.count}
                    onChange={e => setColOpData({...colOpData, count: parseInt(e.target.value)})}
                />
            </div>
            <div className="flex justify-end">
                <button onClick={handleColDelete} className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-white text-sm">Delete</button>
            </div>
        </div>
      </Modal>
      
      <Modal 
        isOpen={activeModal === 'numberLines'} 
        onClose={() => setActiveModal(null)} 
        title="Number Lines"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Start Number:</label>
            <input 
                type="number"
                className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm focus:border-editor-accent outline-none"
                value={numberingOpts.start}
                onChange={e => setNumberingOpts({...numberingOpts, start: parseInt(e.target.value) || 1})}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs mb-1">Prefix:</label>
              <input 
                  className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm focus:border-editor-accent outline-none"
                  value={numberingOpts.prefix}
                  placeholder="(e.g. 'Line ')"
                  onChange={e => setNumberingOpts({...numberingOpts, prefix: e.target.value})}
              />
            </div>
            <div className="flex-1">
               <label className="block text-xs mb-1">Suffix:</label>
               <input 
                  className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm focus:border-editor-accent outline-none"
                  value={numberingOpts.suffix}
                  placeholder="(e.g. '. ')"
                  onChange={e => setNumberingOpts({...numberingOpts, suffix: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleNumberLines} className="px-4 py-1.5 bg-editor-accent hover:bg-blue-600 rounded text-white text-sm">Apply</button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'preferences'} 
        onClose={() => setActiveModal(null)} 
        title="Editor Preferences"
      >
        <div className="space-y-6">
          {/* Font Size */}
          <div>
             <label className="block text-sm font-medium mb-2">Font Size ({settings.fontSize}px)</label>
             <input 
               type="range" 
               min="10" 
               max="32" 
               step="1"
               value={settings.fontSize}
               onChange={(e) => setSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
               className="w-full accent-editor-accent h-2 bg-editor-border rounded-lg appearance-none cursor-pointer"
             />
          </div>

          {/* Word Wrap */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Word Wrap</label>
            <button 
              onClick={() => setSettings(p => ({ ...p, wordWrap: !p.wordWrap }))}
              className={`w-10 h-5 rounded-full relative transition-colors ${settings.wordWrap ? 'bg-editor-accent' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.wordWrap ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Auto Save */}
          <div>
            <label className="block text-sm font-medium mb-2">Auto-Save Interval</label>
            <select 
              value={settings.autoSaveInterval}
              onChange={(e) => setSettings(prev => ({ ...prev, autoSaveInterval: parseInt(e.target.value) }))}
              className="w-full bg-editor-bg border border-editor-border p-2 rounded text-sm outline-none focus:border-editor-accent"
            >
              <option value={0}>Disabled</option>
              <option value={5000}>Every 5 Seconds</option>
              <option value={15000}>Every 15 Seconds</option>
              <option value={30000}>Every 30 Seconds</option>
              <option value={60000}>Every Minute</option>
            </select>
          </div>

          <div className="pt-2 text-xs text-gray-500">
             Settings are automatically saved to local storage.
          </div>
        </div>
      </Modal>


{divergentBranches && divergentBranches.length >= 2 && (
        <DSPModal
            isOpen={isDSPOpen}
            onClose={() => setIsDSPOpen(false)}
            ancestorNode={getLowestCommonAncestor(divergentBranches[0].id, divergentBranches[1].id) || nodes.get(divergentBranches[0].id)!}
            branches={divergentBranches}
            onMerge={(branchIds, synthesizedText) => {
                mergeBranches(branchIds, synthesizedText, 'synthesis');
                setIsDSPOpen(false);
                setDivergentBranches(null);
            }}
        />
      )}
    </div>
  );
}
