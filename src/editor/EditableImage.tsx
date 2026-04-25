import React, { useState } from 'react';
import { useEditor } from './EditorContext';
import { MediaLibraryModal } from '../admin/editor/MediaLibraryModal';

interface EditableImageProps {
  contentKey: string;
  defaultSrc: string;
  alt?: string;
  className?: string; // Applied to the <img>
  imgClassName?: string; // Also applied to the <img> for backward compatibility
}

export function EditableImage({ 
  contentKey, 
  defaultSrc, 
  alt = '', 
  className = '',
  imgClassName = ''
}: EditableImageProps) {
  const { isEditing, pageContent, updateContent } = useEditor();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get current content with fallback
  const contentValue = pageContent[contentKey];
  const displaySrc = contentValue?.src || defaultSrc;
  
  // Handle alt text (which could be an object)
  const rawAlt = contentValue?.alt || alt;
  const displayAlt = typeof rawAlt === 'object' ? (rawAlt.en || rawAlt.ar || '') : String(rawAlt);

  const handleSelectImage = (url: string) => {
    updateContent(contentKey, { src: url, alt: displayAlt });
    setIsModalOpen(false);
  };

  const combinedClassName = `${className} ${imgClassName}`.trim();

  if (!isEditing) {
    return (
      <img 
        src={displaySrc} 
        alt={displayAlt} 
        className={combinedClassName} 
      />
    );
  }

  return (
    <>
      <img 
        src={displaySrc} 
        alt={displayAlt} 
        className={`${combinedClassName} cursor-pointer hover:opacity-90 transition-all hover:ring-4 hover:ring-brand-gold/40 active:scale-[0.98]`}
        onClick={() => setIsModalOpen(true)}
        title="Click to change image"
      />

      <MediaLibraryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectImage}
      />
    </>
  );
}
