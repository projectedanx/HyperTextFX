import { TextTransformType } from '../types';

/**
 * Executes synchronous, deterministic text transformations mapped via the TextTransformType enum.
 *
 * @param {string} text - The raw text payload to be transformed.
 * @param {TextTransformType} type - The specific structural mutation to apply.
 * @returns {string} The transformed text payload.
 */
export const processText = (text: string, type: TextTransformType): string => {
  const lines = text.split('\n');

  switch (type) {
    // Case Conversions
    case TextTransformType.UPPERCASE:
      return text.toUpperCase();
    case TextTransformType.LOWERCASE:
      return text.toLowerCase();
    case TextTransformType.TITLECASE:
      return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    // Line Operations
    case TextTransformType.REVERSE_LINES:
      return lines.reverse().join('\n');
    case TextTransformType.SORT_ASC:
      return lines.sort().join('\n');
    case TextTransformType.SORT_DESC:
      return lines.sort().reverse().join('\n');
    case TextTransformType.UNIQUE_LINES:
      return [...new Set(lines)].join('\n');
    
    // Trim/Clean
    case TextTransformType.TRIM_LEADING:
      return lines.map(l => l.trimStart()).join('\n');
    case TextTransformType.TRIM_TRAILING:
      return lines.map(l => l.trimEnd()).join('\n');
    case TextTransformType.REMOVE_EMPTY:
      return lines.filter(l => l.trim().length > 0).join('\n');
    case TextTransformType.JOIN_LINES:
      return lines.join(' ');

    // Encoding
    case TextTransformType.BASE64_ENCODE:
      try { return btoa(text); } catch { return 'Error: Invalid input for Base64'; }
    case TextTransformType.BASE64_DECODE:
      try { return atob(text); } catch { return 'Error: Invalid Base64 string'; }
    case TextTransformType.URL_ENCODE:
      return encodeURIComponent(text);
    case TextTransformType.URL_DECODE:
      return decodeURIComponent(text);
    case TextTransformType.HTML_ENCODE:
      return text.replace(/[\u00A0-\u9999<>\&]/g, (i) => '&#' + i.charCodeAt(0) + ';');
    case TextTransformType.HTML_DECODE:
      const doc = new DOMParser().parseFromString(text, "text/html");
      return doc.documentElement.textContent || "";
      
    default:
      return text;
  }
};

/**
 * Topologically inserts a string at a specific column index across all lines in the buffer.
 *
 * @param {string} text - The target text buffer.
 * @param {number} column - The zero-based column index for insertion.
 * @param {string} stringToInsert - The payload to extrude into the specified column.
 * @returns {string} The modified text buffer.
 */
export const insertAtColumn = (text: string, column: number, stringToInsert: string): string => {
  const lines = text.split('\n');
  const processed = lines.map(line => {
    if (line.length < column) {
      // Pad with spaces if line is too short
      return line + ' '.repeat(column - line.length) + stringToInsert;
    }
    return line.slice(0, column) + stringToInsert + line.slice(column);
  });
  return processed.join('\n');
};

/**
 * Performs deterministic geometric deletion starting at a specific column across all lines.
 *
 * @param {string} text - The target text buffer.
 * @param {number} column - The zero-based starting column index.
 * @param {number} count - The number of characters to obliterate.
 * @returns {string} The modified text buffer.
 */
export const deleteAtColumn = (text: string, column: number, count: number): string => {
  const lines = text.split('\n');
  const processed = lines.map(line => {
    if (line.length <= column) return line;
    return line.slice(0, column) + line.slice(column + count);
  });
  return processed.join('\n');
};

/**
 * Sequentially numbers all lines in the text buffer with optional contextual bounding.
 *
 * @param {string} text - The target text buffer.
 * @param {number} start - The initial integer to begin counting from.
 * @param {string} [prefix=''] - A structural prefix appended before the number.
 * @param {string} [suffix=' '] - A structural suffix appended after the number.
 * @returns {string} The numbered text buffer.
 */
export const numberLines = (text: string, start: number, prefix: string = '', suffix: string = ' '): string => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    return `${prefix}${start + index}${suffix}${line}`;
  }).join('\n');
};