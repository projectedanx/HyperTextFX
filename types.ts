
export interface CursorPos {
  line: number;
  col: number;
  selectionStart: number;
  selectionEnd: number;
}

export interface FileInfo {
  name: string;
  handle?: FileSystemFileHandle;
  isModified: boolean;
}

export enum TextTransformType {
  UPPERCASE = 'UPPERCASE',
  LOWERCASE = 'LOWERCASE',
  TITLECASE = 'TITLECASE',
  REVERSE_LINES = 'REVERSE_LINES',
  SORT_ASC = 'SORT_ASC',
  SORT_DESC = 'SORT_DESC',
  UNIQUE_LINES = 'UNIQUE_LINES',
  TRIM_LEADING = 'TRIM_LEADING',
  TRIM_TRAILING = 'TRIM_TRAILING',
  REMOVE_EMPTY = 'REMOVE_EMPTY',
  BASE64_ENCODE = 'BASE64_ENCODE',
  BASE64_DECODE = 'BASE64_DECODE',
  URL_ENCODE = 'URL_ENCODE',
  URL_DECODE = 'URL_DECODE',
  HTML_ENCODE = 'HTML_ENCODE',
  HTML_DECODE = 'HTML_DECODE',
  JOIN_LINES = 'JOIN_LINES',
}

export interface EditorSettings {
  wordWrap: boolean;
  showLineNumbers: boolean;
  fontSize: number;
  autoSaveInterval: number; // in ms, 0 = disabled
}

export interface FindReplaceOptions {
  findText: string;
  replaceText: string;
  useRegex: boolean;
  matchCase: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface AIContext {
  fullText: string;
  selection: string;
  cursor: CursorPos;
  fileName: string;
}

export interface HistoryNode<T> {
  id: string;
  parentId: string | null;
  childrenIds: string[];
  state: T;
  timestamp: number;
  origin: 'user' | 'ai' | 'system';
}
