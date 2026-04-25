import React, { useState } from 'react';
import { PostMetadata } from './types';
import ClassicEditor from './ClassicEditor';
import SEOPanel from './SEOPanel';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Globe, Settings, Image as ImageIcon, Search } from 'lucide-react';
import MediaSelectorModal from '../MediaSelectorModal';

interface ClassicBlogEditorUIProps {
  initialContent: { en: string; ar: string };
  initialMetadata: PostMetadata;
  onSave: (content: { en: string; ar: string }, metadata: PostMetadata) => void;
}

export default function ClassicBlogEditorUI({ initialContent, initialMetadata, onSave }: ClassicBlogEditorUIProps) {
  const [content, setContent] = useState(initialContent);
  const [metadata, setMetadata] = useState<PostMetadata>(initialMetadata);
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');
  const [showSEO, setShowSEO] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      <div className={`flex flex-col flex-grow transition-all duration-500 ${showSEO ? 'mr-[400px]' : ''}`}>
        
        {/* Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alraheeq Blog</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-xl mr-4 shadow-inner">
              <button onClick={() => setActiveLang('en')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLang === 'en' ? 'bg-white shadow-sm text-brand-green' : 'text-gray-400 hover:text-gray-600'}`}>ENGLISH</button>
              <button onClick={() => setActiveLang('ar')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLang === 'ar' ? 'bg-white shadow-sm text-brand-green' : 'text-gray-400 hover:text-gray-600'}`}>العربية</button>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setShowSEO(!showSEO)} className={`gap-2 rounded-xl ${showSEO ? 'bg-gray-100 text-brand-green' : 'text-gray-600'}`}>
              <Settings size={18} /> SEO Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onSave(content, { ...metadata, status: 'draft' })} className="gap-2 rounded-xl text-gray-600">
              Save Draft
            </Button>
            <Button onClick={() => onSave(content, { ...metadata, status: 'published' })} className="bg-brand-green hover:bg-brand-green-dark text-white gap-2 px-6 rounded-xl font-bold shadow-lg shadow-brand-green/20">
              <Globe size={18} /> Publish
            </Button>
          </div>
        </header>

        {/* Main Editor Area */}
        <main className="flex-grow overflow-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Title & Featured Image */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {activeLang === 'en' ? 'Post Title' : 'عنوان المقال'}
                </label>
                <input 
                  type="text"
                  placeholder={activeLang === 'en' ? "The perfect title..." : "العنوان المثالي..."}
                  value={metadata.title[activeLang]}
                  onChange={(e) => setMetadata({ ...metadata, title: { ...metadata.title, [activeLang]: e.target.value } })}
                  className={`w-full bg-transparent border-none focus:ring-0 text-4xl font-extrabold p-0 placeholder:text-gray-200 ${activeLang === 'ar' ? 'text-right font-heading-ar' : 'font-heading-en'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ImageIcon size={14} /> Featured Image
                </label>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => setShowMediaModal(true)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed rounded-xl px-4 py-8 text-sm outline-none transition-all flex flex-col items-center justify-center gap-2 text-gray-500 font-bold"
                  >
                    <ImageIcon size={24} className="text-gray-400" />
                    Select from Media Library
                  </button>
                </div>
                {metadata.image_url && (
                  <div className="mt-4 relative group rounded-2xl overflow-hidden border border-gray-200 max-w-sm">
                    <img src={metadata.image_url} alt="Featured" className="w-full h-auto object-cover" />
                    <button 
                      onClick={() => setMetadata({ ...metadata, image_url: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Classic Editor */}
            <div className={`transition-all ${activeLang === 'ar' ? 'text-right' : 'text-left'}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                {activeLang === 'en' ? 'Article Content' : 'محتوى المقال'}
              </label>
              {/* Ensure we only render one editor per language, or key it to force remount if needed, but managing state is better */}
              <div key={activeLang}>
                <ClassicEditor 
                  content={content[activeLang]} 
                  onChange={(html) => setContent({ ...content, [activeLang]: html })}
                  placeholder={activeLang === 'en' ? "Write your amazing article here..." : "اكتب مقالك الرائع هنا..."}
                />
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* SEO Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-white border-l border-gray-100 shadow-2xl transition-transform duration-500 z-40 ${showSEO ? 'translate-x-0' : 'translate-x-full'}`}>
        <SEOPanel metadata={metadata} setMetadata={setMetadata} onClose={() => setShowSEO(false)} />
      </div>

      <MediaSelectorModal 
        isOpen={showMediaModal} 
        onClose={() => setShowMediaModal(false)} 
        onSelect={(url) => {
          setMetadata({ ...metadata, image_url: url });
        }} 
      />
    </div>
  );
}
