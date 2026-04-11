import React, { useRef, useEffect } from 'react';
import { CursorPos } from '../types';

interface EditorProps {
  content: string;
  onChange: (text: string) => void;
  onCursorChange: (pos: CursorPos) => void;
  wordWrap: boolean;
  fontSize: number;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export const Editor: React.FC<EditorProps> = ({ 
  content, 
  onChange, 
  onCursorChange, 
  wordWrap, 
  fontSize,
  inputRef 
}) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  // Calculate line numbers
  const lines = content.split('\n');
  const lineCount = lines.length;

  // Sync scrolling
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const val = target.value;
    const selStart = target.selectionStart;
    
    // Calculate line and col
    const linesUpToCursor = val.substr(0, selStart).split('\n');
    const line = linesUpToCursor.length;
    const col = linesUpToCursor[linesUpToCursor.length - 1].length + 1;

    onCursorChange({
      line,
      col,
      selectionStart: target.selectionStart,
      selectionEnd: target.selectionEnd
    });
  };

  // Keep line numbers scroll synced if content changes significantly
  useEffect(() => {
    if(inputRef.current && lineNumbersRef.current) {
       lineNumbersRef.current.scrollTop = inputRef.current.scrollTop;
    }
  }, [content]);

  return (
    <div className="flex-1 flex overflow-hidden relative font-mono" style={{ fontSize: `${fontSize}px` }}>
      
      {/* Line Numbers Gutter */}
      <div 
        ref={lineNumbersRef}
        className="bg-editor-panel text-editor-lineNo border-r border-editor-border text-right select-none overflow-hidden py-4 px-2"
        style={{ width: '3.5rem' }}
      >
        <div className="min-h-full">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} style={{ lineHeight: '1.5rem', height: '1.5rem' }}>
              {i + 1}
            </div>
          ))}
          {/* Extra space at bottom */}
          <div className="h-96"></div>
        </div>
      </div>

      {/* Main Text Area */}
      <textarea
        ref={inputRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onSelect={handleSelect}
        onClick={handleSelect}
        onKeyUp={handleSelect}
        spellCheck={false}
        className={`flex-1 bg-editor-bg text-editor-fg p-4 resize-none outline-none border-none leading-6 w-full ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}
        style={{ lineHeight: '1.5rem' }}
      />
    </div>
  );
};