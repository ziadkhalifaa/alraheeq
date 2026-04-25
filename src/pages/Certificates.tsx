import { useEffect } from 'react';
import { Award, FileCheck, Globe2, ShieldCheck, Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';
import { EditableText } from '@/editor/EditableText';
import { EditableSection } from '@/editor/EditableSection';
import { getSafeValue } from '@/editor/utils';

function useRevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll('.animate-reveal, .animate-reveal-left, .animate-reveal-right, .animate-scale-in');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

import { useQuery } from '@tanstack/react-query';
import { certificateApi } from '@/api/api';

export default function Certificates() {
  const { t, isRTL, getPath } = useLanguage();
  useRevealObserver();

  const { data: certs, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => certificateApi.getAll().then(res => res.data),
  });

  const commitments = [
    // ... (keep static for now or move to separate section)
  ];

  return (
    <main className="pt-20">
      {/* Hero */}
    <section className="relative py-28 overflow-hidden">
      <EditableSection sectionId="certs-hero">
        <div className="absolute inset-0 bg-brand-gradient" />
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="absolute top-12 right-12 opacity-20 animate-float">
          <Leaf className="w-24 h-24 text-brand-gold" />
        </div>
        <div className="absolute bottom-16 left-12 opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>
          <Award className="w-20 h-20 text-white" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
            <EditableText 
              contentKey="certificates.hero.badge"
              defaultAr="شهادات الجودة"
              defaultEn="Quality Certificates"
            />
          </SectionBadge>
          <h1 className={`text-5xl lg:text-6xl font-bold text-white mt-4 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="certificates.hero.title"
              defaultAr="التزامنا"
              defaultEn="Our Commitment"
            />
          </h1>
          <h2 className={`text-3xl font-semibold text-brand-gold ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="certificates.hero.titleAccent"
              defaultAr="بالمعايير الدولية"
              defaultEn="to International Standards"
            />
          </h2>
        </div>
      </EditableSection>
    </section>

      {/* Dynamic Certificates Section */}
    <section className="py-20 bg-white relative">
      <EditableSection sectionId="certs-list">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-reveal text-center mb-16">
            <SectionBadge className="mb-4">
              <EditableText 
                contentKey="certificates.list.badge"
                defaultAr="شهاداتنا المعتمدة"
                defaultEn="Our Certified Standards"
              />
            </SectionBadge>
            <h2 className={`text-4xl font-bold text-gray-900 mt-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText 
                contentKey="certificates.list.title"
                defaultAr="الشهادات والاعتمادات الدولية"
                defaultEn="International Certifications"
              />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
              ))
            ) : certs && certs.length > 0 ? (
              certs.map((cert: any, i: number) => {
                const titleStr = getSafeValue(cert.title, isRTL ? 'ar' : 'en');
                const descStr = getSafeValue(cert.description, isRTL ? 'ar' : 'en');

                return (
                  <div 
                    key={cert.id}
                    className="animate-scale-in group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={cert.image_url} 
                        alt={titleStr}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className={`text-xl font-bold text-gray-900 mb-2 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                        {titleStr}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {descStr}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">
                {isRTL ? 'لا توجد شهادات حالياً' : 'No certificates found'}
              </div>
            )}
          </div>
        </div>
      </EditableSection>
    </section>

      {/* Export Documents (Static but important info) */}
    <section className="py-20 bg-brand-beige relative">
      <EditableSection sectionId="certs-docs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-reveal text-center mb-12">
            <SectionBadge className="mb-4">
              <EditableText contentKey="certificates.docs.badge" defaultAr="المستندات المطلوبة للتصدير" defaultEn="Required Export Documents" />
            </SectionBadge>
            <h2 className={`text-3xl font-bold text-gray-900 mt-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText contentKey="certificates.docs.title" defaultAr="مستندات الشحن" defaultEn="Shipping Documents" />
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'certificates.doc1', labelAr: 'شهادة المنشأ', labelEn: 'Certificate of Origin', icon: '📜' },
              { key: 'certificates.doc2', labelAr: 'الشهادة الصحية النباتية', labelEn: 'Phytosanitary Certificate', icon: '🔬' },
              { key: 'certificates.doc3', labelAr: 'قائمة التعبئة', labelEn: 'Packing List', icon: '📋' },
              { key: 'certificates.doc4', labelAr: 'الفاتورة التجارية', labelEn: 'Commercial Invoice', icon: '📦' },
              { key: 'certificates.doc5', labelAr: 'بوليصة الشحن', labelEn: 'Bill of Lading', icon: '🚢' },
              { key: 'certificates.doc6', labelAr: 'شهادة التبخير', labelEn: 'Fumigation Certificate', icon: '✅' },
            ].map((req, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-gold/15 hover:border-brand-green/30 transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{req.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  <EditableText contentKey={req.key} defaultAr={req.labelAr} defaultEn={req.labelEn} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </EditableSection>
    </section>
    </main>
  );
}
