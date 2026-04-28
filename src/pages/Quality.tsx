import React, { useEffect, useRef, useState } from 'react';
import { Shield, CheckCircle2, Search, Leaf, FlaskConical, Beaker, ClipboardCheck, Microscope, Award, ChevronRight } from 'lucide-react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';
import { EditableText } from '@/editor/EditableText';
import { EditableImage } from '@/editor/EditableImage';
import { EditableSection } from '@/editor/EditableSection';

export default function Quality() {
  const { isRTL } = useLanguage();
  const containerRef = useRef(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const steps = [
    { num: '01', key: 'quality.journey1', ar: 'الزراعة والحصاد', en: 'Farming & Harvest', icon: Leaf, imgKey: 'quality.step1.img', defaultImg: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&q=80&auto=format&fit=crop', descKey: 'quality.step1.desc', descAr: 'نبدأ رحلة الجودة من التربة، حيث نختار أفضل البذور ونشرف على عمليات الزراعة والحصاد وفق معايير صارمة.', descEn: 'We start the quality journey from the soil, where we select the best seeds and supervise the farming and harvesting processes according to strict standards.' },
    { num: '02', key: 'quality.journey2', ar: 'الفحص المبدئي', en: 'Initial Inspection', icon: Search, imgKey: 'quality.step2.img', defaultImg: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80&auto=format&fit=crop', descKey: 'quality.step2.desc', descAr: 'يتم فحص المواد الخام فور وصولها للتأكد من مطابقتها للمواصفات الفيزيائية والكيميائية المطلوبة.', descEn: 'Raw materials are inspected upon arrival to ensure they meet the required physical and chemical specifications.' },
    { num: '03', key: 'quality.journey3', ar: 'الفرز والتنقية', en: 'Sorting & Cleaning', icon: ClipboardCheck, imgKey: 'quality.step3.img', defaultImg: 'https://images.unsplash.com/photo-1593113616828-6f22bca04804?w=800&q=80&auto=format&fit=crop', descKey: 'quality.step3.desc', descAr: 'نستخدم أحدث الماكينات لإزالة أي شوائب أو مواد غريبة، مما يضمن نقاء المنتج بنسبة 100%.', descEn: 'We use the latest machines to remove any impurities or foreign materials, ensuring 100% product purity.' },
    { num: '04', key: 'quality.journey4', ar: 'التجهيز والتعبئة', en: 'Processing & Packing', icon: Beaker, imgKey: 'quality.step4.img', defaultImg: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80&auto=format&fit=crop', descKey: 'quality.step4.desc', descAr: 'تتم عمليات التجهيز والتعبئة في بيئة معقمة وتحت رقابة صحية كاملة للحفاظ على خصائص المنتج الطبيعية.', descEn: 'Processing and packaging operations are carried out in a sterile environment and under full health control to preserve the natural characteristics of the product.' },
    { num: '05', key: 'quality.journey5', ar: 'الفحص النهائي', en: 'Final Inspection', icon: Shield, imgKey: 'quality.step5.img', defaultImg: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&q=80&auto=format&fit=crop', descKey: 'quality.step5.desc', descAr: 'تخضع كل شحنة لفحص نهائي شامل قبل التحميل للتأكد من سلامة التعبئة والجودة النهائية.', descEn: 'Each shipment undergoes a comprehensive final inspection before loading to ensure the integrity of the packaging and final quality.' },
    { num: '06', key: 'quality.journey6', ar: 'الشحن والتصدير', en: 'Shipping & Export', icon: CheckCircle2, imgKey: 'quality.step6.img', defaultImg: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80&auto=format&fit=crop', descKey: 'quality.step6.desc', descAr: 'نقوم بشحن منتجاتنا عالمياً مع مراقبة ظروف النقل لضمان وصول المنتج إليك في أفضل حالة.', descEn: 'We ship our products globally while monitoring transport conditions to ensure the product reaches you in the best condition.' },
  ];

  // Auto-play slider logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [steps.length]);

  const qualityPillars = [
    {
      icon: FlaskConical,
      badgeKey: 'quality.safety.badge',
      badgeAr: 'سلامة الغذاء',
      badgeEn: 'Food Safety',
      titleKey: 'quality.safety.title',
      titleAr: 'معايير أمان صارمة',
      titleEn: 'Strict Safety Standards',
      textKey: 'quality.safety.text',
      textAr: 'نطبق أحدث أنظمة سلامة الغذاء (HACCP و ISO 22000) لضمان خلو منتجاتنا من أي ملوثات أو مبيدات ضارة.',
      textEn: 'We apply the latest food safety systems (HACCP and ISO 22000) to ensure our products are free from any contaminants or harmful pesticides.',
      color: 'emerald',
      imageKey: 'quality.safety.img',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80&auto=format&fit=crop',
    },
    {
      icon: Microscope,
      badgeKey: 'quality.control.badge',
      badgeAr: 'مراقبة الجودة',
      badgeEn: 'Quality Control',
      titleKey: 'quality.control.title',
      titleAr: 'فحص مستمر ودقيق',
      titleEn: 'Continuous & Precise Inspection',
      textKey: 'quality.control.text',
      textAr: 'فريق متخصص من خبراء الجودة يراقب كل مرحلة، من استلام المواد الخام وحتى التعبئة النهائية والتخزين.',
      textEn: 'A dedicated team of quality experts monitors every stage, from receiving raw materials to final packaging and storage.',
      color: 'blue',
      imageKey: 'quality.control.img',
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80&auto=format&fit=crop',
    },
    {
      icon: Beaker,
      badgeKey: 'quality.sampling.badge',
      badgeAr: 'التحاليل المعملية',
      badgeEn: 'Lab Testing',
      titleKey: 'quality.sampling.title',
      titleAr: 'اختبارات شاملة',
      titleEn: 'Comprehensive Testing',
      textKey: 'quality.sampling.text',
      textAr: 'نتعاون مع مختبرات دولية معتمدة لإجراء تحاليل شاملة للخصائص الكيميائية والميكروبيولوجية لكل شحنة.',
      textEn: 'We collaborate with internationally accredited laboratories to conduct comprehensive chemical and microbiological analyzes for each shipment.',
      color: 'amber',
      imageKey: 'quality.sampling.img',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    },
  ];


  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
  };

  return (
    <main className="bg-white overflow-hidden" ref={containerRef}>
      {/* Dynamic Lab Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#1c4b42]">
        <div className="absolute inset-0 z-0">
          <EditableImage 
            contentKey="quality.hero.bg"
            defaultSrc="https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop"
            alt="Lab Hero"
            className="w-full h-full"
            imgClassName="w-full h-full object-cover opacity-20 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c4b42] via-transparent to-[#1c4b42]/50 pointer-events-none" />
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.div variants={fadeInUp}>
            <SectionBadge className="mb-8 bg-[#86c434]/20 text-[#86c434] border-[#86c434]/30 backdrop-blur-md px-6 py-2">
              <EditableText contentKey="quality.hero.badge" defaultAr="الجودة والاعتمادات" defaultEn="Quality & Certifications" />
            </SectionBadge>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className={`text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-[1.2] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
          >
            <EditableText contentKey="quality.hero.title" defaultAr="التزامنا" defaultEn="Our Commitment" />
            <span className="text-[#86c434] block">
              <EditableText contentKey="quality.hero.titleAccent" defaultAr="بالتميز" defaultEn="to Excellence" />
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed font-medium"
          >
            <EditableText 
              contentKey="quality.hero.subtitle"
              defaultAr="لا نساوم أبداً على جودة منتجاتنا. نحن نتبع أعلى معايير الجودة العالمية في كل خطوة من خطوات الإنتاج."
              defaultEn="We never compromise on quality. We follow the highest global standards at every step of our production journey."
            />
          </motion.p>
        </motion.div>

        {/* Floating Lab Particles */}
        <div className="absolute bottom-20 left-20 animate-pulse opacity-20 hidden lg:block">
          <FlaskConical className="w-20 h-20 text-[#86c434]" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce opacity-20 hidden lg:block" style={{ animationDelay: '1s' }}>
          <Beaker className="w-16 h-16 text-white" />
        </div>
      </section>

      {/* Philosophy Statement Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-10 rounded-[3.5rem] bg-[#f7fbf2] border-2 border-[#1c4b42]/5 shadow-inner"
          >
            <Shield className="w-12 h-12 text-[#1c4b42] mx-auto mb-6 opacity-20" />
            <p className={`text-xl md:text-2xl text-[#1c4b42] leading-relaxed font-bold italic ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText 
                contentKey="quality.intro"
                defaultAr="الجودة في الرحيق ليست مجرد إجراء روتيني، بل هي ثقافة راسخة وجزء لا يتجزأ من كل مرحلة من مراحل عملنا."
                defaultEn="Quality at Al-Raheeq is not just a routine procedure, but an established culture and an integral part of every stage of our work."
              />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Quality Journey Slider - Redesigned */}
      <section className="py-20 bg-[#f7fbf2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionBadge className="mb-4">
              <EditableText contentKey="quality.journeyBadge" defaultAr="المسار" defaultEn="The Path" />
            </SectionBadge>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText contentKey="quality.journeyTitle" defaultAr="رحلة الجودة" defaultEn="The Quality Journey" />
            </h2>
          </div>

          <div className="relative px-4 md:px-12">
            {/* Slider Container */}
            <div className="relative h-[500px] md:h-[550px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {steps.map((step, i) => i === activeStep && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isRTL ? -100 : 100, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: isRTL ? 100 : -100, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex flex-col md:flex-row items-center gap-12"
                  >
                    {/* Image Card */}
                    <div className="w-full md:w-3/5 h-[400px] md:h-full relative group">
                      <div className="absolute -inset-4 bg-[#86c434]/10 rounded-[4rem] blur-2xl group-hover:bg-[#86c434]/20 transition-all duration-1000" />
                      <div className="relative h-full rounded-[4rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] border-8 border-white">
                        <EditableImage 
                          contentKey={step.imgKey}
                          defaultSrc={step.defaultImg}
                          alt={step.ar}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c4b42]/60 to-transparent pointer-events-none" />
                        
                        {/* Step Number Badge */}
                        <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 text-white font-black text-2xl">
                          {step.num}
                        </div>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="w-full md:w-2/5 space-y-8 text-center md:text-start">
                      <div className="w-20 h-20 rounded-3xl bg-[#86c434] flex items-center justify-center shadow-2xl shadow-[#86c434]/30">
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className={`text-3xl md:text-4xl font-black text-[#1c4b42] leading-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                          <EditableText contentKey={step.key} defaultAr={step.ar} defaultEn={step.en} />
                        </h3>
                        <div className="h-1 w-20 bg-[#86c434] rounded-full mx-auto md:mx-0" />
                      </div>

                      <p className="text-xl text-gray-500 font-medium leading-relaxed">
                        <EditableText contentKey={step.descKey} defaultAr={step.descAr} defaultEn={step.descEn} />
                      </p>

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                        <button 
                          onClick={() => setActiveStep((activeStep - 1 + steps.length) % steps.length)}
                          className="w-16 h-16 rounded-full border-2 border-[#1c4b42]/10 flex items-center justify-center hover:bg-[#1c4b42] hover:text-white transition-all duration-300"
                        >
                          <ChevronRight className={`w-6 h-6 ${isRTL ? '' : 'rotate-180'}`} />
                        </button>
                        <button 
                          onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                          className="w-16 h-16 rounded-full bg-[#1c4b42] text-white flex items-center justify-center hover:bg-[#86c434] transition-all duration-300 shadow-xl shadow-[#1c4b42]/20"
                        >
                          <ChevronRight className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination Line */}
            <div className="max-w-3xl mx-auto flex items-center gap-4 mt-12">
              <span className="text-[#1c4b42] font-black text-sm">01</span>
              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-[#1c4b42]"
                  initial={false}
                  animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[#1c4b42] font-black text-sm">{steps.length.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Sections */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {qualityPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
              >
                {/* Visual */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="absolute -inset-4 bg-[#86c434]/10 rounded-[4rem] blur-2xl group-hover:bg-[#86c434]/20 transition-all duration-1000" />
                  <div className="relative rounded-[3.5rem] overflow-hidden aspect-video shadow-2xl z-10 border-8 border-white">
                    <EditableImage
                      contentKey={pillar.imageKey}
                      defaultSrc={pillar.image}
                      alt={pillar.titleEn}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c4b42]/40 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-8">
                  <div className={`w-20 h-20 rounded-[2rem] bg-[#1c4b42]/5 flex items-center justify-center`}>
                    <Icon className="w-10 h-10 text-[#1c4b42]" />
                  </div>
                  <SectionBadge>
                    <EditableText contentKey={pillar.badgeKey} defaultAr={pillar.badgeAr} defaultEn={pillar.badgeEn} />
                  </SectionBadge>
                  <h3 className={`text-2xl md:text-3xl font-black text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                    <EditableText contentKey={pillar.titleKey} defaultAr={pillar.titleAr} defaultEn={pillar.titleEn} />
                  </h3>
                  <p className="text-gray-600 text-xl leading-relaxed">
                    <EditableText contentKey={pillar.textKey} defaultAr={pillar.textAr} defaultEn={pillar.textEn} />
                  </p>
                  
                  {/* Decorative line */}
                  <div className={`w-32 h-2 bg-[#86c434] rounded-full`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Certifications Quick Link */}
      <section className="py-24 bg-[#1c4b42] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-16 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Award className="w-20 h-20 text-[#86c434] mx-auto mb-8" />
            <h2 className="text-4xl font-black text-white mb-8">
              <EditableText 
                contentKey="quality.cta.title" 
                defaultAr="فخورون بحصولنا على أرقى الاعتمادات الدولية" 
                defaultEn="Proud to Hold the Most Prestigious International Certifications" 
              />
            </h2>
            <a 
              href="/certificates" 
              className="inline-flex items-center gap-4 px-12 py-5 bg-[#86c434] text-[#1c4b42] font-black rounded-[2rem] hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              {isRTL ? 'شاهد شهاداتنا' : 'View Our Certificates'}
              <Shield className="w-6 h-6" />
            </a>
          </motion.div>
        </div>
        
        {/* Decorative pattern */}
        <div className="absolute top-0 left-0 w-full h-full pattern-dots opacity-10 pointer-events-none" />
      </section>
    </main>
  );
}
