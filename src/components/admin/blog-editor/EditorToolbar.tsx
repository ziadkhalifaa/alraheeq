import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  ChevronDown, Type, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Minus, Image as ImageIcon, Link2, 
  Undo, Redo, Table as TableIcon, Code, Youtube, MessageSquarePlus,
  Grid2X2, PlusCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import MediaSelectorModal from '../MediaSelectorModal';

interface ToolbarProps {
  editor: Editor;
}

const ToolbarButton = ({ onClick, isActive = false, disabled = false, children, title, shortcut }: any) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`p-2 rounded-lg transition-all flex items-center justify-center min-w-[32px] h-8
            ${isActive ? 'bg-brand-green text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
            ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
          `}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-900 text-white border-none shadow-xl">
        <p className="text-xs font-bold">{title}</p>
        {shortcut && <p className="text-[10px] text-gray-400 mt-0.5">{shortcut}</p>}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Divider = () => <div className="w-[1px] h-6 bg-gray-200 mx-1" />;

export default function EditorToolbar({ editor }: ToolbarProps) {
  const [showMediaModal, setShowMediaModal] = useState(false);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm overflow-x-auto custom-scrollbar no-scrollbar">
      {/* Group 1: History */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo" shortcut="Ctrl+Z">
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo" shortcut="Ctrl+Y">
          <Redo size={16} />
        </ToolbarButton>
      </div>

      <Divider />

      {/* Group 2: Headings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-xs font-bold text-gray-600 hover:bg-gray-100">
            {editor.isActive('heading', { level: 1 }) ? 'H1' : 
             editor.isActive('heading', { level: 2 }) ? 'H2' : 
             editor.isActive('heading', { level: 3 }) ? 'H3' : 'Paragraph'}
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-xl shadow-xl border-gray-100 p-1">
          <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()} className="rounded-lg">Paragraph</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="rounded-lg font-bold text-lg">Heading 1</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="rounded-lg font-bold text-base">Heading 2</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="rounded-lg font-bold text-sm">Heading 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* Group 3: Formatting */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold" shortcut="Ctrl+B">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic" shortcut="Ctrl+I">
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline" shortcut="Ctrl+U">
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={16} />
        </ToolbarButton>
      </div>

      <Divider />

      {/* Group 4: Colors */}
      <div className="flex items-center gap-2 px-2">
        <div className="relative group/color" title="Text Color">
          <Type size={16} className="text-gray-400" />
          <input 
            type="color" 
            onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <div className="relative group/color" title="Highlight Color">
          <Highlighter size={16} className="text-gray-400" />
          <input 
            type="color" 
            onInput={event => editor.chain().focus().setHighlight({ color: (event.target as HTMLInputElement).value }).run()}
            value={editor.getAttributes('highlight').color || '#ffff00'}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <Divider />

      {/* Group 5: Alignment */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <AlignRight size={16} />
        </ToolbarButton>
      </div>

      <Divider />

      {/* Group 6: Lists */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered size={16} />
        </ToolbarButton>
      </div>

      <Divider />

      {/* Group 7: Insert */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-xs font-bold text-brand-green hover:bg-green-50">
            <PlusCircle size={16} /> Insert
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-xl shadow-xl border-gray-100 p-1 w-48">
          <DropdownMenuItem onClick={() => setShowMediaModal(true)} className="gap-2 rounded-lg"><ImageIcon size={16} /> Image</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="gap-2 rounded-lg"><TableIcon size={16} /> Table</DropdownMenuItem>
          <DropdownMenuItem onClick={addYoutubeVideo} className="gap-2 rounded-lg"><Youtube size={16} /> Video Embed</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="gap-2 rounded-lg"><Code size={16} /> Code Block</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()} className="gap-2 rounded-lg"><Quote size={16} /> Blockquote</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()} className="gap-2 rounded-lg"><Minus size={16} /> Divider</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* Group 8: Links */}
      <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Insert Link" shortcut="Ctrl+K">
        <Link2 size={16} />
      </ToolbarButton>

      <MediaSelectorModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSelect={(url) => {
          editor.chain().focus().setImage({ src: url }).run();
        }}
      />
    </div>
  );
}
