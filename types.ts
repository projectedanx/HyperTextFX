
/**
 * Represents the spatial coordinates and selection bounds of the cursor within the editor.
 * Used for deterministic topographical mapping.
 */
export interface CursorPos {
  line: number;
  col: number;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * Encapsulates metadata and system handle references for the currently active file.
 * Anchors the document to the local file system constraints.
 */
export interface FileInfo {
  name: string;
  handle?: FileSystemFileHandle;
  isModified: boolean;
}

/**
 * Enumerates the deterministic structural mutations available via the TextFX menu.
 * These operations are strictly synchronous and independent of AI streaming.
 */
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

/**
 * Defines the user-configurable visual and behavioral parameters of the editing environment.
 */
export interface EditorSettings {
  wordWrap: boolean;
  showLineNumbers: boolean;
  fontSize: number;
  autoSaveInterval: number; // in ms, 0 = disabled
}

/**
 * Configures the parameters for synchronous string matching and substitution operations.
 */
export interface FindReplaceOptions {
  findText: string;
  replaceText: string;
  useRegex: boolean;
  matchCase: boolean;
}

/**
 * Represents a single dialectical exchange entity between the human operator and the AI system.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

/**
 * The constrained epistemic state snapshot transmitted to the AI engine.
 * Contains only the active buffer geometry to prevent context contamination.
 */
export interface AIContext {
  fullText: string;
  selection: string;
  cursor: CursorPos;
  fileName: string;
}

/**
 * A vertex in the Symbiotic Paraconsistent Undo Graph (SPUG).
 * Represents a discreet temporal state mutation, allowing for non-linear, divergent history tracks.
 * @template T The type of the state payload (typically the raw text buffer).
 */
export interface HistoryNode<T> {
  id: string;
  parentId: string | null;
  parentIds?: string[]; // Support for DAG structure (Dialectical Synthesis)
  childrenIds: string[];
  state: T;
  timestamp: number;
  origin: 'user' | 'ai' | 'system' | 'synthesis';
}

/**
 * Identifies a non-merged leaf node within the SPUG, signifying un-synthesized parallel intents.
 * @template T The type of the state payload.
 */
export interface DivergentBranch<T> {
  id: string;
  state: T;
  origin: 'user' | 'ai' | 'system' | 'synthesis';
  timestamp: number;
}
