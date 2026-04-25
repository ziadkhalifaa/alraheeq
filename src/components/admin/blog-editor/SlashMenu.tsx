
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Type, Image as ImageIcon, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus, Square, MousePointer2, FileText, Layout } from 'lucide-react';
import { BlockType } from './types';

interface SlashMenuProps {
  x: number;
  y: number;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

const ITEMS: { type: BlockType; label: string; icon: any; desc: string; category?: string }[] = [
  { category: 'Basic', type: 'paragraph', label: 'Text', icon: Type, desc: 'Start writing with plain text' },
  { category: 'Basic', type: 'heading1', label: 'Heading 1', icon: Heading1, desc: 'Large section heading' },
  { category: 'Basic', type: 'heading2', label: 'Heading 2', icon: Heading2, desc: 'Medium section heading' },
  { category: 'Basic', type: 'heading3', label: 'Heading 3', icon: Heading3, desc: 'Small section heading' },
  { category: 'Media', type: 'image', label: 'Image', icon: ImageIcon, desc: 'Upload or embed an image' },
  { category: 'Basic', type: 'bulletList', label: 'Bulleted List', icon: List, desc: 'Create a simple bulleted list' },
  { category: 'Basic', type: 'orderedList', label: 'Numbered List', icon: ListOrdered, desc: 'Create a numbered list' },
  { category: 'Basic', type: 'quote', label: 'Quote', icon: Quote, desc: 'Capture a quote' },
  { category: 'Basic', type: 'divider', label: 'Divider', icon: Minus, desc: 'Visually divide sections' },
  { category: 'Advanced', type: 'callout', label: 'Callout', icon: Square, desc: 'Make writing stand out' },
  { category: 'Advanced', type: 'button', label: 'Button', icon: MousePointer2, desc: 'Add a call to action button' },
];

const TEMPLATES = [
  { label: 'SEO Article Template', icon: FileText, blocks: [
    { type: 'heading1', content: { en: 'Primary Keyword Title', ar: 'العنوان الرئيسي' } },
    { type: 'paragraph', content: { en: 'Introduction goes here...', ar: 'المقدمة هنا...' } },
    { type: 'heading2', content: { en: 'Supporting Topic', ar: 'موضوع فرعي' } },
    { type: 'paragraph', content: { en: 'Details...', ar: 'التفاصيل...' } },
  ]},
  { label: 'Product Article Template', icon: Layout, blocks: [
    { type: 'heading1', content: { en: 'Product Name', ar: 'اسم المنتج' } },
    { type: 'image', content: { en: '', ar: '' } },
    { type: 'heading2', content: { en: 'Benefits', ar: 'المميزات' } },
    { type: 'bulletList', content: { en: 'Benefit 1', ar: 'ميزة 1' } },
    { type: 'button', content: { en: 'Buy Now', ar: 'اشتري الآن' } },
  ]}
];

export default function SlashMenu({ x, y, onSelect, onClose }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % ITEMS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + ITEMS.length) % ITEMS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(ITEMS[selectedIndex].type);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedIndex, onSelect, onClose]);

  return (
    <motion.div 
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="fixed z-50 bg-white border border-gray-100 shadow-2xl rounded-2xl w-72 overflow-hidden py-2"
      style={{ left: x, top: y }}
    >
      <div className="px-4 py-2 text-[10px] font-extrabold text-gray-300 uppercase tracking-widest border-b border-gray-50 mb-2">
        Insert Block
      </div>
      <div className="max-h-96 overflow-auto custom-scrollbar">
        {ITEMS.map((item, index) => (
          <button
            key={item.type}
            onClick={() => onSelect(item.type)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`w-full flex items-center gap-4 px-4 py-2.5 transition-all text-left ${selectedIndex === index ? 'bg-brand-green/5 text-brand-green' : 'text-gray-600'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedIndex === index ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400'}`}>
              <item.icon size={20} />
            </div>
            <div>
              <div className="text-sm font-bold">{item.label}</div>
              <div className="text-[10px] text-gray-400 line-clamp-1">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="px-4 py-2 text-[10px] font-extrabold text-gray-300 uppercase tracking-widest border-t border-gray-50 mt-2 mb-2">
        Templates
      </div>
      <div className="px-2">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.label}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand-green transition-all text-left"
          >
            <tpl.icon size={16} className="text-gray-400" />
            <span className="text-xs font-bold">{tpl.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
