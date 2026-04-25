
import React, { useMemo } from 'react';
import { PostMetadata, EditorBlock } from './types';
import { X, Search, Globe, Clock, Link as LinkIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SEOPanelProps {
  metadata: PostMetadata;
  setMetadata: (metadata: PostMetadata) => void;
  onClose: () => void;
}

export default function SEOPanel({ metadata, setMetadata, onClose }: SEOPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Search size={18} className="text-brand-green" /> Search Engine Optimization</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
      </div>

      <div className="flex-grow overflow-auto p-8 space-y-10 custom-scrollbar">
        {/* Google Preview */}
        <div className="space-y-3">
          <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">Google Preview</label>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <div className="text-blue-700 text-lg hover:underline cursor-pointer font-medium truncate">
              {metadata.metaTitle.en || metadata.title.en || 'Untitled Post'}
            </div>
            <div className="text-green-700 text-sm truncate flex items-center gap-1">
              alraheeq.com <span className="text-gray-400">› blog ›</span> {metadata.slug || 'slug'}
            </div>
            <div className="text-gray-500 text-sm line-clamp-2">
              {metadata.metaDescription.en || metadata.excerpt.en || 'No description provided. Add one below to improve search visibility.'}
            </div>
          </div>
        </div>

        {/* Slug Control */}
        <div className="space-y-3">
          <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={14} /> URL Slug</label>
          <input 
            value={metadata.slug} 
            onChange={(e) => setMetadata({ ...metadata, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green/20 outline-none text-sm font-mono"
            placeholder="e.g. benefits-of-hibiscus"
          />
        </div>

        {/* Multilingual SEO */}
        <div className="space-y-8">
          {['en', 'ar'].map((lang) => (
            <div key={lang} className={`space-y-6 ${lang === 'ar' ? 'text-right' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-2 text-brand-green font-bold">
                <Globe size={16} /> {lang === 'en' ? 'English SEO' : 'السيو العربي'}
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">{lang === 'en' ? 'Meta Title' : 'عنوان الميتا'}</label>
                <input 
                  value={metadata.metaTitle[lang as 'en'|'ar']} 
                  onChange={(e) => setMetadata({ ...metadata, metaTitle: { ...metadata.metaTitle, [lang]: e.target.value } })}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green/20 outline-none text-sm"
                  maxLength={60}
                />
                <div className="flex justify-between px-1">
                  <span className="text-[10px] text-gray-400">Optimized for Google</span>
                  <span className={`text-[10px] font-bold ${metadata.metaTitle[lang as 'en'|'ar'].length > 50 ? 'text-amber-500' : 'text-gray-300'}`}>
                    {metadata.metaTitle[lang as 'en'|'ar'].length}/60
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">{lang === 'en' ? 'Meta Description' : 'وصف الميتا'}</label>
                <textarea 
                  value={metadata.metaDescription[lang as 'en'|'ar']} 
                  onChange={(e) => setMetadata({ ...metadata, metaDescription: { ...metadata.metaDescription, [lang]: e.target.value } })}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green/20 outline-none text-sm resize-none h-24"
                  maxLength={160}
                />
                <div className="flex justify-between px-1">
                  <span className="text-[10px] text-gray-400">Best for clicks</span>
                  <span className={`text-[10px] font-bold ${metadata.metaDescription[lang as 'en'|'ar'].length > 140 ? 'text-amber-500' : 'text-gray-300'}`}>
                    {metadata.metaDescription[lang as 'en'|'ar'].length}/160
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-gray-50 bg-gray-50/50">
        <Button onClick={onClose} className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 rounded-xl font-bold">Close SEO Panel</Button>
      </div>
    </div>
  );
}
