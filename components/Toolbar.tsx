
import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Scissors, 
  Type, 
  Code, 
  Settings, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { TextTransformType } from '../types';

interface ToolbarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onTransform: (type: TextTransformType) => void;
  onOpenModal: (name: string) => void;
  onToggleWrap: () => void;
  onToggleAI: () => void;
  wordWrap: boolean;
  isAIOpen: boolean;
}

const MenuButton = ({ label, children, icon: Icon }: { label: string, children: React.ReactNode, icon?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        className={`px-3 py-1.5 text-sm hover:bg-editor-selection flex items-center gap-1.5 transition-colors ${isOpen ? 'bg-editor-selection' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && <Icon size={14} className="text-gray-400" />}
        {label}
        <ChevronDown size={10} className="opacity-50" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-editor-panel border border-editor-border shadow-lg rounded-md py-1 z-50 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ label, onClick, shortcut, danger = false }: { label: string, onClick: () => void, shortcut?: string, danger?: boolean }) => (
  <button 
    className={`px-4 py-2 text-left text-sm hover:bg-editor-selection flex justify-between items-center group w-full ${danger ? 'text-red-400' : 'text-editor-fg'}`}
    onClick={() => { onClick(); }}
  >
    <span>{label}</span>
    {shortcut && <span className="text-xs text-gray-500 group-hover:text-gray-300">{shortcut}</span>}
  </button>
);

const Divider = () => <div className="h-px bg-editor-border my-1 mx-2" />;

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onNew, onOpen, onSave, onTransform, onOpenModal, onToggleWrap, onToggleAI, wordWrap, isAIOpen
}) => {
  return (
    <div className="h-10 bg-editor-panel border-b border-editor-border flex items-center justify-between px-2 select-none">
      
      <div className="flex items-center">
        {/* File Menu */}
        <MenuButton label="File" icon={FileText}>
          <MenuItem label="New" onClick={onNew} shortcut="Ctrl+N" />
          <MenuItem label="Open..." onClick={onOpen} shortcut="Ctrl+O" />
          <MenuItem label="Save" onClick={onSave} shortcut="Ctrl+S" />
        </MenuButton>

        {/* Edit Menu */}
        <MenuButton label="Edit" icon={Scissors}>
          <MenuItem label="Find / Replace..." onClick={() => onOpenModal('find')} shortcut="Ctrl+F" />
          <MenuItem label="Go To Line..." onClick={() => onOpenModal('goto')} shortcut="Ctrl+G" />
          <Divider />
          <MenuItem label="Column Mode Insert..." onClick={() => onOpenModal('colInsert')} />
          <MenuItem label="Column Mode Delete..." onClick={() => onOpenModal('colDelete')} />
        </MenuButton>

        {/* TextFX Menu */}
        <MenuButton label="TextFX" icon={Code}>
          <div className="px-2 py-1 text-xs font-bold text-editor-accent uppercase tracking-wider">Lines</div>
          <MenuItem label="Sort Ascending" onClick={() => onTransform(TextTransformType.SORT_ASC)} />
          <MenuItem label="Sort Descending" onClick={() => onTransform(TextTransformType.SORT_DESC)} />
          <MenuItem label="Remove Duplicates" onClick={() => onTransform(TextTransformType.UNIQUE_LINES)} />
          <MenuItem label="Remove Empty Lines" onClick={() => onTransform(TextTransformType.REMOVE_EMPTY)} />
          <MenuItem label="Reverse Lines" onClick={() => onTransform(TextTransformType.REVERSE_LINES)} />
          <MenuItem label="Number Lines..." onClick={() => onOpenModal('numberLines')} />
          <Divider />
          <div className="px-2 py-1 text-xs font-bold text-editor-accent uppercase tracking-wider">Characters</div>
          <MenuItem label="Trim Trailing Space" onClick={() => onTransform(TextTransformType.TRIM_TRAILING)} />
          <MenuItem label="Trim Leading Space" onClick={() => onTransform(TextTransformType.TRIM_LEADING)} />
          <MenuItem label="To Uppercase" onClick={() => onTransform(TextTransformType.UPPERCASE)} />
          <MenuItem label="To Lowercase" onClick={() => onTransform(TextTransformType.LOWERCASE)} />
        </MenuButton>

        {/* Encode Menu */}
        <MenuButton label="Convert" icon={Type}>
          <MenuItem label="Base64 Encode" onClick={() => onTransform(TextTransformType.BASE64_ENCODE)} />
          <MenuItem label="Base64 Decode" onClick={() => onTransform(TextTransformType.BASE64_DECODE)} />
          <Divider />
          <MenuItem label="URL Encode" onClick={() => onTransform(TextTransformType.URL_ENCODE)} />
          <MenuItem label="URL Decode" onClick={() => onTransform(TextTransformType.URL_DECODE)} />
          <Divider />
          <MenuItem label="HTML Entities Encode" onClick={() => onTransform(TextTransformType.HTML_ENCODE)} />
          <MenuItem label="HTML Entities Decode" onClick={() => onTransform(TextTransformType.HTML_DECODE)} />
        </MenuButton>

        {/* View Menu */}
        <MenuButton label="View" icon={Settings}>
          <MenuItem 
            label={`Word Wrap: ${wordWrap ? 'ON' : 'OFF'}`} 
            onClick={onToggleWrap} 
          />
          <Divider />
          <MenuItem label="Preferences..." onClick={() => onOpenModal('preferences')} />
        </MenuButton>
      </div>

      {/* AI Toggle */}
      <button 
        onClick={onToggleAI}
        className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full transition-all ${isAIOpen ? 'bg-editor-accent text-white shadow-lg' : 'bg-editor-panel border border-editor-border text-gray-400 hover:text-white'}`}
      >
        <Sparkles size={14} />
        Gemini AI
      </button>

    </div>
  );
};
