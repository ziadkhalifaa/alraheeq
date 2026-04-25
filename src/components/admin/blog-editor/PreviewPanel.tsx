
import React, { useMemo } from 'react';
import { EditorBlock, PostMetadata } from './types';
import { X, Clock, Calendar, User, Share2 } from 'lucide-react';

interface PreviewPanelProps {
  blocks: EditorBlock[];
  metadata: PostMetadata;
  onClose: () => void;
}

export default function PreviewPanel({ blocks, metadata, onClose }: PreviewPanelProps) {
  const readingTime = useMemo(() => {
    const text = blocks.map(b => b.content.en + ' ' + b.content.ar).join(' ');
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [blocks]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">Live Preview</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
      </div>

      <div className="flex-grow overflow-auto bg-brand-beige/20 custom-scrollbar">
        <div className="max-w-4xl mx-auto bg-white min-h-full shadow-inner p-12 lg:p-20">
          {/* Article Header */}
          <header className="mb-12 space-y-6">
            <div className="flex items-center gap-4 text-[10px] font-bold text-brand-gold uppercase tracking-widest">
              <span className="bg-brand-gold/10 px-3 py-1 rounded-full">New Article</span>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={12} /> {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={12} /> {readingTime} min read
              </div>
            </div>

            <h1 className="text-5xl font-extrabold text-gray-900 font-heading-en leading-tight">
              {metadata.title.en || 'Post Title (English)'}
            </h1>
            <h1 className="text-5xl font-bold text-gray-900 font-heading-ar leading-tight text-right dir-rtl">
              {metadata.title.ar || 'عنوان المقال (العربية)'}
            </h1>

            <div className="flex items-center justify-between pt-8 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">A</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{metadata.author}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Expert Content</div>
                </div>
              </div>
              <button className="p-3 text-gray-400 hover:text-brand-green transition-colors"><Share2 size={20} /></button>
            </div>
          </header>

          {/* Featured Image */}
          {metadata.image_url && (
            <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
              <img src={metadata.image_url} alt="" className="w-full aspect-video object-cover" />
            </div>
          )}

          {/* Content Blocks */}
          <div className="space-y-8">
            {blocks.map((block) => (
              <div key={block.id} className="space-y-4">
                {/* Render English */}
                <div className="prose prose-brand-green max-w-none prose-slate">
                  {renderBlock(block, 'en')}
                </div>
                {/* Render Arabic */}
                <div className="prose prose-brand-green max-w-none prose-slate text-right dir-rtl font-body-ar">
                  {renderBlock(block, 'ar')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderBlock(block: EditorBlock, lang: 'en' | 'ar') {
  const content = block.content[lang];
  if (!content && block.type !== 'divider' && block.type !== 'image') return null;

  switch (block.type) {
    case 'heading1': return <h1 className="text-4xl font-extrabold mb-6" dangerouslySetInnerHTML={{ __html: content }} />;
    case 'heading2': return <h2 className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: content }} />;
    case 'heading3': return <h3 className="text-2xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: content }} />;
    case 'paragraph': return <p className="text-lg leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: content }} />;
    case 'quote': return <blockquote className="border-l-4 border-brand-green pl-8 italic text-2xl text-gray-600 my-12" dangerouslySetInnerHTML={{ __html: content }} />;
    case 'divider': return <hr className="my-16 border-gray-100" />;
    case 'image': 
      if (lang === 'ar') return null; // Only render image once
      return block.content.url ? (
        <div className="my-12 space-y-3">
          <img src={block.content.url} className="w-full rounded-3xl shadow-2xl" />
          {block.content.caption?.[lang] && (
            <p className="text-center text-sm text-gray-400 italic font-medium">
              {block.content.caption[lang]}
            </p>
          )}
        </div>
      ) : null;
    case 'bulletList': return <ul className="list-disc pl-8 space-y-2 text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: content }} />;
    default: return <p dangerouslySetInnerHTML={{ __html: content }} />;
  }
}
