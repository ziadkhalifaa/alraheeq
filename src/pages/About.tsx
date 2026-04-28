import { useEffect, useRef } from 'react';
import { Eye, Target, Heart, Leaf, ShieldCheck, Award, Globe, Users, TrendingUp, Compass } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';
import { EditableText } from '@/editor/EditableText';
import { EditableImage } from '@/editor/EditableImage';
import { EditableSection } from '@/editor/EditableSection';

export default function About() {
  const { t, isRTL } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const values = [
    { icon: Award, key: 'about.values.v1', ar: 'الجودة الممتازة', en: 'Premium Quality', color: 'bg-amber-500' },
    { icon: ShieldCheck, key: 'about.values.v2', ar: 'النزاهة والشفافية', en: 'Integrity & Transparency', color: 'bg-blue-500' },
    { icon: Target, key: 'about.values.v3', ar: 'العناية بالتفاصيل', en: 'Attention to Detail', color: 'bg-emerald-500' },
    { icon: Compass, key: 'about.values.v4', ar: 'الالتزام بالمواعيد', en: 'Punctuality', color: 'bg-purple-500' },
    { icon: Leaf, key: 'about.values.v5', ar: 'الاستدامة البيئية', en: 'Environmental Sustainability', color: 'bg-green-500' },
  ];

  const stats = [
    { icon: Globe, valueKey: 'about.stats.v1', labelKey: 'about.stats.l1', subKey: 'about.stats.s1', vAr: '30+', vEn: '30+', lAr: 'دولة', lEn: 'Countries', sAr: 'نصدر منتجاتنا حول العالم', sEn: 'We export our products worldwide' },
    { icon: Users, valueKey: 'about.stats.v2', labelKey: 'about.stats.l2', subKey: 'about.stats.s2', vAr: '50+', vEn: '50+', lAr: 'منتج', lEn: 'Products', sAr: 'من الأعشاب والتوابل والبذور', sEn: 'From herbs, spices, and seeds' },
    { icon: TrendingUp, valueKey: 'about.stats.v3', labelKey: 'about.stats.l3', subKey: 'about.stats.s3', vAr: '20+', vEn: '20+', lAr: 'سنة خبرة', lEn: 'Years Exp', sAr: 'من أفضل الأراضي الزراعية', sEn: 'From the finest agricultural lands' },
    { icon: Leaf, valueKey: 'about.stats.v4', labelKey: 'about.stats.l4', subKey: 'about.stats.s4', vAr: '100%', vEn: '100%', lAr: 'طبيعي', lEn: 'Natural', sAr: 'خالٍ من الإضافات الكيميائية', sEn: 'Free from chemical additives' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="overflow-x-hidden bg-white" ref={containerRef}>
      {/* Premium Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#1c4b42]">
        <div className="absolute inset-0 z-0">
          <EditableImage 
            contentKey="about.hero.bg"
            defaultSrc="https://images.unsplash.com/photo-1599933310632-60317e082b26?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full"
            imgClassName="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c4b42]/80 via-[#1c4b42]/40 to-[#1c4b42] pointer-events-none" />
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.div variants={fadeInUp}>
            <SectionBadge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-md px-6 py-2">
              <EditableText contentKey="about.hero.badge" defaultAr="من نحن" defaultEn="About Us" />
            </SectionBadge>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className={`text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
          >
            <EditableText contentKey="about.hero.title" defaultAr="قصة" defaultEn="The Story of" />
            <span className="text-[#86c434] block mt-1">
              <EditableText contentKey="about.hero.titleAccent" defaultAr="الرحيق" defaultEn="Al-Raheeq" />
            </span>
          </motion.h1>

          <motion.div 
            variants={fadeInUp}
            className="w-24 h-1 bg-[#86c434] mx-auto rounded-full mb-8"
          />
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 opacity-20 animate-float hidden lg:block">
          <Leaf className="w-24 h-24 text-[#86c434] rotate-45" />
        </div>
        <div className="absolute bottom-1/4 right-10 opacity-20 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
          <Leaf className="w-16 h-16 text-white -rotate-12" />
        </div>
      </section>

      {/* Intro Story Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#86c434]/10 rounded-full blur-3xl" />
              <SectionBadge className="mb-4">
                <EditableText contentKey="about.intro.badge" defaultAr="رحلتنا" defaultEn="Our Journey" />
              </SectionBadge>
              <h2 className={`text-3xl md:text-4xl font-bold text-[#1c4b42] mb-6 leading-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                <EditableText 
                  contentKey="about.intro.heading" 
                  defaultAr="جودة مصرية تصل إلى كل بقاع الأرض" 
                  defaultEn="Egyptian Quality Reaching Every Corner" 
                />
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <EditableText 
                  contentKey="about.intro.text1"
                  defaultAr="الرحيق هي شركة مصرية رائدة في مجال زراعة وتصدير الأعشاب الطبية والعطرية والتمور والبذور."
                  defaultEn="Al-Raheeq is a leading Egyptian company in the cultivation and export of medicinal and aromatic herbs, dates, and seeds."
                />
                <EditableText 
                  contentKey="about.intro.text2"
                  defaultAr="منذ تأسيسنا، وضعنا الجودة والمصداقية كأهم أولوياتنا. نحن نشرف على كامل عملية الإنتاج، بدءاً من اختيار البذور المتميزة وحتى التعبئة والتغليف بأحدث التقنيات."
                  defaultEn="Since our founding, we have placed quality and credibility as our top priorities. We oversee the entire production process, from selecting premium seeds to packaging using the latest technologies."
                />
                <EditableText 
                  contentKey="about.intro.text3"
                  defaultAr="تمتد مزارعنا في أفضل الأراضي الزراعية في مصر، حيث المناخ المثالي لإنتاج محاصيل ذات خصائص طبيعية ومواصفات عالمية، لتلبي احتياجات شركائنا في جميع أنحاء العالم."
                  defaultEn="Our farms stretch across the best agricultural lands in Egypt, where the ideal climate produces crops with natural characteristics and global specifications, meeting the needs of our partners worldwide."
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl z-10">
                <EditableImage 
                  contentKey="about.intro.image"
                  defaultSrc="https://images.unsplash.com/photo-1628251727905-3b4de94de23b?w=800&q=80&auto=format&fit=crop"
                  alt="Egyptian farm"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c4b42]/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="glass rounded-3xl p-6 border border-white/20 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#86c434] flex items-center justify-center shadow-lg">
                        <Leaf className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">
                          <EditableText contentKey="about.intro.imgLabel1" defaultAr="مزارعنا في مصر" defaultEn="Our Farms in Egypt" />
                        </p>
                        <p className="text-white/80 text-sm">
                          <EditableText contentKey="about.intro.imgLabel2" defaultAr="بني سويف والمنيا" defaultEn="Beni Suef & Minya" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative rings */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 border-[32px] border-[#86c434]/10 rounded-full -z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-24 bg-[#f7fbf2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#1c4b42]/5 text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-[#1c4b42]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#86c434] transition-colors duration-500">
                  <stat.icon className="w-8 h-8 text-[#1c4b42] group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="text-4xl font-black text-[#1c4b42] mb-2">
                  <EditableText contentKey={stat.valueKey} defaultAr={stat.vAr} defaultEn={stat.vEn} />
                </div>
                <div className="text-[#86c434] font-bold text-lg mb-2">
                  <EditableText contentKey={stat.labelKey} defaultAr={stat.lAr} defaultEn={stat.lEn} />
                </div>
                <div className="text-gray-400 text-sm leading-relaxed">
                  <EditableText contentKey={stat.subKey} defaultAr={stat.sAr} defaultEn={stat.sEn} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Split Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group p-12 rounded-[3.5rem] bg-[#1c4b42] text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
                  <Eye className="w-10 h-10 text-[#86c434]" />
                </div>
                <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
                  <EditableText contentKey="about.vision.badge" defaultAr="رؤيتنا" defaultEn="Our Vision" />
                </SectionBadge>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                  <EditableText contentKey="about.vision.title" defaultAr="الريادة العالمية في تصدير الأعشاب" defaultEn="Global Leadership in Herbs Export" />
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  <EditableText 
                    contentKey="about.vision.text" 
                    defaultAr="نسعى لنكون الاسم الأول والأكثر ثقة عالمياً في مجال تصدير الأعشاب الطبية والعطرية والتمور المصرية، وأن نمثل الجودة المصرية بأفضل صورة في الأسواق الدولية." 
                    defaultEn="We strive to be the first and most trusted global name in exporting Egyptian medicinal and aromatic herbs and dates, and to represent Egyptian quality in the best possible way in international markets." 
                  />
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group p-12 rounded-[3.5rem] bg-[#f7fbf2] border border-[#1c4b42]/10 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#86c434]/5 rounded-full -ml-32 -mb-32 blur-3xl" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-[#1c4b42]/5 rounded-[2rem] flex items-center justify-center mb-8">
                  <Target className="w-10 h-10 text-[#1c4b42]" />
                </div>
                <SectionBadge className="mb-4">
                  <EditableText contentKey="about.mission.badge" defaultAr="رسالتنا" defaultEn="Our Mission" />
                </SectionBadge>
                <h3 className={`text-2xl md:text-3xl font-bold text-[#1c4b42] mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                  <EditableText contentKey="about.mission.title" defaultAr="تقديم الأفضل دائماً" defaultEn="Always Delivering the Best" />
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  <EditableText 
                    contentKey="about.mission.text" 
                    defaultAr="توفير منتجات زراعية طبيعية وآمنة 100%، وتطبيق أعلى معايير الجودة العالمية في الزراعة والتجهيز والتعبئة، مع الحفاظ على الاستدامة البيئية." 
                    defaultEn="Providing 100% natural and safe agricultural products, and applying the highest global quality standards in cultivation, processing, and packaging, while maintaining environmental sustainability." 
                  />
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Values Section */}
      <section className="py-32 bg-[#1c4b42] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full pattern-grid" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
                <EditableText contentKey="about.values.badge" defaultAr="قيمنا" defaultEn="Our Values" />
              </SectionBadge>
              <h2 className={`text-3xl md:text-4xl font-bold text-white ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                <EditableText contentKey="about.values.title" defaultAr="المبادئ التي تقودنا" defaultEn="The Principles that Guide Us" />
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 text-center"
              >
                <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">
                  <EditableText contentKey={value.key} defaultAr={value.ar} defaultEn={value.en} />
                </h4>
                <div className="w-8 h-1 bg-[#86c434] mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-16 rounded-[4rem] bg-[#86c434] text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <h2 className="text-4xl font-black mb-8 relative z-10">
              <EditableText 
                contentKey="about.cta.title" 
                defaultAr="هل تود التعرف على منتجاتنا؟" 
                defaultEn="Want to see our products?" 
              />
            </h2>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <a href="/products" className="px-10 py-5 bg-[#1c4b42] text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all">
                {isRTL ? 'استعرض منتجاتنا' : 'Browse Products'}
              </a>
              <a href="/contact" className="px-10 py-5 bg-white text-[#1c4b42] font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all">
                {isRTL ? 'تواصل معنا' : 'Contact Us'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
