import React from 'react';
import { useEditor } from './EditorContext';
import { Save, Send, RotateCcw, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';

export function EditorToolbar() {
  const { 
    isEditing, 
    isSaving, 
    hasUnpublishedChanges, 
    publish, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useEditor();

  if (!isEditing) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-2 flex items-center gap-2">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
          {hasUnpublishedChanges ? (
            <>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Draft</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
              <span className="text-xs font-bold text-brand-green uppercase tracking-wider">Published</span>
            </>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button 
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Redo (Ctrl+Shift+Z)"
          >
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={publish}
            disabled={isSaving || !hasUnpublishedChanges}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-green text-white font-bold text-sm shadow-brand hover:shadow-brand-lg disabled:opacity-50 disabled:grayscale transition-all"
          >
            <Send className="w-4 h-4" />
            Publish Changes
          </button>
        </div>

        {/* Saving indicator mini */}
        {isSaving && (
          <div className="flex items-center gap-2 px-2 animate-pulse">
            <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
            <span className="text-[10px] font-bold text-brand-gold uppercase">Saving</span>
          </div>
        )}
      </div>
    </div>
  );
}
