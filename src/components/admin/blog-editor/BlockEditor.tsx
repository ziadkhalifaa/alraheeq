import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { EditorBlock, PostMetadata, BlockType } from './types';
import BlockItem from './BlockItem';
import SlashMenu from './SlashMenu';
import BlogEditorSidebar from './BlogEditorSidebar';
import PreviewPanel from './PreviewPanel';
import { 
  Plus, Globe, Save, Eye, Settings, ChevronLeft, 
  Languages, Maximize2, Minimize2, Command, BarChart3, 
  AlertCircle, Type, Layout, Sidebar as SidebarIcon,
  CheckCircle2, Clock, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import EditorToolbar from './EditorToolbar';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface BlockEditorProps {
  initialBlocks?: EditorBlock[];
  initialMetadata?: PostMetadata;
  onSave: (blocks: EditorBlock[], metadata: PostMetadata) => void;
}

export default function BlockEditor({ initialBlocks = [], initialMetadata, onSave }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks.length > 0 ? initialBlocks : [
    { id: uuidv4(), type: 'paragraph', content: { en: '', ar: '' } }
  ]);
  const [metadata, setMetadata] = useState<PostMetadata>(initialMetadata || {
    title: { en: '', ar: '' },
    excerpt: { en: '', ar: '' },
    slug: '',
    image_url: '',
    author: 'Alraheeq',
    status: 'draft',
    metaTitle: { en: '', ar: '' },
    metaDescription: { en: '', ar: '' }
  });

  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');
  const [isSplitView, setIsSplitView] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [slashMenuPos, setSlashMenuPos] = useState<{ x: number, y: number, blockId: string } | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const text = blocks.map(b => (b.content.en || '') + ' ' + (b.content.ar || '')).join(' ');
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.ceil(words / 200);
    return { words, readingTime };
  }, [blocks]);

  // Autohave logic
  const handleAutoSave = useCallback(async () => {
    setIsSaving(true);
    // Mock save
    await new Promise(r => setTimeout(r, 1000));
    setLastSaved(new Date());
    setIsSaving(false);
  }, [blocks, metadata]);

  useEffect(() => {
    const timer = setTimeout(handleAutoSave, 30000); // 30s
    return () => clearTimeout(timer);
  }, [blocks, metadata, handleAutoSave]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave(blocks, metadata);
        toast.success('Saved successfully');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger some search or menu?
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [blocks, metadata, onSave]);

  const addBlock = (type: BlockType, afterId?: string) => {
    const newBlock: EditorBlock = {
      id: uuidv4(),
      type,
      content: { en: '', ar: '' }
    };
    const index = afterId ? blocks.findIndex(b => b.id === afterId) : blocks.length - 1;
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setTimeout(() => setFocusedBlockId(newBlock.id), 10);
    setSlashMenuPos(null);
  };

  const deleteBlock = (id: string, focusPrev = false) => {
    if (blocks.length <= 1) return;
    const index = blocks.findIndex(b => b.id === id);
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (focusPrev && index > 0) setFocusedBlockId(blocks[index - 1].id);
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b));
  };

  const moveFocus = (currentId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === currentId);
    if (direction === 'up' && index > 0) setFocusedBlockId(blocks[index - 1].id);
    else if (direction === 'down' && index < blocks.length - 1) setFocusedBlockId(blocks[index + 1].id);
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${isFocusMode ? 'bg-gray-50' : 'bg-white'}`}>
      <div className={`flex flex-col flex-grow relative transition-all duration-500 ${showSidebar ? 'mr-[380px]' : ''}`}>
        
        {/* Advanced Top Bar */}
        <header className={`h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40 transition-all ${isFocusMode ? '-translate-y-full opacity-0' : ''}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editor</span>
              <div className="flex items-center gap-2">
                {isSaving ? (
                  <span className="text-[10px] text-brand-green animate-pulse font-bold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Saving...
                  </span>
                ) : lastSaved ? (
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-brand-green" /> Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 p-1 rounded-xl mr-4">
              <button 
                onClick={() => { setIsSplitView(false); setActiveLang('en'); }} 
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${!isSplitView && activeLang === 'en' ? 'bg-white shadow-sm text-brand-green' : 'text-gray-400 hover:text-gray-600'}`}
              >
                EN
              </button>
              <button 
                onClick={() => { setIsSplitView(false); setActiveLang('ar'); }} 
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${!isSplitView && activeLang === 'ar' ? 'bg-white shadow-sm text-brand-green' : 'text-gray-400 hover:text-gray-600'}`}
              >
                AR
              </button>
              <button 
                onClick={() => setIsSplitView(true)} 
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${isSplitView ? 'bg-white shadow-sm text-brand-green' : 'text-gray-400 hover:text-gray-600'}`}
              >
                SPLIT
              </button>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setIsFocusMode(!isFocusMode)} className="rounded-xl h-9 text-gray-500">
              {isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(true)} className="rounded-xl h-9 text-gray-500 gap-2">
              <Eye size={18} /> <span className="hidden lg:inline">Preview</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)} className={`rounded-xl h-9 gap-2 ${showSidebar ? 'text-brand-green bg-green-50' : 'text-gray-500'}`}>
              <SidebarIcon size={18} /> <span className="hidden lg:inline">Settings</span>
            </Button>
            <Button onClick={() => onSave(blocks, { ...metadata, status: 'published' })} className="bg-brand-green hover:bg-brand-green-dark text-white gap-2 px-6 rounded-xl font-bold h-9 shadow-lg shadow-brand-green/20">
              Publish
            </Button>
          </div>
        </header>

        {/* Global Toolbar (Visible when block is focused) */}
        {focusedBlockId && !isFocusMode && (
          <div className="sticky top-16 z-30 animate-fade-in-up">
            {/* We'll pass the active block's editor instance if needed, but for now we keep it simple */}
          </div>
        )}

        <main className="flex-grow overflow-auto custom-scrollbar scroll-smooth bg-[#fafafa]">
          <div className={`mx-auto py-20 px-8 transition-all duration-700 ${isFocusMode ? 'max-w-2xl' : (isSplitView ? 'max-w-6xl' : 'max-w-3xl')}`}>
            {/* Title Section */}
            <div className={`mb-12 space-y-4 ${isSplitView ? 'grid grid-cols-2 gap-12' : ''}`}>
              {(!isSplitView || activeLang === 'en') && (
                <textarea 
                  placeholder="The perfect title..."
                  value={metadata.title.en}
                  onChange={(e) => setMetadata({ ...metadata, title: { ...metadata.title, en: e.target.value } })}
                  className="w-full bg-transparent border-none focus:ring-0 text-5xl font-extrabold p-0 placeholder:text-gray-200 resize-none overflow-hidden font-heading-en"
                  rows={1}
                />
              )}
              {(!isSplitView || activeLang === 'ar') && (
                <textarea 
                  placeholder="العنوان المثالي..."
                  value={metadata.title.ar}
                  onChange={(e) => setMetadata({ ...metadata, title: { ...metadata.title, ar: e.target.value } })}
                  className="w-full bg-transparent border-none focus:ring-0 text-5xl font-extrabold p-0 placeholder:text-gray-200 resize-none overflow-hidden text-right font-heading-ar"
                  rows={1}
                />
              )}
            </div>

            {/* Block Reorder List */}
            <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="space-y-4">
              {blocks.map((block) => (
                <BlockItem 
                  key={block.id}
                  block={block}
                  activeLang={activeLang}
                  isSplitView={isSplitView}
                  isFocused={focusedBlockId === block.id}
                  onFocus={() => setFocusedBlockId(block.id)}
                  onUpdate={(content) => updateBlock(block.id, content)}
                  onDelete={() => deleteBlock(block.id)}
                  onBackspaceEmpty={() => deleteBlock(block.id, true)}
                  onEnterAtEnd={() => addBlock('paragraph', block.id)}
                  onDuplicate={() => {
                    const index = blocks.findIndex(b => b.id === block.id);
                    const newBlock = { ...block, id: uuidv4() };
                    const newBlocks = [...blocks];
                    newBlocks.splice(index + 1, 0, newBlock);
                    setBlocks(newBlocks);
                  }}
                  onMoveFocus={(dir) => moveFocus(block.id, dir)}
                  onSlash={(rect) => setSlashMenuPos({ x: rect.left, y: rect.bottom + window.scrollY, blockId: block.id })}
                />
              ))}
            </Reorder.Group>

            <div className="mt-12 flex justify-center py-10">
              <button 
                onClick={() => addBlock('paragraph')}
                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:border-brand-green hover:text-brand-green transition-all shadow-sm"
              >
                <Plus size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">New Block</span>
              </button>
            </div>
          </div>
        </main>

        {/* Floating Status Bar */}
        {!isFocusMode && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-gray-100 shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-8 z-20">
            <div className="flex items-center gap-2 text-gray-500">
              <BarChart3 size={16} className="text-brand-green" />
              <span className="text-xs font-bold uppercase tracking-widest">{stats.words} words</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={16} className="text-brand-gold" />
              <span className="text-xs font-bold uppercase tracking-widest">{stats.readingTime} min read</span>
            </div>
            <div className="w-px h-4 bg-gray-100" />
            <button className="flex items-center gap-2 text-gray-400 hover:text-brand-green transition-colors">
              <History size={16} />
              <span className="text-[10px] font-bold">History</span>
            </button>
          </div>
        )}
      </div>

      {/* Improved Sidebars */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside 
            initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-[380px] bg-white border-l border-gray-100 z-50 shadow-2xl"
          >
            <BlogEditorSidebar 
              metadata={metadata} 
              setMetadata={setMetadata} 
              onClose={() => setShowSidebar(false)} 
              readingTime={stats.readingTime}
            />
          </motion.aside>
        )}
        {showPreview && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-5xl h-full rounded-3xl overflow-hidden relative shadow-2xl"
            >
              <PreviewPanel blocks={blocks} metadata={metadata} onClose={() => setShowPreview(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Popups */}
      <AnimatePresence>
        {slashMenuPos && (
          <SlashMenu 
            x={slashMenuPos.x} y={slashMenuPos.y} 
            onSelect={(type) => addBlock(type, slashMenuPos.blockId)} 
            onClose={() => setSlashMenuPos(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
