
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Command, Zap, Eye, Save, Settings, Maximize2, FileText, Layout, Trash2, Languages, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
  onAction: (action: string) => void;
}

const ACTIONS = [
  { id: 'focus', label: 'Enter Focus Mode', icon: Maximize2, shortcut: '⌘ F', desc: 'Hide distractions and write' },
  { id: 'preview', label: 'Open Live Preview', icon: Eye, shortcut: '⌘ P', desc: 'See how it looks for users' },
  { id: 'seo', label: 'SEO Settings', icon: Search, shortcut: '⌘ S', desc: 'Optimize for search engines' },
  { id: 'save', label: 'Publish Changes', icon: Save, shortcut: '⌘ Enter', desc: 'Make your post live' },
  { id: 'tpl-seo', label: 'Template: SEO Article', icon: FileText, desc: 'Insert SEO optimized structure' },
  { id: 'tpl-product', label: 'Template: Product Blog', icon: Layout, desc: 'Insert product showcase structure' },
];

export default function CommandPalette({ onClose, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredActions = ACTIONS.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleLocalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
           onAction(filteredActions[selectedIndex].id);
           onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleLocalKeyDown);
    return () => window.removeEventListener('keydown', handleLocalKeyDown);
  }, [selectedIndex, filteredActions, onAction, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-50">
          <Search size={24} className="text-gray-300" />
          <input 
            ref={inputRef}
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            className="flex-grow bg-transparent border-none focus:ring-0 text-xl placeholder:text-gray-200 outline-none"
          />
          <div className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 border border-gray-100 uppercase tracking-widest">ESC</div>
        </div>

        <div className="max-h-[60vh] overflow-auto p-2 custom-scrollbar">
          {filteredActions.length > 0 ? (
            filteredActions.map((action, index) => (
              <button
                key={action.id}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => { onAction(action.id); onClose(); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-left ${selectedIndex === index ? 'bg-brand-green text-white shadow-xl shadow-brand-green/20' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedIndex === index ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>
                  <action.icon size={20} />
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-bold">{action.label}</div>
                  <div className={`text-[10px] ${selectedIndex === index ? 'text-white/70' : 'text-gray-400'}`}>{action.desc}</div>
                </div>
                {action.shortcut && (
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${selectedIndex === index ? 'border-white/20 text-white' : 'border-gray-100 text-gray-400'}`}>
                    {action.shortcut}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400">
              <Zap size={48} className="mx-auto mb-4 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest">No commands found</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ArrowRight size={10} className="rotate-90" /> Navigate</span>
            <span className="flex items-center gap-1"><ArrowRight size={10} className="rotate-[-90deg]" /> Select</span>
          </div>
          <div className="flex items-center gap-2">
            <Command size={12} /> ALRAHEEQ COMMAND CENTER
          </div>
        </div>
      </motion.div>
    </div>
  );
}
