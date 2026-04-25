import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api, { pageApi } from '@/api/api';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { EditorToolbar } from './EditorToolbar';

interface EditorContextType {
  isEditing: boolean;
  currentLang: string;
  pageContent: Record<string, any>;
  updateContent: (key: string, value: any) => void;
  undo: () => void;
  redo: () => void;
  publish: () => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  hasUnpublishedChanges: boolean;
  slug: string;
  isSaving: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Simple debounce helper
function useDebounce(callback: Function, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export function EditorProvider({ 
  children, 
  slug, 
  isEditing = false 
}: { 
  children: React.ReactNode, 
  slug: string,
  isEditing?: boolean
}) {
  const { language } = useLanguage();
  const [pageContent, setPageContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Undo/Redo History
  const [history, setHistory] = useState<Record<string, any>[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Ensure content is loaded from server
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        // If in editing mode, fetch draft. Otherwise, fetch published.
        const mode = isEditing ? 'draft' : 'published';
        const res = await pageApi.getContent(slug, mode);
        const content = res.data.content || {};
        setPageContent(content);
        
        // Initialize history
        setHistory([content]);
        setHistoryIndex(0);
      } catch (err) {
        console.error('Failed to load page content:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchContent();
    } else {
      setLoading(false);
    }
  }, [slug, isEditing]);

  // Actual backend sync
  const syncWithBackend = useCallback(async (key: string, value: any) => {
    setIsSaving(true);
    console.log(`[Sync] Attempting to sync key: ${key} for slug: ${slug}`);
    try {
      await pageApi.updateContent(slug, {
        content_key: key,
        value: value,
        language: language
      });
      console.log(`[Sync] Successfully synced key: ${key}`);
      setHasUnpublishedChanges(true);
    } catch (err) {
      console.error('Failed to save content:', err);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  }, [slug, language]);

  const debouncedSync = useDebounce(syncWithBackend, 1000);

  const updateContent = useCallback((key: string, value: any) => {
    if (!isEditing) return;

    setPageContent(prev => {
      const next = { ...prev, [key]: value };
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      if (newHistory.length > 50) newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return next;
    });

    debouncedSync(key, value);
  }, [isEditing, debouncedSync, history, historyIndex]);

  const publish = useCallback(async () => {
    console.log(`[Publish] Attempting to publish slug: ${slug}`);
    setIsSaving(true);
    try {
      const res = await pageApi.publish(slug);
      console.log(`[Publish] Successfully published slug: ${slug}`, res.data);
      setHasUnpublishedChanges(false);
      toast.success('Page published successfully! Changes are now live.');
    } catch (err) {
      console.error('Failed to publish content:', err);
      toast.error('Failed to publish content');
    } finally {
      setIsSaving(false);
    }
  }, [slug]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      setPageContent(prevState);
      setHistoryIndex(prevIndex);
      toast.info('Undo successful');
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      setPageContent(nextState);
      setHistoryIndex(nextIndex);
      toast.info('Redo successful');
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, undo, redo]);

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading editor...</p>
      </div>
    );
  }

  return (
    <EditorContext.Provider value={{ 
      isEditing, 
      currentLang: language, 
      pageContent, 
      updateContent, 
      undo,
      redo,
      publish,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < history.length - 1,
      hasUnpublishedChanges,
      slug,
      isSaving,
      selectedId,
      setSelectedId 
    }}>
      {children}
      
      {/* Admin Toolbar */}
      <EditorToolbar />
      
      {/* Global Saving Indicator (Mini) */}
      {isSaving && !hasUnpublishedChanges && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white/90 backdrop-blur-md border border-brand-green/20 px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            <span className="text-xs font-bold text-brand-green uppercase tracking-widest">Syncing...</span>
          </div>
        </div>
      )}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    return {
      isEditing: false,
      currentLang: 'ar',
      pageContent: {},
      updateContent: () => {},
      undo: () => {},
      redo: () => {},
      publish: async () => {},
      canUndo: false,
      canRedo: false,
      hasUnpublishedChanges: false,
      slug: '',
      isSaving: false
    };
  }
  return context;
}
