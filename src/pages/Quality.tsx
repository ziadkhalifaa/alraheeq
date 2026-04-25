import { useEffect } from 'react';
import { Shield, CheckCircle2, Search, Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';
import { EditableText } from '@/editor/EditableText';
import { EditableImage } from '@/editor/EditableImage';
import { EditableSection } from '@/editor/EditableSection';

function useRevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    const elements = document.querySelectorAll('.animate-reveal, .animate-reveal-left, .animate-reveal-right, .animate-scale-in');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Quality() {
  const { t, isRTL, getPath } = useLanguage();
  useRevealObserver();

  const qualityPillars = [
    {
      icon: Shield,
      badgeKey: 'quality.safety.badge',
      badgeAr: 'سلامة الغذاء',
      badgeEn: 'Food Safety',
      titleKey: 'quality.safety.title',
      titleAr: 'معايير أمان صارمة',
      titleEn: 'Strict Safety Standards',
      textKey: 'quality.safety.text',
      textAr: 'نطبق أحدث أنظمة سلامة الغذاء (HACCP و ISO 22000) لضمان خلو منتجاتنا من أي ملوثات أو مبيدات ضارة.',
      textEn: 'We apply the latest food safety systems (HACCP and ISO 22000) to ensure our products are free from any contaminants or harmful pesticides.',
      gradient: 'from-brand-green/5 to-emerald-50',
      border: 'border-brand-green/15',
      iconBg: 'bg-brand-gradient',
      imageKey: 'quality.safety.img',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80&auto=format&fit=crop',
    },
    {
      icon: CheckCircle2,
      badgeKey: 'quality.control.badge',
      badgeAr: 'مراقبة الجودة',
      badgeEn: 'Quality Control',
      titleKey: 'quality.control.title',
      titleAr: 'فحص مستمر ودقيق',
      titleEn: 'Continuous & Precise Inspection',
      textKey: 'quality.control.text',
      textAr: 'فريق متخصص من خبراء الجودة يراقب كل مرحلة، من استلام المواد الخام وحتى التعبئة النهائية والتخزين.',
      textEn: 'A dedicated team of quality experts monitors every stage, from receiving raw materials to final packaging and storage.',
      gradient: 'from-blue-50 to-indigo-50',
      border: 'border-blue-100',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      imageKey: 'quality.control.img',
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=80&auto=format&fit=crop',
    },
    {
      icon: Search,
      badgeKey: 'quality.sampling.badge',
      badgeAr: 'التحاليل المعملية',
      badgeEn: 'Lab Testing',
      titleKey: 'quality.sampling.title',
      titleAr: 'اختبارات شاملة',
      titleEn: 'Comprehensive Testing',
      textKey: 'quality.sampling.text',
      textAr: 'نتعاون مع مختبرات دولية معتمدة لإجراء تحاليل شاملة للخصائص الكيميائية والميكروبيولوجية لكل شحنة.',
      textEn: 'We collaborate with internationally accredited laboratories to conduct comprehensive chemical and microbiological analyzes for each shipment.',
      gradient: 'from-brand-gold/5 to-amber-50',
      border: 'border-brand-gold/15',
      iconBg: 'bg-gold-gradient',
      imageKey: 'quality.sampling.img',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80&auto=format&fit=crop',
    },
  ];

  const steps = [
    { num: '01', key: 'quality.journey1', ar: 'الزراعة والحصاد', en: 'Farming & Harvest', icon: '🌿' },
    { num: '02', key: 'quality.journey2', ar: 'الفحص المبدئي', en: 'Initial Inspection', icon: '🔬' },
    { num: '03', key: 'quality.journey3', ar: 'الفرز والتنقية', en: 'Sorting & Cleaning', icon: '✅' },
    { num: '04', key: 'quality.journey4', ar: 'التجهيز والتعبئة', en: 'Processing & Packing', icon: '⚙️' },
    { num: '05', key: 'quality.journey5', ar: 'الفحص النهائي', en: 'Final Inspection', icon: '📦' },
    { num: '06', key: 'quality.journey6', ar: 'الشحن والتصدير', en: 'Shipping & Export', icon: '🚢' },
  ];

  return (
    <main className="pt-20">
      {/* Hero */}
    <section className="relative py-28 overflow-hidden">
      <EditableSection sectionId="quality-hero">
        <div className="absolute inset-0 bg-brand-gradient" />
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="absolute top-12 right-12 opacity-20 animate-float">
          <Leaf className="w-24 h-24 text-brand-gold" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
            <EditableText 
              contentKey="quality.hero.badge"
              defaultAr="الجودة والاعتمادات"
              defaultEn="Quality & Certifications"
            />
          </SectionBadge>
          <h1 className={`text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="quality.hero.title"
              defaultAr="التزامنا"
              defaultEn="Our Commitment"
            />{' '}
            <EditableText 
              className="text-brand-gold"
              contentKey="quality.hero.titleAccent"
              defaultAr="بالتميز"
              defaultEn="to Excellence"
            />
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            <EditableText 
              contentKey="quality.hero.subtitle"
              defaultAr="لا نساوم أبداً على جودة منتجاتنا. نحن نتبع أعلى معايير الجودة العالمية في كل خطوة من خطوات الإنتاج لضمان حصول عملائنا على الأفضل دائماً."
              defaultEn="We never compromise on the quality of our products. We follow the highest global quality standards at every step of production to ensure our customers always receive the best."
            />
          </p>
        </div>
      </EditableSection>
    </section>

      {/* Intro statement */}
    <section className="py-12 bg-white relative">
      <EditableSection sectionId="quality-intro">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-reveal">
          <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-brand-gold rtl:border-l-0 rtl:border-r-4 px-6 py-4 bg-brand-gold/5 rounded-r-2xl rtl:rounded-r-none rtl:rounded-l-2xl text-right rtl:text-right">
            <EditableText 
              contentKey="quality.intro"
              defaultAr="الجودة في الرحيق ليست مجرد إجراء روتيني، بل هي ثقافة راسخة وجزء لا يتجزأ من كل مرحلة من مراحل عملنا."
              defaultEn="Quality at Al-Raheeq is not just a routine procedure, but an established culture and an integral part of every stage of our work."
            />
          </p>
        </div>
      </EditableSection>
    </section>

      {/* Quality Process Timeline */}
    <section className="py-16 bg-brand-beige relative">
      <EditableSection sectionId="quality-journey">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-reveal text-center mb-12">
            <h2 className={`text-3xl font-bold text-gray-900 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText contentKey="quality.journeyTitle" defaultAr="رحلة الجودة" defaultEn="The Quality Journey" />
            </h2>
          </div>

          {/* Timeline steps */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-brand-green via-brand-gold to-brand-olive" />

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-2">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`animate-scale-in stagger-${i + 1} flex flex-col items-center text-center`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-brand-green/20 flex flex-col items-center justify-center shadow-brand relative z-10 hover:border-brand-green hover:shadow-brand-lg transition-all duration-300 mb-3 group">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{step.icon}</span>
                  </div>
                  <span className="text-xs text-brand-gold font-bold mb-1">{step.num}</span>
                  <span className="text-xs text-gray-600 font-medium">
                    <EditableText contentKey={step.key} defaultAr={step.ar} defaultEn={step.en} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EditableSection>
    </section>

      {/* Quality Pillars */}
    <section className="py-20 bg-white relative">
      <EditableSection sectionId="quality-pillars">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {qualityPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            const isEven = i % 2 === 0;

            return (
              <div
                key={i}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
              >
                {/* Image */}
                <div className={`animate-reveal-${isEven ? 'left' : 'right'} w-full lg:w-1/2`}>
                  <div className="img-zoom rounded-3xl overflow-hidden h-72 shadow-brand-lg">
                    <EditableImage
                      contentKey={pillar.imageKey}
                      defaultSrc={pillar.image}
                      alt={pillar.titleEn}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={`animate-reveal-${isEven ? 'right' : 'left'} w-full lg:w-1/2`}>
                  <div className={`p-8 rounded-3xl bg-gradient-to-br ${pillar.gradient} border ${pillar.border}`}>
                    <div className={`w-14 h-14 rounded-2xl ${pillar.iconBg} flex items-center justify-center mb-5 shadow-brand`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <SectionBadge className="mb-3 text-xs">
                      <EditableText contentKey={pillar.badgeKey} defaultAr={pillar.badgeAr} defaultEn={pillar.badgeEn} />
                    </SectionBadge>
                    <h2 className={`text-2xl font-bold text-gray-900 mt-3 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                      <EditableText contentKey={pillar.titleKey} defaultAr={pillar.titleAr} defaultEn={pillar.titleEn} />
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      <EditableText contentKey={pillar.textKey} defaultAr={pillar.textAr} defaultEn={pillar.textEn} />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </EditableSection>
    </section>
    </main>
  );
}
