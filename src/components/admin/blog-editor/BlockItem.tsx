import React, { useEffect, useRef, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { EditorBlock, BlockType } from './types';
import { 
  GripVertical, Trash2, Copy, Plus, Bold, Italic, 
  Link as LinkIcon, Type, Highlighter, Heading1, 
  Heading2, Heading3, Quote, Image as ImageIcon, 
  Camera, Youtube as YoutubeIcon, Code, Table as TableIcon,
  MessageSquarePlus, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const lowlight = createLowlight(common);

interface BlockItemProps {
  block: EditorBlock;
  activeLang: 'en' | 'ar';
  isSplitView?: boolean;
  isFocused: boolean;
  onFocus: () => void;
  onUpdate: (content: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBackspaceEmpty: () => void;
  onEnterAtEnd: () => void;
  onMoveFocus: (dir: 'up' | 'down') => void;
  onSlash: (rect: DOMRect) => void;
}

export default function BlockItem({ 
  block, activeLang, isSplitView = false, isFocused, onFocus, 
  onUpdate, onDelete, onDuplicate, onBackspaceEmpty, onEnterAtEnd, 
  onMoveFocus, onSlash 
}: BlockItemProps) {
  const dragControls = useDragControls();
  const [isHovered, setIsHovered] = useState(false);
  
  const extensions = [
    StarterKit.configure({ 
      heading: false,
      codeBlock: false,
    }),
    Underline,
    Highlight.configure({ multicolor: true }),
    Link.configure({ openOnClick: false }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle,
    Color,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Youtube.configure({ width: 640, height: 480 }),
    CodeBlockLowlight.configure({ lowlight }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') return 'Heading...';
        return activeLang === 'en' ? "Start writing or type '/'..." : "ابدأ الكتابة أو اكتب '/'...";
      },
    }),
  ];

  const editorEn = useEditor({
    extensions,
    content: block.content.en,
    onUpdate: ({ editor }) => onUpdate({ en: editor.getHTML() }),
    onFocus: () => onFocus(),
  });

  const editorAr = useEditor({
    extensions,
    content: block.content.ar,
    onUpdate: ({ editor }) => onUpdate({ ar: editor.getHTML() }),
    onFocus: () => onFocus(),
  });

  // Focus effect
  useEffect(() => {
    if (isFocused) {
      if (activeLang === 'en' && editorEn && !editorEn.isFocused) editorEn.commands.focus();
      if (activeLang === 'ar' && editorAr && !editorAr.isFocused) editorAr.commands.focus();
    }
  }, [isFocused, activeLang, editorEn, editorAr]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => onUpdate({ url: ev.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  const renderTiptapEditor = (editor: any, lang: 'en' | 'ar') => {
    if (!editor) return null;
    return (
      <div className={`relative w-full ${lang === 'ar' ? 'text-right dir-rtl font-body-ar' : 'font-body-en'}`}>
        <EditorContent 
          editor={editor} 
          className={`prose max-w-none prose-slate focus:outline-none transition-all duration-300
            ${block.type === 'heading1' ? 'text-4xl font-extrabold tracking-tight mb-4' : ''}
            ${block.type === 'heading2' ? 'text-3xl font-bold tracking-tight mb-3' : ''}
            ${block.type === 'heading3' ? 'text-2xl font-bold mb-2' : ''}
            ${block.type === 'quote' ? 'border-l-4 border-brand-green pl-8 italic text-2xl text-gray-500 bg-gray-50/50 py-8 rounded-r-3xl my-8' : ''}
            ${lang === 'ar' ? 'prose-headings:font-heading-ar' : ''}
          `} 
        />
      </div>
    );
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'divider':
        return <hr className="my-8 border-gray-100" />;
      case 'image':
        return (
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className={`group/img relative bg-gray-50 rounded-3xl overflow-hidden border-2 border-dashed transition-all duration-500 ${block.content.url ? 'border-transparent p-0' : 'border-gray-200 p-12 hover:border-brand-green/40 hover:bg-brand-green/5'}`}
          >
            {block.content.url ? (
              <div className="space-y-4">
                <img src={block.content.url} alt="" className="w-full max-h-[700px] object-contain rounded-2xl shadow-2xl transition-transform duration-700 group-hover/img:scale-[1.01]" />
                <div className="px-8 pb-4">
                  <input 
                    placeholder={activeLang === 'en' ? "Write a caption..." : "اكتب وصفاً للصورة..."}
                    value={block.content.caption?.[activeLang] || ''}
                    onChange={(e) => onUpdate({ caption: { ...block.content.caption, [activeLang]: e.target.value } })}
                    className={`w-full bg-transparent border-none focus:ring-0 text-sm text-gray-400 text-center italic ${activeLang === 'ar' ? 'font-body-ar' : 'font-body-en'}`}
                  />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover/img:opacity-100 transition-opacity flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onUpdate({ url: '' })} className="bg-white/90 backdrop-blur-md rounded-2xl text-red-500 hover:bg-red-50 shadow-xl"><Trash2 size={18} /></Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-brand-green mb-6 group-hover/img:scale-110 transition-transform duration-500">
                  <Camera size={32} strokeWidth={1.5} />
                </div>
                <h4 className="text-gray-900 font-bold mb-1">Upload an image</h4>
                <p className="text-xs mb-6">Drag and drop or paste a URL below</p>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..." 
                  className="bg-white px-6 py-3 rounded-2xl border border-gray-100 text-sm w-80 shadow-inner focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && onUpdate({ url: (e.target as HTMLInputElement).value })}
                />
              </div>
            )}
          </div>
        );
      case 'callout':
        return (
          <div className="bg-brand-green/5 border border-brand-green/10 rounded-2xl p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
              <MessageSquarePlus size={20} />
            </div>
            <div className="flex-grow">
              {isSplitView ? (
                <div className="space-y-4">
                  {renderTiptapEditor(editorEn, 'en')}
                  <div className="h-px bg-brand-green/10" />
                  {renderTiptapEditor(editorAr, 'ar')}
                </div>
              ) : (
                renderTiptapEditor(activeLang === 'en' ? editorEn : editorAr, activeLang)
              )}
            </div>
          </div>
        );
      case 'embed':
        return (
          <div className="aspect-video bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center group/embed relative">
            {block.content.url ? (
              <iframe src={block.content.url} className="w-full h-full" allowFullScreen />
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-400">
                <YoutubeIcon size={48} strokeWidth={1} />
                <input 
                  type="url" 
                  placeholder="Paste YouTube/Vimeo URL..." 
                  className="bg-white px-6 py-3 rounded-2xl border border-gray-100 text-sm w-80"
                  onKeyDown={(e) => e.key === 'Enter' && onUpdate({ url: (e.target as HTMLInputElement).value })}
                />
              </div>
            )}
            {block.content.url && (
              <button onClick={() => onUpdate({ url: '' })} className="absolute top-4 right-4 opacity-0 group-hover/embed:opacity-100 bg-white p-2 rounded-xl text-red-500 shadow-xl transition-opacity">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        );
      default:
        return (
          <div className="w-full">
            {isSplitView ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-gray-50/30 rounded-3xl border border-gray-100/50">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-[10px] uppercase opacity-50">English</Badge>
                  {renderTiptapEditor(editorEn, 'en')}
                </div>
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                  <Badge variant="outline" className="text-[10px] uppercase opacity-50">العربية</Badge>
                  {renderTiptapEditor(editorAr, 'ar')}
                </div>
              </div>
            ) : (
              renderTiptapEditor(activeLang === 'en' ? editorEn : editorAr, activeLang)
            )}
          </div>
        );
    }
  };

  return (
    <Reorder.Item 
      value={block} id={block.id} dragListener={false} dragControls={dragControls}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative transition-all duration-500 py-2 ${isFocused ? 'z-10' : 'z-0'}`}
    >
      {/* Drag Handle & Controls */}
      <div className={`absolute -left-12 top-4 flex flex-col items-center gap-1 transition-all duration-300 ${isHovered || isFocused ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
        <div onPointerDown={(e) => dragControls.start(e)} className="p-1.5 text-gray-300 hover:text-brand-green cursor-grab active:cursor-grabbing rounded-lg hover:bg-green-50 transition-colors">
          <GripVertical size={20} />
        </div>
        <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-0.5 flex flex-col gap-0.5">
          <button onClick={onDuplicate} title="Duplicate" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"><Copy size={14} /></button>
          <button onClick={onDelete} title="Delete" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-md"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className={`min-h-[1.5em] rounded-2xl transition-all duration-300 ${isFocused ? 'ring-2 ring-brand-green/5 bg-brand-green/[0.01]' : ''}`}>
        {renderBlockContent()}
      </div>
    </Reorder.Item>
  );
}

import { Badge } from '@/components/ui/badge';
