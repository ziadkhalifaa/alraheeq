import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useEditor } from '@/editor/EditorContext';
import { EditableText } from '@/editor/EditableText';
import { EditableSection } from '@/editor/EditableSection';
import SectionBadge from '@/components/features/SectionBadge';
import { useQuery } from '@tanstack/react-query';
import { pageApi } from '@/api/api';
import NotFound from './NotFound';

// Section Templates Mapping
const SectionTemplates: Record<string, React.FC<{ id: string, settings: any }>> = {
  'hero': ({ id, settings }) => {
    const { isRTL } = useLanguage();
    // Default to white background if not specified
    const bgColor = settings?.bg || 'white';
    const isDarkBg = bgColor === 'gradient' || bgColor === 'green';

    return (
      <EditableSection sectionId={id} className={`relative py-28 overflow-hidden ${bgColor === 'gradient' ? 'bg-brand-gradient' : bgColor === 'green' ? 'bg-brand-green' : 'bg-white border-b border-gray-100'}`}>
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <SectionBadge className="mb-4">
            <EditableText contentKey={`${id}.badge`} defaultAr="عنوان الصفحة" defaultEn="Page Label" />
          </SectionBadge>
          <h1 className={`text-5xl lg:text-7xl font-bold ${isDarkBg ? 'text-white' : 'text-gray-900'} mt-4 mb-6 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText contentKey={`${id}.title`} defaultAr="عنوان رئيسي جديد" defaultEn="New Page Title" />
          </h1>
          <p className={`${isDarkBg ? 'text-white/80' : 'text-gray-500'} text-xl max-w-2xl mx-auto leading-relaxed font-medium`}>
            <EditableText contentKey={`${id}.subtitle`} defaultAr="هذه صفحة ديناميكية جديدة." defaultEn="This is a new dynamic page." />
          </p>
        </div>
      </EditableSection>
    );
  },
  'content-text': ({ id, settings }) => {
    return (
      <EditableSection sectionId={id} className={`py-20 ${settings?.bg === 'gray' ? 'bg-gray-50' : 'bg-white'}`}>
        <div className={`max-w-4xl mx-auto px-4 ${settings?.centerText ? 'text-center' : ''}`}>
          <div className="prose prose-xl max-w-none text-gray-600 leading-relaxed font-medium">
            <EditableText contentKey={`${id}.body`} defaultAr="اكتب محتوى الفقرة هنا. يمكنك إضافة نصوص طويلة وتعديلها بسهولة." defaultEn="Write paragraph content here. You can add long text and edit it easily." />
          </div>
        </div>
      </EditableSection>
    );
  },
  'cta': ({ id, settings }) => {
    const { isRTL } = useLanguage();
    return (
      <EditableSection sectionId={id} className="py-24 bg-[#1c4b42] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-10 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText contentKey={`${id}.title`} defaultAr="جاهز للبدء؟ اطلب عرض سعر الآن" defaultEn="Ready to start? Get a quote now" />
          </h2>
          <Button className="bg-[#b4e717] text-[#1c4b42] hover:bg-white px-12 py-6 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-black/20">
            <EditableText contentKey={`${id}.button`} defaultAr="تواصل معنا" defaultEn="Contact Us" />
          </Button>
        </div>
      </EditableSection>
    );
  }
};

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { pageContent } = useEditor();
  const sections = pageContent.sections || [];

  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: () => pageApi.getAll().then(res => res.data),
  });

  if (isLoading) return <div className="pt-20 flex justify-center"><div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" /></div>;

  const pageExists = pages?.some((p: any) => p.slug === slug);
  if (!pageExists) return <NotFound />;

  return (
    <main className="pt-20 bg-white min-h-screen">
      {sections.length > 0 ? (
        sections.map((section: any) => {
          const Template = SectionTemplates[section.type] || SectionTemplates['content-text'];
          return <Template key={section.id} id={section.id} settings={section.settings} />;
        })
      ) : (
        /* Enhanced fallback for new pages */
        <div className="bg-white">
          <EditableSection sectionId={`${slug}-hero`} className="relative py-32 bg-gray-50 overflow-hidden border-b border-gray-100">
            <div className="absolute inset-0 pattern-dots opacity-5" />
            <div className="relative max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-6xl lg:text-8xl font-bold text-gray-900 mb-8 tracking-tight">
                <EditableText contentKey={`page.${slug}.hero.title`} defaultAr="عنوان الصفحة" defaultEn="Page Title" />
              </h1>
              <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                <EditableText contentKey={`page.${slug}.hero.desc`} defaultAr="ابدأ بكتابة وصف مختصر للصفحة هنا." defaultEn="Start writing a short description for the page here." />
              </p>
            </div>
          </EditableSection>
          <EditableSection sectionId={`${slug}-content`} className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 prose prose-2xl prose-gray">
              <EditableText contentKey={`page.${slug}.content.1`} defaultAr="محتوى الصفحة يبدأ من هنا. يمكنك كتابة نصوص طويلة وتنسيقها..." defaultEn="Page content starts here. You can write long text and format it..." />
            </div>
          </EditableSection>
        </div>
      )}
    </main>
  );
}

import { Button } from '@/components/ui/button';
