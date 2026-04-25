import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import SlashMenu from './SlashMenu';
import EditorToolbar from './EditorToolbar';

interface ClassicEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function ClassicEditor({ content, onChange, placeholder = 'Start typing...', autoFocus = false }: ClassicEditorProps) {
  const [slashMenuPos, setSlashMenuPos] = useState<{ x: number; y: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto shadow-md my-8',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-green underline underline-offset-2',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
      // Simple slash command detection
      const { $head } = editor.state.selection;
      const textBefore = $head.parent.textContent.slice(0, $head.parentOffset);
      
      if (textBefore.endsWith('/')) {
        const coords = editor.view.coordsAtPos($head.pos);
        setSlashMenuPos({ x: coords.left, y: coords.bottom + 10 });
      } else if (slashMenuPos && !textBefore.includes('/')) {
        setSlashMenuPos(null);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] pb-32 px-8 py-8',
      },
      handleKeyDown: (view, event) => {
        if (slashMenuPos) {
          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            // Prevent editor from handling these when menu is open
            return true;
          }
          if (event.key === 'Escape') {
            setSlashMenuPos(null);
            return true;
          }
        }
        return false;
      }
    },
  });

  // Keep content in sync if it changes from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const handleSlashSelect = (type: string) => {
    // Delete the slash
    editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.to }).run();

    if (type.startsWith('heading')) {
      const level = parseInt(type.replace('heading', '')) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).run();
    } else if (type === 'bulletList') {
      editor.chain().focus().toggleBulletList().run();
    } else if (type === 'orderedList') {
      editor.chain().focus().toggleOrderedList().run();
    } else if (type === 'quote') {
      editor.chain().focus().toggleBlockquote().run();
    } else if (type === 'divider') {
      editor.chain().focus().setHorizontalRule().run();
    } else if (type === 'image') {
      const url = window.prompt('Image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
    setSlashMenuPos(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[70vh]">
      <EditorToolbar editor={editor} />
      <div className="flex-grow overflow-y-auto custom-scrollbar relative bg-gray-50/30">
        <EditorContent editor={editor} className="max-w-4xl mx-auto bg-white min-h-full" />
        
        {slashMenuPos && (
          <SlashMenu 
            x={slashMenuPos.x} 
            y={slashMenuPos.y} 
            onSelect={handleSlashSelect} 
            onClose={() => setSlashMenuPos(null)} 
          />
        )}
      </div>
    </div>
  );
}
