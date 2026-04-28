import { useEffect, useRef } from 'react';
import { Award, FileCheck, Globe2, ShieldCheck, Leaf, ScrollText, CheckCircle, Package, Truck, ClipboardList, Microscope } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';
import { EditableText } from '@/editor/EditableText';
import { EditableImage } from '@/editor/EditableImage';
import { EditableSection } from '@/editor/EditableSection';
import { getSafeValue, getImgUrl } from '@/editor/utils';
import { useQuery } from '@tanstack/react-query';
import { certificateApi } from '@/api/api';

export default function Certificates() {
  const { isRTL } = useLanguage();
  const containerRef = useRef(null);

  const { data: certs, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => certificateApi.getAll().then(res => res.data),
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="overflow-hidden bg-white" ref={containerRef}>
      {/* High-End Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#1c4b42]">
        <div className="absolute inset-0 z-0 opacity-20">
          <EditableImage 
            contentKey="certificates.hero.bg"
            defaultSrc="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2000&auto=format&fit=crop"
            alt="Certificates Background"
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1c4b42]/80 pointer-events-none" />
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full pattern-dots opacity-10 pointer-events-none" />

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.div variants={fadeInUp}>
            <SectionBadge className="mb-8 bg-white/10 text-white border-white/20 backdrop-blur-md">
              <EditableText contentKey="certificates.hero.badge" defaultAr="شهادات الجودة" defaultEn="Quality Certificates" />
            </SectionBadge>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className={`text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
          >
            <EditableText contentKey="certificates.hero.title" defaultAr="التزامنا" defaultEn="Our Commitment" />
          </motion.h1>

          <motion.h2 
            variants={fadeInUp}
            className={`text-2xl md:text-3xl font-bold text-[#86c434] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
          >
            <EditableText contentKey="certificates.hero.titleAccent" defaultAr="بالمعايير الدولية" defaultEn="to International Standards" />
          </motion.h2>
        </motion.div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 right-10 opacity-10 animate-float hidden lg:block">
          <Award className="w-32 h-32 text-white" />
        </div>
        <div className="absolute bottom-1/4 left-10 opacity-10 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
          <ShieldCheck className="w-24 h-24 text-[#86c434]" />
        </div>
      </section>

      {/* Dynamic Certificates Grid */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionBadge className="mb-4">
                <EditableText contentKey="certificates.list.badge" defaultAr="شهاداتنا المعتمدة" defaultEn="Our Certified Standards" />
              </SectionBadge>
              <h2 className={`text-3xl md:text-4xl font-bold text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                <EditableText contentKey="certificates.list.title" defaultAr="الشهادات والاعتمادات الدولية" defaultEn="International Certifications" />
              </h2>
              <div className="w-20 h-1 bg-[#86c434] mx-auto mt-6 rounded-full" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-gray-50 animate-pulse border border-gray-100" />
              ))
            ) : certs && certs.length > 0 ? (
              certs.map((cert: any, i: number) => {
                const titleStr = getSafeValue(cert.title, isRTL ? 'ar' : 'en');
                const descStr = getSafeValue(cert.description, isRTL ? 'ar' : 'en');

                return (
                  <motion.div 
                    key={cert.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative h-full flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    <div className="aspect-video overflow-hidden bg-gray-50">
                      <img 
                        src={getImgUrl(cert.image_url)} 
                        alt={titleStr}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-[#1c4b42]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-8 flex-grow">
                      <div className="w-10 h-10 bg-[#f7fbf2] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#86c434] group-hover:rotate-6 transition-all duration-500">
                        <Award className="w-5 h-5 text-[#1c4b42] group-hover:text-white" />
                      </div>
                      <h3 className={`text-xl font-bold text-[#1c4b42] mb-3 leading-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                        {titleStr}
                      </h3>
                      <p className="text-gray-500 text-base leading-relaxed line-clamp-3">
                        {descStr}
                      </p>
                    </div>
                    {/* Floating check badge */}
                    <div className="absolute top-6 right-6 w-10 h-10 bg-[#86c434] text-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-500">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">
                {isRTL ? 'لا توجد شهادات حالياً' : 'No certificates found'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modern Export Documents List */}
      <section className="py-32 bg-[#f7fbf2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionBadge className="mb-4 bg-[#1c4b42]/5 text-[#1c4b42] border-[#1c4b42]/10">
                <EditableText contentKey="certificates.docs.badge" defaultAr="المستندات المطلوبة" defaultEn="Required Documents" />
              </SectionBadge>
              <h2 className={`text-3xl md:text-4xl font-bold text-[#1c4b42] mb-6 leading-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                <EditableText contentKey="certificates.docs.title" defaultAr="مستندات الشحن والتصدير" defaultEn="Export Shipping Documents" />
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                <EditableText 
                  contentKey="certificates.docs.subtitle" 
                  defaultAr="نوفر لشركائنا كافة الوثائق القانونية والشهادات الصحية اللازمة لضمان عملية تصدير سلسة وآمنة." 
                  defaultEn="We provide our partners with all legal documents and health certificates needed for a smooth and safe export process." 
                />
              </p>
              <div className="w-16 h-1.5 bg-[#86c434] rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { key: 'certificates.doc1', labelAr: 'شهادة المنشأ', labelEn: 'Certificate of Origin', icon: ScrollText },
                { key: 'certificates.doc2', labelAr: 'الشهادة الصحية النباتية', labelEn: 'Phytosanitary Cert', icon: Microscope },
                { key: 'certificates.doc3', labelAr: 'قائمة التعبئة', labelEn: 'Packing List', icon: ClipboardList },
                { key: 'certificates.doc4', labelAr: 'الفاتورة التجارية', labelEn: 'Commercial Invoice', icon: Package },
                { key: 'certificates.doc5', labelAr: 'بوليصة الشحن', labelEn: 'Bill of Lading', icon: Truck },
                { key: 'certificates.doc6', labelAr: 'شهادة التبخير', labelEn: 'Fumigation Certificate', icon: CheckCircle },
              ].map((req, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-[#1c4b42]/5 shadow-sm hover:shadow-xl hover:border-[#86c434]/50 transition-all group"
                >
                  <div className="w-14 h-14 bg-[#1c4b42]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#1c4b42] transition-colors">
                    <req.icon className="w-7 h-7 text-[#1c4b42] group-hover:text-white" />
                  </div>
                  <span className="text-lg font-bold text-[#1c4b42]">
                    <EditableText contentKey={req.key} defaultAr={req.labelAr} defaultEn={req.labelEn} />
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-[#1c4b42]/5 skew-x-12 -mr-[20%] pointer-events-none" />
      </section>

      {/* CTA section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-20 rounded-[4rem] bg-[#1c4b42] text-white relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full pattern-grid opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-8">
                <EditableText 
                  contentKey="certificates.cta.title" 
                  defaultAr="هل تحتاج إلى نسخ من شهاداتنا؟" 
                  defaultEn="Do you need copies of our certificates?" 
                />
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="/contact" className="px-12 py-5 bg-[#86c434] text-[#1c4b42] font-bold rounded-[2rem] hover:bg-white hover:scale-105 transition-all">
                  {isRTL ? 'تواصل معنا الآن' : 'Contact Us Now'}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
