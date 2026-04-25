import React, { useState } from 'react';
import { PostMetadata } from './types';
import { 
  X, Search, Globe, Clock, Link as LinkIcon, 
  FileText, User, Layout, Image as ImageIcon,
  CheckCircle2, AlertCircle, TrendingUp, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MediaSelectorModal from '../MediaSelectorModal';

interface BlogSidebarProps {
  metadata: PostMetadata;
  setMetadata: (metadata: PostMetadata) => void;
  onClose: () => void;
  readingTime: number;
}

export default function BlogEditorSidebar({ metadata, setMetadata, onClose, readingTime }: BlogSidebarProps) {
  const [activeTab, setActiveTab] = useState('document');
  const [showMediaModal, setShowMediaModal] = useState(false);

  const updateMetadata = (key: keyof PostMetadata, value: any) => {
    setMetadata({ ...metadata, [key]: value });
  };

  const seoScore = 85; // Mock score

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Post Settings</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
      </div>

      <Tabs defaultValue="document" className="flex flex-col flex-grow">
        <TabsList className="grid grid-cols-3 p-2 bg-gray-50 rounded-none border-b border-gray-100">
          <TabsTrigger value="document" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-brand-green data-[state=active]:shadow-sm rounded-lg py-2">Document</TabsTrigger>
          <TabsTrigger value="seo" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-brand-green data-[state=active]:shadow-sm rounded-lg py-2">SEO</TabsTrigger>
          <TabsTrigger value="media" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-brand-green data-[state=active]:shadow-sm rounded-lg py-2">Featured</TabsTrigger>
        </TabsList>

        <div className="flex-grow overflow-auto custom-scrollbar">
          {/* Document Tab */}
          <TabsContent value="document" className="p-6 space-y-8 m-0">
            <div className="space-y-4">
              <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">Status & Visibility</label>
              <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Status</span>
                  <Badge variant={metadata.status === 'published' ? 'default' : 'secondary'} className={metadata.status === 'published' ? 'bg-brand-green' : ''}>
                    {metadata.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Author</span>
                  <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <User size={14} className="text-brand-gold" /> {metadata.author}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Reading Time</span>
                  <span className="text-gray-900 font-bold">{readingTime} min</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">Post Excerpt</label>
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400">English</span>
                  <textarea 
                    value={metadata.excerpt.en}
                    onChange={(e) => setMetadata({ ...metadata, excerpt: { ...metadata.excerpt, en: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm h-24 focus:ring-2 focus:ring-brand-green/10 outline-none"
                    placeholder="Short summary for social media..."
                  />
                </div>
                <div className="space-y-2 text-right" dir="rtl">
                  <span className="text-[10px] font-bold text-gray-400">العربية</span>
                  <textarea 
                    value={metadata.excerpt.ar}
                    onChange={(e) => setMetadata({ ...metadata, excerpt: { ...metadata.excerpt, ar: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm h-24 focus:ring-2 focus:ring-brand-green/10 outline-none font-body-ar"
                    placeholder="ملخص قصير لوسائل التواصل..."
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="p-6 space-y-8 m-0">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">Search Performance</label>
              <Badge className="bg-green-100 text-green-700 border-none">{seoScore}/100</Badge>
            </div>

            {/* Google Preview */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
              <div className="text-blue-700 text-lg hover:underline cursor-pointer font-medium truncate">
                {metadata.metaTitle.en || metadata.title.en || 'Untitled Post'}
              </div>
              <div className="text-green-700 text-xs truncate flex items-center gap-1">
                alraheeq.com <span className="text-gray-400">› blog ›</span> {metadata.slug || 'slug'}
              </div>
              <div className="text-gray-500 text-xs line-clamp-2">
                {metadata.metaDescription.en || metadata.excerpt.en || 'No description provided...'}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={14} /> URL Slug</label>
              <input 
                value={metadata.slug} 
                onChange={(e) => updateMetadata('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green/10 outline-none text-sm font-mono"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">SEO Checklist</label>
              <div className="space-y-3">
                {[
                  { label: 'Title is within 60 chars', pass: metadata.metaTitle.en.length <= 60 },
                  { label: 'Slug is optimized', pass: !!metadata.slug },
                  { label: 'Has featured image', pass: !!metadata.image_url },
                  { label: 'Meta description exists', pass: !!metadata.metaDescription.en },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {item.pass ? <CheckCircle2 size={14} className="text-brand-green" /> : <AlertCircle size={14} className="text-amber-500" />}
                    <span className={item.pass ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="p-6 space-y-6 m-0">
            <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">Featured Image</label>
            <div 
              onClick={() => setShowMediaModal(true)}
              className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-green/5 hover:border-brand-green/20 transition-all overflow-hidden relative group"
            >
              {metadata.image_url ? (
                <>
                  <img src={metadata.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs font-bold px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-300 mb-2">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-xs text-gray-400">Click to upload</span>
                </>
              )}
            </div>
            {metadata.image_url && (
              <Button variant="outline" size="sm" onClick={() => updateMetadata('image_url', '')} className="w-full rounded-xl text-red-500 hover:text-red-600 border-red-50">
                Remove Image
              </Button>
            )}
          </TabsContent>
        </div>
      </Tabs>

      <div className="p-6 border-t border-gray-50 bg-gray-50/50">
        <Button onClick={onClose} className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 rounded-xl font-bold">Close Settings</Button>
      </div>

      <MediaSelectorModal 
        isOpen={showMediaModal} 
        onClose={() => setShowMediaModal(false)} 
        onSelect={(url) => updateMetadata('image_url', url)} 
      />
    </div>
  );
}
