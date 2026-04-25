import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from './EditorContext';
import { getSafeValue } from './utils';

interface EditableTextProps {
  contentKey: string;
  defaultAr: string;
  defaultEn: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function EditableText({ 
  contentKey, 
  defaultAr, 
  defaultEn, 
  className = '',
  as = 'span' 
}: EditableTextProps) {
  const { isEditing, currentLang, pageContent, updateContent } = useEditor();
  const contentRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Get current content with fallback using getSafeValue
  const contentValue = pageContent[contentKey];
  const displayValue = getSafeValue(
    contentValue || { ar: defaultAr, en: defaultEn }, 
    currentLang
  );

  const [localContent, setLocalContent] = useState(displayValue);

  // Sync when language or external content changes (only if not currently typing)
  useEffect(() => {
    if (!isFocused) {
      setLocalContent(displayValue);
    }
  }, [displayValue, isFocused]);

  const Tag = as as any;

  if (!isEditing) {
    return <Tag className={className}>{displayValue}</Tag>;
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsFocused(false);
    // Sanitize: strip all HTML tags and trim
    const cleanValue = e.currentTarget.innerText.replace(/<[^>]*>/g, "").trim();
    
    // Update local state and parent if changed
    if (cleanValue !== displayValue) {
      const updatedValue = typeof contentValue === 'object' ? { ...contentValue } : {
        ar: defaultAr,
        en: defaultEn
      };
      
      updatedValue[currentLang] = cleanValue;
      updateContent(contentKey, updatedValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    // Force plain text only
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Enter key for headings and short tags to keep DOM clean
    if (e.key === 'Enter' && Tag !== 'p' && Tag !== 'span') {
      e.preventDefault();
    }
  };

  return (
    <Tag
      ref={contentRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      className={`
        ${className} 
        outline-none transition-all duration-200
        hover:ring-2 hover:ring-brand-gold/30 hover:ring-dashed hover:ring-offset-1
        focus:ring-2 focus:ring-brand-green/40 focus:ring-solid focus:ring-offset-1
        cursor-text relative z-10
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onInput={(e: React.FormEvent<HTMLElement>) => setLocalContent(e.currentTarget.innerText)}
    >
      {localContent}
    </Tag>
  );
}
