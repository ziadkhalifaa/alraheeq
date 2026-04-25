import { useEffect } from 'react';
import { Eye, Target, Heart, Leaf } from 'lucide-react';
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

export default function About() {
  const { t, isRTL, getPath } = useLanguage();
  useRevealObserver();

  const values = [
    { icon: '✨', key: 'about.values.v1', ar: 'الجودة الممتازة', en: 'Premium Quality' },
    { icon: '🤝', key: 'about.values.v2', ar: 'النزاهة والشفافية', en: 'Integrity & Transparency' },
    { icon: '🔍', key: 'about.values.v3', ar: 'العناية بالتفاصيل', en: 'Attention to Detail' },
    { icon: '📋', key: 'about.values.v4', ar: 'الالتزام بالمواعيد', en: 'Punctuality' },
    { icon: '🌍', key: 'about.values.v5', ar: 'الاستدامة البيئية', en: 'Environmental Sustainability' },
  ];

  const stats = [
    { valueKey: 'about.stats.v1', labelKey: 'about.stats.l1', subKey: 'about.stats.s1', vAr: '30+', vEn: '30+', lAr: 'دولة', lEn: 'Countries', sAr: 'نصدر منتجاتنا حول العالم', sEn: 'We export our products worldwide' },
    { valueKey: 'about.stats.v2', labelKey: 'about.stats.l2', subKey: 'about.stats.s2', vAr: '50+', vEn: '50+', lAr: 'منتج', lEn: 'Products', sAr: 'من الأعشاب والتوابل والبذور', sEn: 'From herbs, spices, and seeds' },
    { valueKey: 'about.stats.v3', labelKey: 'about.stats.l3', subKey: 'about.stats.s3', vAr: '🇪🇬', vEn: '🇪🇬', lAr: 'زراعة مصرية', lEn: 'Egyptian Farming', sAr: 'من أفضل الأراضي الزراعية', sEn: 'From the finest agricultural lands', isEmoji: true },
    { valueKey: 'about.stats.v4', labelKey: 'about.stats.l4', subKey: 'about.stats.s4', vAr: '100%', vEn: '100%', lAr: 'طبيعي', lEn: 'Natural', sAr: 'خالٍ من الإضافات الكيميائية', sEn: 'Free from chemical additives' },
  ];

  return (
    <main className="pt-20">
      {/* Hero */}
    <section className="relative py-28 bg-brand-gradient overflow-hidden">
      <EditableSection sectionId="about-hero">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        {/* Decorative leaves */}
        <div className="absolute top-12 right-12 opacity-20 animate-float">
          <Leaf className="w-24 h-24 text-brand-gold" />
        </div>
        <div className="absolute bottom-12 left-12 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <Leaf className="w-16 h-16 text-white" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
            <EditableText 
              contentKey="about.hero.badge"
              defaultAr="من نحن"
              defaultEn="About Us"
            />
          </SectionBadge>
          <h1 className={`text-5xl lg:text-6xl font-bold text-white mt-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="about.hero.title"
              defaultAr="قصة"
              defaultEn="The Story of"
            />{' '}
            <EditableText 
              className="text-brand-gold"
              contentKey="about.hero.titleAccent"
              defaultAr="الرحيق"
              defaultEn="Al-Raheeq"
            />
          </h1>
        </div>
      </EditableSection>
    </section>

      {/* Intro */}
    <section className="py-20 bg-white relative">
      <EditableSection sectionId="about-intro">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-reveal-left">
              <div className="space-y-5">
                <p className="text-xl font-medium text-gray-800 leading-relaxed">
                  <EditableText 
                    contentKey="about.intro.text1"
                    defaultAr="الرحيق هي شركة مصرية رائدة في مجال زراعة وتصدير الأعشاب الطبية والعطرية والتمور والبذور."
                    defaultEn="Al-Raheeq is a leading Egyptian company in the cultivation and export of medicinal and aromatic herbs, dates, and seeds."
                  />
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <EditableText 
                    contentKey="about.intro.text2"
                    defaultAr="منذ تأسيسنا، وضعنا الجودة والمصداقية كأهم أولوياتنا. نحن نشرف على كامل عملية الإنتاج، بدءاً من اختيار البذور المتميزة وحتى التعبئة والتغليف بأحدث التقنيات."
                    defaultEn="Since our founding, we have placed quality and credibility as our top priorities. We oversee the entire production process, from selecting premium seeds to packaging using the latest technologies."
                  />
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <EditableText 
                    contentKey="about.intro.text3"
                    defaultAr="تمتد مزارعنا في أفضل الأراضي الزراعية في مصر، حيث المناخ المثالي لإنتاج محاصيل ذات خصائص طبيعية ومواصفات عالمية، لتلبي احتياجات شركائنا في جميع أنحاء العالم."
                    defaultEn="Our farms stretch across the best agricultural lands in Egypt, where the ideal climate produces crops with natural characteristics and global specifications, meeting the needs of our partners worldwide."
                  />
                </p>
              </div>
            </div>

            <div className="animate-reveal-right">
              <div className="relative rounded-3xl overflow-hidden h-96 shadow-brand-lg">
                <EditableImage 
                  contentKey="about.intro.image"
                  defaultSrc="https://images.unsplash.com/photo-1628251727905-3b4de94de23b?w=800&q=80&auto=format&fit=crop"
                  alt="Egyptian farm"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          <EditableText 
                            contentKey="about.intro.imgLabel1"
                            defaultAr="الرحيق هربس"
                            defaultEn="Alraheeq Herbs"
                          />
                        </p>
                        <p className="text-white/70 text-xs">
                          <EditableText 
                            contentKey="about.intro.imgLabel2"
                            defaultAr="بني سويف، مصر"
                            defaultEn="Beni Suef, Egypt"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EditableSection>
    </section>

      {/* Stats */}
    <section className="py-16 bg-brand-beige relative">
      <EditableSection sectionId="about-stats">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`animate-scale-in stagger-${i + 1} text-center p-8 rounded-3xl glass-card border border-brand-green/10`}
              >
                <div className={`font-bold text-brand-green mb-1 ${stat.isEmoji ? 'text-4xl' : 'text-4xl lg:text-5xl'}`}>
                  <EditableText contentKey={stat.valueKey} defaultAr={stat.vAr} defaultEn={stat.vEn} />
                </div>
                <div className="text-gray-700 font-semibold text-sm mb-0.5">
                  <EditableText contentKey={stat.labelKey} defaultAr={stat.lAr} defaultEn={stat.lEn} />
                </div>
                <div className="text-gray-400 text-xs">
                  <EditableText contentKey={stat.subKey} defaultAr={stat.sAr} defaultEn={stat.sEn} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </EditableSection>
    </section>

      {/* Vision & Mission */}
    <section className="py-20 bg-white relative">
      <EditableSection sectionId="about-vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="animate-reveal-left p-8 rounded-3xl bg-gradient-to-br from-brand-green/5 to-emerald-50 border border-brand-green/15">
              <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center mb-5 shadow-brand">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <SectionBadge className="mb-3 text-xs">
                <EditableText contentKey="about.vision.badge" defaultAr="رؤيتنا" defaultEn="Our Vision" />
              </SectionBadge>
              <h2 className={`text-2xl font-bold text-gray-900 mt-2 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                <EditableText contentKey="about.vision.title" defaultAr="الريادة العالمية في تصدير الأعشاب" defaultEn="Global Leadership in Herbs Export" />
              </h2>
              <p className="text-gray-600 leading-relaxed">
                <EditableText 
                  contentKey="about.vision.text" 
                  defaultAr="نسعى لنكون الاسم الأول والأكثر ثقة عالمياً في مجال تصدير الأعشاب الطبية والعطرية والتمور المصرية، وأن نمثل الجودة المصرية بأفضل صورة في الأسواق الدولية." 
                  defaultEn="We strive to be the first and most trusted global name in exporting Egyptian medicinal and aromatic herbs and dates, and to represent Egyptian quality in the best possible way in international markets." 
                />
              </p>
            </div>

            {/* Mission */}
            <div className="animate-reveal-right p-8 rounded-3xl bg-gradient-to-br from-brand-gold/5 to-amber-50 border border-brand-gold/15">
              <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center mb-5 shadow-gold">
                <Target className="w-7 h-7 text-white" />
              </div>
              <SectionBadge className="mb-3 text-xs">
                <EditableText contentKey="about.mission.badge" defaultAr="رسالتنا" defaultEn="Our Mission" />
              </SectionBadge>
              <h2 className={`text-2xl font-bold text-gray-900 mt-2 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                <EditableText contentKey="about.mission.title" defaultAr="تقديم الأفضل دائماً" defaultEn="Always Delivering the Best" />
              </h2>
              <p className="text-gray-600 leading-relaxed">
                <EditableText 
                  contentKey="about.mission.text" 
                  defaultAr="توفير منتجات زراعية طبيعية وآمنة 100%، وتطبيق أعلى معايير الجودة العالمية في الزراعة والتجهيز والتعبئة، مع الحفاظ على الاستدامة البيئية." 
                  defaultEn="Providing 100% natural and safe agricultural products, and applying the highest global quality standards in cultivation, processing, and packaging, while maintaining environmental sustainability." 
                />
              </p>
            </div>
          </div>
        </div>
      </EditableSection>
    </section>

      {/* Values */}
    <section className="py-20 bg-brand-gradient relative overflow-hidden">
      <EditableSection sectionId="about-values">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-reveal mb-12">
            <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
              <EditableText contentKey="about.values.badge" defaultAr="قيمنا" defaultEn="Our Values" />
            </SectionBadge>
            <h2 className={`text-4xl font-bold text-white mt-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText contentKey="about.values.title" defaultAr="المبادئ التي تقودنا" defaultEn="The Principles that Guide Us" />
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {values.map((value, i) => (
              <div
                key={i}
                className={`animate-scale-in stagger-${i + 1} flex items-center gap-3 px-6 py-3 rounded-2xl glass border border-white/20 text-white font-medium text-base hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default`}
              >
                <span className="text-2xl">{value.icon}</span>
                <EditableText contentKey={value.key} defaultAr={value.ar} defaultEn={value.en} />
              </div>
            ))}
          </div>
        </div>
      </EditableSection>
    </section>
    </main>
  );
}
