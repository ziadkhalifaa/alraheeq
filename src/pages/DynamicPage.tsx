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
    return (
      <EditableSection sectionId={id} className={`relative py-28 overflow-hidden ${settings?.bg === 'gradient' ? 'bg-brand-gradient' : settings?.bg === 'green' ? 'bg-brand-green' : 'bg-white'}`}>
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <SectionBadge className="mb-4">
            <EditableText contentKey={`${id}.badge`} defaultAr="عنوان الصفحة" defaultEn="Page Label" />
          </SectionBadge>
          <h1 className={`text-5xl lg:text-6xl font-bold ${settings?.bg === 'white' ? 'text-gray-900' : 'text-white'} mt-4 mb-6 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText contentKey={`${id}.title`} defaultAr="عنوان رئيسي جديد" defaultEn="New Page Title" />
          </h1>
          <p className={`${settings?.bg === 'white' ? 'text-gray-500' : 'text-white/80'} text-lg max-w-2xl mx-auto leading-relaxed`}>
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
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
            <EditableText contentKey={`${id}.body`} defaultAr="اكتب محتوى الفقرة هنا." defaultEn="Write paragraph content here." />
          </div>
        </div>
      </EditableSection>
    );
  },
  'cta': ({ id, settings }) => {
    const { isRTL } = useLanguage();
    return (
      <EditableSection sectionId={id} className="py-20 bg-brand-gold text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className={`text-4xl font-bold mb-6 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText contentKey={`${id}.title`} defaultAr="جاهز للبدء؟" defaultEn="Ready to start?" />
          </h2>
          <Button className="bg-white text-brand-gold hover:bg-gray-100 px-8 py-4 rounded-xl font-bold">
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
    <main className="pt-20">
      {sections.length > 0 ? (
        sections.map((section: any) => {
          const Template = SectionTemplates[section.type] || SectionTemplates['content-text'];
          return <Template key={section.id} id={section.id} settings={section.settings} />;
        })
      ) : (
        /* Legacy fallback for existing pages */
        <>
          <EditableSection sectionId={`${slug}-hero`} className="relative py-28 bg-brand-gradient overflow-hidden">
            <div className="relative max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-5xl font-bold text-white mb-6">
                <EditableText contentKey={`page.${slug}.hero.title`} defaultAr="عنوان الصفحة" defaultEn="Page Title" />
              </h1>
            </div>
          </EditableSection>
          <EditableSection sectionId={`${slug}-content`} className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <EditableText contentKey={`page.${slug}.content.1`} defaultAr="محتوى الصفحة..." defaultEn="Page content..." />
            </div>
          </EditableSection>
        </>
      )}
    </main>
  );
}

import { Button } from '@/components/ui/button';
