import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorProvider } from '../../editor/EditorContext';
import { ArrowLeft, Monitor, Smartphone, Globe, Save } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import LayersPanel from './panels/LayersPanel';
import PropertiesPanel from './panels/PropertiesPanel';

// We import the actual page components directly to render them
// DO NOT USE IFRAMES OR FAKE RENDERERS. WE RENDER THE REAL COMPONENT.
import Index from '../../pages/Index';
import About from '../../pages/About';
import Quality from '../../pages/Quality';
import Certificates from '../../pages/Certificates';
import DynamicPage from '../../pages/DynamicPage';

// Map slugs to components
const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  'home': Index,
  'about': About,
  'quality': Quality,
  'certificates': Certificates,
};

export default function LiveEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { i18n } = useLanguage();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Real component based on slug, fallback to DynamicPage
  const PageComponent = slug && PAGE_COMPONENTS[slug] ? PAGE_COMPONENTS[slug] : DynamicPage;

  useEffect(() => {
    // Add special body class when in editor
    document.body.classList.add('editor-active');
    return () => document.body.classList.remove('editor-active');
  }, []);

  if (!slug) return <div>Invalid Page</div>;

  return (
    <EditorProvider slug={slug} isEditing={true}>
      <div className="flex flex-col h-screen bg-gray-100 overflow-hidden" dir="ltr">
        
        {/* Editor Toolbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-50">
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/admin/dashboard?tab=pages')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Back to Pages</span>
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="font-bold text-gray-900 flex items-center gap-2">
              Editing: <span className="text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-md">{slug}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-brand-green' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-brand-green' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            {/* Language Switch */}
            <button
              onClick={() => i18n?.changeLanguage(i18n?.language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <Globe className="w-4 h-4" />
              {i18n?.language === 'en' ? 'Editing: English' : 'Editing: Arabic'}
            </button>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-brand-green bg-brand-green/10 px-3 py-1.5 rounded-lg text-sm font-medium">
              <Save className="w-4 h-4" />
              Auto-saving
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Layers */}
          <LayersPanel />

          {/* Editor Workspace */}
          <main className="flex-1 overflow-auto bg-gray-200 p-4 lg:p-8 flex justify-center custom-scrollbar">
            <div 
              className={`
                bg-white shadow-2xl transition-all duration-300 origin-top
                ${viewMode === 'desktop' ? 'w-full max-w-[1440px] rounded-xl overflow-hidden' : 'w-[375px] h-[812px] rounded-[3rem] border-8 border-gray-900 overflow-hidden scale-90'}
              `}
            >
              <div 
                className="h-full overflow-y-auto overflow-x-hidden editor-canvas" 
                dir={i18n?.language === 'ar' ? 'rtl' : 'ltr'}
              >
                <PageComponent />
              </div>
            </div>
          </main>

          {/* Right Panel: Properties */}
          <PropertiesPanel />
        </div>
      </div>
    </EditorProvider>
  );
}
