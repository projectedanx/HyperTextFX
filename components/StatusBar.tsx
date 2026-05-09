import React from 'react';
import { CursorPos } from '../types';

/**
 * Contract defining the real-time geometric parameters of the current file buffer.
 */
interface StatusBarProps {
  cursor: CursorPos;
  textLength: number;
  lineCount: number;
  fileFormat: string;
}

/**
 * The deterministic telemetry extrusion layer.
 * Visually confirms the exact spatial coordinates (cursor mapping) and structural mass (lines, characters)
 * of the currently active SPUG node.
 *
 * @param {StatusBarProps} props - The real-time metrics of the text buffer.
 */
export const StatusBar: React.FC<StatusBarProps> = ({ cursor, textLength, lineCount, fileFormat }) => {
  return (
    <div className="h-6 bg-editor-accent text-white text-xs flex items-center justify-between px-3 select-none">
      <div className="flex space-x-4">
        <span>Ln {cursor.line}, Col {cursor.col}</span>
        <span>Sel: {cursor.selectionEnd - cursor.selectionStart}</span>
      </div>
      <div className="flex space-x-4">
        <span>{lineCount} lines</span>
        <span>{textLength} chars</span>
        <span className="font-semibold">{fileFormat}</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};