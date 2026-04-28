import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Play, CheckCircle2, Star, ChevronLeft, ChevronRight, Leaf, Package, Award, Users, ShieldCheck, MapPin, Zap, Target, Globe } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';
import { testimonials } from '@/constants/products';
import SectionBadge from '@/components/features/SectionBadge';
import ProductCard from '@/components/features/ProductCard';
import heroImage from '@/assets/hero-herbs.jpg';
import { useQuery } from '@tanstack/react-query';
import { productApi, blogApi, certificateApi } from '@/api/api';
import { EditableText } from '@/editor/EditableText';
import { getSafeValue } from '@/editor/utils';
import { EditableImage } from '@/editor/EditableImage';
import { EditableButton } from '@/editor/EditableButton';
import { EditableSection } from '@/editor/EditableSection';

// Scroll progress bar update
function useScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    const onScroll = () => {
      if (!bar) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (scrollTop / docHeight) * 100;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

// Scroll reveal observer setup
function useRevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.animate-reveal, .animate-reveal-left, .animate-reveal-right, .animate-scale-in');
      elements.forEach((el) => observer.observe(el));
    };

    // Initial observation
    observeElements();

    // Observe DOM changes for dynamic content
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}

function HeroSection() {
  const { t, isRTL, getPath } = useLanguage();
  const { trackEvent } = useTracking();
  const [bgLoaded, setBgLoaded] = useState(false);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const heroBg = "/uploads/general/hero_bg.webp";

  const stats = [
    { icon: Globe, value: '30+', label: isRTL ? 'دولة تصدير' : 'Export Countries' },
    { icon: Target, value: '100%', label: isRTL ? 'دقة وفحص' : 'Purity & Check' },
    { icon: ShieldCheck, value: 'ISO', label: isRTL ? 'شهادات جودة' : 'Certifications' },
    { icon: Zap, value: '24h', label: isRTL ? 'استجابة سريعة' : 'Fast Response' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1c4b42]">
      <EditableSection sectionId="hero">
        {/* Advanced Background */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0"
          >
            <EditableImage 
              contentKey="home.hero.bgImage" 
              defaultSrc={heroBg} 
              alt="Egyptian herbs and spices" 
              imgClassName="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c4b42]/80 via-[#1c4b42]/40 to-[#1c4b42]/90 z-10 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-40 max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Premium Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-[#b4e717] animate-pulse shadow-[0_0_12px_#b4e717]" />
                <span className="text-white/90 text-sm font-medium tracking-wide">
                  <EditableText 
                    contentKey="home.hero.badge"
                    defaultAr="الرحيق هربس - ريادة مصرية في التصدير"
                    defaultEn="Alraheeq Herbs - Egyptian Export Excellence"
                  />
                </span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              variants={itemVariants}
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.2] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
            >
              <EditableText 
                contentKey="home.hero.title1"
                defaultAr="نصدر جودة"
                defaultEn="Exporting"
              />{' '}
              <span className="text-[#b4e717]">
                <EditableText 
                  contentKey="home.hero.title2"
                  defaultAr="الأرض المصرية"
                  defaultEn="Egyptian Purity"
                />
              </span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/70 mt-4 block">
                <EditableText 
                  contentKey="home.hero.title3"
                  defaultAr="إلى كل ركن في العالم"
                  defaultEn="To Every Corner of the World"
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
            >
              <EditableText 
                contentKey="home.hero.subtitle"
                defaultAr="متخصصون في توريد أجود أنواع الأعشاب والتمور والبذور المصرية بأعلى معايير سلامة الغذاء والجودة العالمية."
                defaultEn="Specializing in supplying the finest Egyptian herbs, dates, and seeds with the highest food safety and global quality standards."
              />
            </motion.p>

            {/* Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <EditableButton 
                contentKey="home.hero.btn1"
                defaultAr="طلب تسعير سريع"
                defaultEn="Fast Quote Request"
                defaultHref="/contact"
                className="group relative overflow-hidden px-10 py-5 rounded-full bg-[#b4e717] text-[#1c4b42] font-bold text-lg shadow-[0_10px_30px_rgba(180,231,23,0.3)] hover:shadow-[0_15px_40px_rgba(180,231,23,0.4)] transition-all duration-500 hover:-translate-y-1"
                icon={<ArrowRight className={`w-5 h-5 transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />}
              />
              <EditableButton 
                contentKey="home.hero.btn2"
                defaultAr="استكشف منتجاتنا"
                defaultEn="Explore Products"
                defaultHref="/products"
                className="px-10 py-5 rounded-full border-2 border-white/20 text-white font-bold text-lg hover:bg-white hover:text-[#1c4b42] hover:border-white transition-all duration-500"
                icon={<Play className="w-4 h-4" />}
              />
            </motion.div>
          </motion.div>
        </div>
      </EditableSection>
    </section>

    {/* Standalone Stats Section */}
    <section className="relative z-50 -mt-16 px-4 hidden md:block">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto bg-white rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100"
      >
        <div className="grid grid-cols-4 divide-x divide-gray-100 rtl:divide-x-reverse">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center px-6 group">
              <div className="w-14 h-14 rounded-2xl bg-[#1c4b42]/5 flex items-center justify-center mb-5 group-hover:bg-[#1c4b42] transition-all duration-500">
                <stat.icon className="w-7 h-7 text-[#1c4b42] group-hover:text-[#b4e717] transition-colors" />
              </div>
              <div className="text-4xl font-black text-[#1c4b42] mb-1">
                <EditableText contentKey={`home.hero.stat${i}.value`} defaultAr={stat.value} defaultEn={stat.value} />
              </div>
              <div className="text-gray-400 text-xs font-black uppercase tracking-widest">
                <EditableText contentKey={`home.hero.stat${i}.label`} defaultAr={stat.label} defaultEn={stat.label} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
    </>
  );
}

function IntroSection() {
  const { t, isRTL, getPath } = useLanguage();
  
  const features = [
    { contentKey: 'home.intro.feature1', defaultAr: 'أعشاب عضوية 100%', defaultEn: '100% Organic Herbs' },
    { contentKey: 'home.intro.feature2', defaultAr: 'معايير جودة عالمية', defaultEn: 'Global Quality Standards' },
    { contentKey: 'home.intro.feature3', defaultAr: 'أسعار تنافسية', defaultEn: 'Competitive Pricing' },
    { contentKey: 'home.intro.feature4', defaultAr: 'شحن سريع وموثوق', defaultEn: 'Fast & Reliable Shipping' },
  ];

  const aboutBg = "/uploads/general/about_bg.webp";

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EditableSection sectionId="intro">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b4e717]/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1c4b42]/5 rounded-full blur-[120px] -ml-64 -mb-64" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            {/* Left: Image with Premium Frame */}
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl aspect-square">
                <EditableImage
                  contentKey="home.intro.imgMain"
                  defaultSrc={aboutBg}
                  alt="About Alraheeq"
                  imgClassName="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c4b42]/40 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating Decorative Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-10 z-20 glass-card rounded-[2rem] p-8 shadow-2xl border border-white/50 backdrop-blur-2xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#1c4b42] flex items-center justify-center shadow-lg">
                    <Award className="w-8 h-8 text-[#b4e717]" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#1c4b42]">15+</div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-tighter">
                      {isRTL ? 'عاماً من التميز' : 'Years Excellence'}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="absolute -top-6 -left-6 w-32 h-32 border-[12px] border-[#b4e717]/20 rounded-full" />
            </motion.div>

            {/* Right: Content */}
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c4b42]/5 border border-[#1c4b42]/10 text-[#1c4b42] text-sm font-bold mb-6 uppercase tracking-widest">
                <EditableText contentKey="home.intro.badge" defaultAr="من نحن" defaultEn="Who We Are" />
              </div>
              
              <h2 className={`text-2xl lg:text-3xl font-bold text-[#1c4b42] mb-6 leading-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                <EditableText 
                  contentKey="home.intro.title"
                  defaultAr="الجودة التي"
                  defaultEn="The Quality"
                />{' '}
                <span className="text-[#b4e717] underline decoration-4 underline-offset-8">
                  <EditableText 
                    contentKey="home.intro.titleAccent"
                    defaultAr="تستحقها أعمالك"
                    defaultEn="Your Business Deserves"
                  />
                </span>
              </h2>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-10 font-medium">
                <p>
                  <EditableText 
                    contentKey="home.intro.text1"
                    defaultAr="نحن في الرحيق هربس، نؤمن بأن الطبيعة تقدم أفضل ما لديها عندما يتم التعامل معها باحترام وعناية. لذلك، نلتزم بتصدير أجود المحاصيل المصرية للعالم."
                    defaultEn="At Alraheeq Herbs, we believe nature gives its best when handled with respect. We are committed to exporting the finest Egyptian crops to the world."
                  />
                </p>
                <p>
                  <EditableText 
                    contentKey="home.intro.text2"
                    defaultAr="تغطي عملياتنا كامل سلسلة التوريد، من الزراعة المستدامة وحتى التعبئة والشحن الدولي بأعلى معايير السلامة."
                    defaultEn="Our operations cover the entire supply chain, from sustainable farming to packaging and international shipping with the highest safety standards."
                  />
                </p>
              </div>

              {/* Modern Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#b4e717]/30 hover:bg-[#b4e717]/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1c4b42] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#b4e717]" />
                    </div>
                    <span className="text-sm font-bold text-[#1c4b42]">
                      <EditableText 
                        contentKey={feature.contentKey}
                        defaultAr={feature.defaultAr}
                        defaultEn={feature.defaultEn}
                      />
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </EditableSection>
    </section>
  );
}

function ProcessSection() {
  const { isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const steps = [
    {
      icon: Leaf,
      key: 'home.process.s1',
      titleAr: 'الزراعة المستدامة',
      titleEn: 'Sustainable Farming',
      descAr: 'نبدأ من مزارعنا الخاصة، نعتني بكل بذرة لتنمو في بيئة طبيعية 100%. نختار أفضل التربة والمناخ لضمان جودة استثنائية.',
      descEn: 'We start from our own farms, caring for every seed to grow in a 100% natural environment. We select the best soil and climate for exceptional quality.',
    },
    {
      icon: Target,
      key: 'home.process.s2',
      titleAr: 'حصاد وتجهيز دقيق',
      titleEn: 'Careful Harvest & Processing',
      descAr: 'يتم الحصاد في الوقت المثالي لضمان تركيز الزيوت العطرية والفوائد الصحية، متبوعاً بمعالجة في منشآت معتمدة عالمياً.',
      descEn: 'Harvested at the perfect time to ensure concentrated essential oils and health benefits, followed by processing in globally certified facilities.',
    },
    {
      icon: Globe,
      key: 'home.process.s3',
      titleAr: 'تصدير عالمي',
      titleEn: 'Global Export',
      descAr: 'نصل بجودة مزارعنا المصرية إلى كل ركن في العالم بمعايير دولية. نشحن منتجاتنا بسرعة وأمان لشركائنا حول العالم.',
      descEn: 'Delivering the quality of our Egyptian farms to every corner of the world with international standards. We ship quickly and safely to our global partners.',
    },
    {
      icon: ShieldCheck,
      key: 'home.process.s4',
      titleAr: 'ثقة وجودة معتمدة',
      titleEn: 'Certified Quality',
      descAr: 'نلتزم بكافة المعايير الدولية والشهادات التي تضمن وصول منتج آمن وفعال لعملائنا في كل مكان.',
      descEn: 'We adhere to all international standards and certificates that ensure a safe and effective product reaches our customers everywhere.',
    },
  ];

  return (
    <section ref={containerRef} className="py-24 bg-[#1c4b42] relative overflow-hidden">
      <EditableSection sectionId="process">
        {/* Progress Line - Storytelling */}
        <div className="absolute left-1/2 top-60 bottom-60 w-1 bg-white/10 -translate-x-1/2 hidden md:block" />
        <motion.div 
          style={{ scaleY, originY: 0 }}
          className="absolute left-1/2 top-60 bottom-60 w-1 bg-[#b4e717] -translate-x-1/2 hidden md:block z-10 shadow-[0_0_20px_#b4e717]" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#b4e717] text-sm font-bold mb-6 uppercase tracking-widest"
            >
              <EditableText contentKey="home.process.badge" defaultAr="رحلة الرحيق" defaultEn="Alraheeq Journey" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-2xl lg:text-4xl font-bold text-white ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
            >
              <EditableText contentKey="home.process.title" defaultAr="من مزارعنا" defaultEn="From Our Farms" />{' '}
              <span className="text-[#b4e717]">
                <EditableText contentKey="home.process.titleAccent" defaultAr="إلى العالم" defaultEn="To The World" />
              </span>
            </motion.h2>
          </div>

          <div className="space-y-40 relative">
            {steps.map((step, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                {/* Content */}
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex-1 text-center md:text-left rtl:md:text-right"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 text-[#b4e717] mb-8 shadow-2xl">
                    <step.icon className="w-12 h-12" />
                  </div>
                  <h3 className={`text-2xl md:text-3xl font-black text-white mb-6 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                    <EditableText contentKey={`${step.key}.title`} defaultAr={step.titleAr} defaultEn={step.titleEn} />
                  </h3>
                  <p className="text-xl text-white/60 leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
                    <EditableText contentKey={`${step.key}.desc`} defaultAr={step.descAr} defaultEn={step.descEn} />
                  </p>
                </motion.div>

                {/* Visual Connector / Number */}
                <div className="relative z-20">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="w-20 h-20 rounded-full bg-[#1c4b42] border-4 border-[#b4e717] flex items-center justify-center text-[#b4e717] font-black text-2xl shadow-[0_0_30px_rgba(180,231,23,0.4)]"
                  >
                    {i + 1}
                  </motion.div>
                </div>

                {/* Placeholder for alignment */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </EditableSection>
    </section>
  );
}

function WhyUsSection() {
  const { isRTL } = useLanguage();

  const reasons = [
    {
      icon: Award,
      titleKey: 'home.why.r1Title',
      textKey: 'home.why.r1Text',
      titleAr: 'جودة لا تضاهى',
      titleEn: 'Unmatched Quality',
      textAr: 'منتجاتنا تخضع لفحوصات جودة صارمة من المزرعة وحتى الشحن.',
      textEn: 'Our products undergo strict quality checks from farm to shipping.',
    },
    {
      icon: Globe,
      titleKey: 'home.why.r2Title',
      textKey: 'home.why.r2Text',
      titleAr: 'تغطية عالمية',
      titleEn: 'Global Reach',
      textAr: 'نصدر إلى أكثر من 30 دولة في أوروبا، آسيا، والأمريكتين.',
      textEn: 'We export to over 30 countries in Europe, Asia, and the Americas.',
    },
    {
      icon: Package,
      titleKey: 'home.why.r3Title',
      textKey: 'home.why.r3Text',
      titleAr: 'تعبئة مخصصة',
      titleEn: 'Custom Packaging',
      textAr: 'خيارات تعبئة وتغليف مرنة تناسب احتياجات علامتك التجارية.',
      textEn: 'Flexible packaging options to suit your brand needs.',
    },
    {
      icon: Users,
      titleKey: 'home.why.r4Title',
      textKey: 'home.why.r4Text',
      titleAr: 'شراكة موثوقة',
      titleEn: 'Trusted Partnership',
      textAr: 'نحن لا نبيع فقط، بل نبني شراكات طويلة الأمد مع عملائنا.',
      textEn: 'We dont just sell; we build long-term partnerships with our clients.',
    },
  ];

  return (
    <section className="py-32 bg-gray-50 relative overflow-hidden">
      <EditableSection sectionId="why">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c4b42]/5 border border-[#1c4b42]/10 text-[#1c4b42] text-sm font-bold mb-6 uppercase tracking-widest"
            >
              <EditableText contentKey="home.why.badge" defaultAr="لماذا الرحيق؟" defaultEn="Why Alraheeq?" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`text-2xl lg:text-4xl font-bold text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
            >
              <EditableText contentKey="home.why.title" defaultAr="شريكك الموثوق" defaultEn="Your Trusted Partner" />{' '}
              <span className="text-[#b4e717]">
                <EditableText contentKey="home.why.titleAccent" defaultAr="للنجاح" defaultEn="For Success" />
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 hover:border-[#b4e717]/30 transition-all duration-500 group"
              >
                <div className="w-20 h-20 rounded-3xl bg-[#1c4b42]/5 flex items-center justify-center mb-8 group-hover:bg-[#1c4b42] transition-all duration-500">
                  <reason.icon className="w-10 h-10 text-[#1c4b42] group-hover:text-[#b4e717] transition-all" />
                </div>
                <h3 className={`text-2xl font-bold text-[#1c4b42] mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                  <EditableText contentKey={reason.titleKey} defaultAr={reason.titleAr} defaultEn={reason.titleEn} />
                </h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  <EditableText contentKey={reason.textKey} defaultAr={reason.textAr} defaultEn={reason.textEn} />
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </EditableSection>
    </section>
  );
}

function CategoriesSection() {
  const { isRTL, getPath } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const categories = [
    {
      href: '/products?cat=herbs',
      labelKey: 'home.categories.c1Label',
      descKey: 'home.categories.c1Desc',
      labelAr: 'أعشاب ونباتات',
      labelEn: 'Herbs & Botanicals',
      descAr: 'نعناع، بابونج، كركديه والمزيد',
      descEn: 'Peppermint, Chamomile, Hibiscus & more',
      imageKey: 'home.categories.c1Img',
      image: '/uploads/general/herbs_cat.jpg',
    },
    {
      href: '/products?cat=seeds',
      labelKey: 'home.categories.c2Label',
      descKey: 'home.categories.c2Desc',
      labelAr: 'بذور وحبوب',
      labelEn: 'Seeds & Grains',
      descAr: 'يانسون، كراوية، حبة البركة',
      descEn: 'Anise, Caraway, Black Seed',
      imageKey: 'home.categories.c2Img',
      image: '/uploads/general/seeds_cat.jpeg',
    },
    {
      href: '/products?cat=spices',
      labelKey: 'home.categories.c3Label',
      descKey: 'home.categories.c3Desc',
      labelAr: 'توابل وبهارات',
      labelEn: 'Spices',
      descAr: 'كزبرة، كمون، شمر',
      descEn: 'Coriander, Cumin, Fennel',
      imageKey: 'home.categories.c3Img',
      image: '/uploads/general/spices_cat.jpg',
    },
    {
      href: '/products?cat=dehydrated',
      labelKey: 'home.categories.c4Label',
      descKey: 'home.categories.c4Desc',
      labelAr: 'خضروات مجففة',
      labelEn: 'Dehydrated Veggies',
      descAr: 'بصل، ثوم، بقدونس مجفف',
      descEn: 'Dried Onion, Garlic, Parsley',
      imageKey: 'home.categories.c4Img',
      image: '/uploads/general/veggies_cat.jpg',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EditableSection sectionId="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c4b42]/5 border border-[#1c4b42]/10 text-[#1c4b42] text-sm font-bold mb-6 uppercase tracking-widest"
              >
                <EditableText contentKey="home.categories.badge" defaultAr="فئات المنتجات" defaultEn="Product Categories" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`text-3xl lg:text-5xl font-black text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
              >
                <EditableText contentKey="home.categories.title" defaultAr="استكشف" defaultEn="Explore" />{' '}
                <span className="text-[#b4e717]">
                  <EditableText contentKey="home.categories.titleAccent" defaultAr="محاصيلنا" defaultEn="Our Harvest" />
                </span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <EditableButton
                contentKey="home.categories.viewAll"
                defaultAr="عرض كل المنتجات"
                defaultEn="View All Products"
                defaultHref="/products"
                className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border-2 border-[#1c4b42] text-[#1c4b42] font-bold hover:bg-[#1c4b42] hover:text-white transition-all duration-500"
                icon={<Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15 }}
                className="group relative aspect-[3/4] rounded-[3.5rem] overflow-hidden shadow-2xl"
              >
                <EditableImage
                  contentKey={cat.imageKey}
                  defaultSrc={cat.image}
                  alt={cat.labelEn}
                  imgClassName="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c4b42] via-[#1c4b42]/20 to-transparent pointer-events-none" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end pointer-events-none">
                  <h3 className="text-3xl font-black text-white mb-3 pointer-events-auto">
                    <EditableText contentKey={cat.labelKey} defaultAr={cat.labelAr} defaultEn={cat.labelEn} />
                  </h3>
                  <p className="text-white/70 font-medium mb-8 pointer-events-auto">
                    <EditableText contentKey={cat.descKey} defaultAr={cat.descAr} defaultEn={cat.descEn} />
                  </p>
                  <div className="pointer-events-auto">
                    <Link 
                      to={getPath(cat.href)} 
                      className="inline-flex items-center gap-3 text-[#b4e717] font-black uppercase tracking-tighter group/link"
                    >
                      <span>{isRTL ? 'استكشف الفئة' : 'Explore Category'}</span>
                      <Arrow className="w-5 h-5 transition-transform group-hover/link:translate-x-2" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </EditableSection>
    </section>
  );
}

function TestimonialsSection() {
  const { isRTL } = useLanguage();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-[#1c4b42] relative overflow-hidden">
      <EditableSection sectionId="testimonials">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#b4e717]/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#b4e717]/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#b4e717] text-sm font-bold mb-6 uppercase tracking-widest"
            >
              <EditableText contentKey="home.testimonials.badge" defaultAr="قالوا عنا" defaultEn="Testimonials" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`text-3xl lg:text-5xl font-black text-white ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
            >
              <EditableText contentKey="home.testimonials.title" defaultAr="ثقة شركائنا" defaultEn="Our Partners' Trust" />{' '}
              <span className="text-[#b4e717]">
                <EditableText contentKey="home.testimonials.titleAccent" defaultAr="حول العالم" defaultEn="Worldwide" />
              </span>
            </motion.h2>
          </div>

          <div className="relative h-[450px] md:h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: isRTL ? -100 : 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: isRTL ? 100 : -100, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div className="glass-card-dark rounded-[3.5rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
                  {/* Large Quote Mark */}
                  <div className="absolute top-10 left-10 opacity-10">
                    <Play className="w-24 h-24 text-[#b4e717] rotate-180" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-center gap-2 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-[#b4e717] text-[#b4e717]" />
                      ))}
                    </div>

                    <p className="text-2xl md:text-3xl font-medium text-white/90 italic leading-relaxed mb-10">
                      "{isRTL ? testimonials[current].textAr : testimonials[current].textEn}"
                    </p>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#b4e717] flex items-center justify-center text-[#1c4b42] font-black text-xl mb-4">
                        {(isRTL ? testimonials[current]?.nameAr : testimonials[current]?.nameEn)?.[0] || 'A'}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-1">
                        {isRTL ? testimonials[current]?.nameAr : testimonials[current]?.nameEn}
                      </h4>
                      <p className="text-[#b4e717] font-bold text-sm uppercase tracking-widest">
                        {isRTL ? testimonials[current]?.roleAr : testimonials[current]?.roleEn}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  current === i ? 'w-10 bg-[#b4e717]' : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </EditableSection>
    </section>
  );
}

function CTASection() {
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-24 relative overflow-hidden bg-[#1c4b42]">
      <EditableSection sectionId="cta">
        {/* Background Decorative */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pattern-grid" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b4e717]/20 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card-dark rounded-[3rem] p-10 md:p-20 border border-white/10 shadow-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#b4e717] text-sm font-bold mb-6 uppercase tracking-widest"
            >
              <EditableText contentKey="home.cta.badge" defaultAr="لنبدأ العمل" defaultEn="Let's Work Together" />
            </motion.div>

            <h2 className={`text-2xl md:text-5xl font-bold text-white mb-6 leading-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText contentKey="home.cta.title" defaultAr="هل أنت جاهز لتجربة" defaultEn="Ready to Experience" />{' '}
              <span className="text-[#b4e717]">
                <EditableText contentKey="home.cta.titleAccent" defaultAr="الجودة الحقيقية؟" defaultEn="True Quality?" />
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
              <EditableText 
                contentKey="home.cta.text" 
                defaultAr="فريقنا جاهز لتلبية احتياجاتك بأفضل الأسعار وأعلى جودة تصدير مصرية." 
                defaultEn="Our team is ready to meet your needs with the best prices and highest Egyptian export quality." 
              />
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <EditableButton 
                contentKey="home.cta.btn1"
                defaultAr="تواصل معنا الآن"
                defaultEn="Contact Us Now"
                defaultHref="/contact"
                className="group w-full sm:w-auto px-12 py-6 rounded-full bg-[#b4e717] text-[#1c4b42] font-black text-xl shadow-[0_15px_40px_rgba(180,231,23,0.3)] hover:shadow-[0_20px_50px_rgba(180,231,23,0.5)] transition-all duration-500 hover:-translate-y-1"
                icon={<Arrow className="w-6 h-6 transition-transform group-hover:translate-x-2" />}
              />
              <EditableButton 
                contentKey="home.cta.btn2"
                defaultAr="عرض الكتالوج"
                defaultEn="View Catalog"
                defaultHref="/products"
                className="w-full sm:w-auto px-12 py-6 rounded-full border-2 border-white/20 text-white font-black text-xl hover:bg-white hover:text-[#1c4b42] hover:border-white transition-all duration-500"
              />
            </div>
          </motion.div>
        </div>
      </EditableSection>
    </section>
  );
}

function TrustBar() {
  const { isRTL } = useLanguage();
  
  const items = [
    { icon: ShieldCheck, key: 'home.trust.1', ar: 'جودة معتمدة', en: 'Certified Quality' },
    { icon: MapPin, key: 'home.trust.2', ar: 'من مزارعنا', en: 'Direct from Farms' },
    { icon: Package, key: 'home.trust.3', ar: 'تعبئة مخصصة', en: 'Custom Packaging' },
    { icon: Award, key: 'home.trust.4', ar: 'خبرة عالمية', en: 'Global Export Expert' },
  ];

  return (
    <section className="bg-white border-b border-gray-100 py-12 relative overflow-hidden">
      <EditableSection sectionId="trustBar">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1c4b42]/5 flex items-center justify-center group-hover:bg-[#1c4b42] transition-all duration-500">
                  <item.icon className="w-6 h-6 text-[#1c4b42] group-hover:text-[#b4e717] transition-all" />
                </div>
                <div className="flex flex-col">
                  <EditableText 
                    contentKey={item.key}
                    defaultAr={item.ar}
                    defaultEn={item.en}
                    className="text-sm font-black text-[#1c4b42] uppercase tracking-widest"
                  />
                  <span className="text-xs font-bold text-gray-400">Verified Service</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </EditableSection>
    </section>
  );
}

// Featured Products
function FeaturedProducts() {
  const { isRTL, getPath } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getAll().then(res => res.data),
  });

  const featured = Array.isArray(response) ? response.slice(0, 4) : (response?.data?.slice(0, 4) || []);

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <EditableSection sectionId="featuredProducts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c4b42]/5 border border-[#1c4b42]/10 text-[#1c4b42] text-sm font-bold mb-6 uppercase tracking-widest"
              >
                <EditableText contentKey="home.featured.badge" defaultAr="المنتجات المميزة" defaultEn="Featured Products" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`text-3xl lg:text-5xl font-black text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
              >
                <EditableText contentKey="home.featured.title" defaultAr="أجود أنواع" defaultEn="Premium Quality" />{' '}
                <span className="text-[#b4e717]">
                  <EditableText contentKey="home.featured.titleAccent" defaultAr="منتجاتنا" defaultEn="Our Products" />
                </span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <EditableButton 
                contentKey="home.featured.viewAll"
                defaultAr="عرض جميع المنتجات"
                defaultEn="View All Products"
                defaultHref="/products"
                className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border-2 border-[#1c4b42] text-[#1c4b42] font-bold hover:bg-[#1c4b42] hover:text-white transition-all duration-500"
                icon={<Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
              />
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[450px] rounded-[3rem] bg-white animate-pulse shadow-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500 font-bold">
              Error loading products.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {featured.map((product: any, i: number) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </EditableSection>
    </section>
  );
}
function CertificatesSection() {
  const { isRTL } = useLanguage();
  const { data: certs, isLoading } = useQuery({
    queryKey: ['home-certs'],
    queryFn: () => certificateApi.getAll().then(res => res.data),
  });

  if (!isLoading && (!certs || certs.length === 0)) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EditableSection sectionId="certificates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c4b42]/5 border border-[#1c4b42]/10 text-[#1c4b42] text-sm font-bold mb-6 uppercase tracking-widest"
            >
              <EditableText contentKey="home.certs.badge" defaultAr="الشهادات" defaultEn="Certifications" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`text-4xl lg:text-5xl font-black text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
            >
              <EditableText contentKey="home.certs.title" defaultAr="اعتمادات" defaultEn="Global" />{' '}
              <span className="text-[#b4e717]">
                <EditableText contentKey="home.certs.titleAccent" defaultAr="دولية" defaultEn="Certificates" />
              </span>
            </motion.h2>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            {isLoading ? (
              [...Array(4)].map((_, i) => <div key={i} className="w-32 h-32 bg-gray-100 rounded-3xl animate-pulse" />)
            ) : certs.map((cert: any, i: number) => {
              let title = { ar: '', en: '' };
              try {
                title = typeof cert.title === 'string' ? JSON.parse(cert.title) : (cert.title || title);
              } catch (e) { console.error(e); }
              
              return (
                <motion.div 
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group flex flex-col items-center gap-6"
                >
                  <div className="w-40 h-40 p-6 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex items-center justify-center group-hover:border-[#b4e717] transition-all duration-500">
                    <img 
                      src={cert.image_url} 
                      alt={isRTL ? title.ar : title.en} 
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <span className="text-sm font-black text-[#1c4b42]/40 group-hover:text-[#1c4b42] text-center uppercase tracking-widest transition-colors">
                    {isRTL ? title.ar : title.en}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </EditableSection>
    </section>
  );
}

function FeaturedBlog() {
  const { isRTL, getPath } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const { data: response, isLoading } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: () => blogApi.getAll().then(res => res.data),
  });

  const posts = Array.isArray(response) ? response : (response?.data || []);
  const featured = posts.slice(0, 3);

  if (!isLoading && featured.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EditableSection sectionId="blog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c4b42]/5 border border-[#1c4b42]/10 text-[#1c4b42] text-sm font-bold mb-6 uppercase tracking-widest"
              >
                <EditableText contentKey="home.blog.badge" defaultAr="المدونة" defaultEn="Our Blog" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`text-3xl lg:text-5xl font-black text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
              >
                <EditableText contentKey="home.blog.title" defaultAr="آخر" defaultEn="Latest" />{' '}
                <span className="text-[#b4e717]">
                  <EditableText contentKey="home.blog.titleAccent" defaultAr="الأخبار والمقالات" defaultEn="News & Insights" />
                </span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <EditableButton
                contentKey="home.blog.viewAll"
                defaultAr="زيارة المدونة"
                defaultEn="Visit Blog"
                defaultHref="/blog"
                className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border-2 border-[#1c4b42] text-[#1c4b42] font-bold hover:bg-[#1c4b42] hover:text-white transition-all duration-500"
                icon={<Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-96 rounded-[3rem] bg-gray-100 animate-pulse" />
              ))
            ) : (
              featured.map((post: any, i: number) => {
                const titleStr = getSafeValue(post.title, isRTL ? 'ar' : 'en');
                
                return (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    <Link to={getPath(`/blog/${post.slug}`)} className="block aspect-video overflow-hidden">
                      <img src={post.image_url} alt={titleStr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </Link>
                    <div className="p-10">
                      <h3 className={`text-2xl font-bold text-[#1c4b42] mb-6 group-hover:text-[#b4e717] transition-colors leading-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                        {titleStr}
                      </h3>
                      <Link 
                        to={getPath(`/blog/${post.slug}`)} 
                        className="inline-flex items-center gap-3 text-[#1c4b42] font-black uppercase tracking-tighter group/link"
                      >
                        <span>{isRTL ? 'اقرأ المزيد' : 'Read More'}</span>
                        <Arrow className="w-5 h-5 transition-transform group-hover/link:translate-x-2" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })
            )}
          </div>
        </div>
      </EditableSection>
    </section>
  );
}
export default function Index() {
  useScrollProgress();
  useRevealObserver();

  return (
    <main>
      <HeroSection />
      <TrustBar />
      <WhyUsSection />
      <IntroSection />
      <ProcessSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <FeaturedBlog />
      <CertificatesSection />
      <CTASection />
    </main>
  );
}
