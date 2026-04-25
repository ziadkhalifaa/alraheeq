import React from 'react';
import { useEditor } from './EditorContext';

interface EditableSectionProps {
  children: React.ReactNode;
  sectionId?: string; // For future features
}

/**
 * EditableSection now acts as a non-destructive overlay provider.
 * It does NOT render a wrapper tag. The parent component MUST have 'relative' positioning.
 */
export function EditableSection({ children, sectionId }: EditableSectionProps) {
  const { isEditing } = useEditor();

  if (!isEditing) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Absolute overlay for the section boundaries */}
      {/* Parent must be relative for this to work correctly */}
      <div 
        className="absolute inset-0 border-2 border-transparent hover:border-brand-green/30 pointer-events-none transition-colors z-[1] group-hover/section:border-brand-green/20" 
        data-section-id={sectionId}
      />
    </>
  );
}
