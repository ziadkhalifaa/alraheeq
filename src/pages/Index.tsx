import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Play, CheckCircle2, Star, ChevronLeft, ChevronRight, Leaf, Package, Award, Users, ShieldCheck, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useScrollReveal } from '@/hooks/useScrollReveal';
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

  useEffect(() => {
    const img = new Image();
    img.src = heroImage;
    img.onload = () => setBgLoaded(true);
  }, []);

  const stats = [
    { icon: Users, value: '200+', label: isRTL ? 'عميل عالمي' : 'Global Clients' },
    { icon: Package, value: '50+', label: isRTL ? 'منتج معتمد' : 'Certified Products' },
    { icon: Award, value: '30+', label: isRTL ? 'دولة تصدير' : 'Export Countries' },
    { icon: Star, value: '15+', label: isRTL ? 'سنوات خبرة' : 'Years Experience' },
  ];

  return (
    <section className="hero-section relative overflow-hidden">
      <EditableSection sectionId="hero">
      {/* Background */}
      <div className={`hero-bg ${bgLoaded ? 'loaded' : ''}`}>
        <EditableImage 
          contentKey="home.hero.bgImage" 
          defaultSrc={heroImage} 
          alt="Egyptian herbs and spices" 
        />
      </div>
      <div className="hero-overlay" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 rounded-full bg-brand-gold/30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
        {/* Floating leaves */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <Leaf className="w-full h-full text-brand-gold" />
        </div>
        <div className="absolute top-1/3 left-1/5 w-10 h-10 opacity-15 animate-float" style={{ animationDelay: '2.5s' }}>
          <Leaf className="w-full h-full text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <EditableText 
                contentKey="home.hero.badge"
                defaultAr="شركة الرحيق للأعشاب والتمور - جودة عالمية"
                defaultEn="Al-Raheeq Herbs & Dates - Global Quality"
              />
            </span>
          </div>

          {/* Main Heading */}
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="home.hero.title1"
              defaultAr="تصدير أجود أنواع"
              defaultEn="Exporting the Finest"
            />{' '}
            <EditableText 
              className="text-gradient-gold"
              contentKey="home.hero.title2"
              defaultAr="الأعشاب المصرية"
              defaultEn="Egyptian Herbs"
            />
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white/80">
              <EditableText 
                contentKey="home.hero.title3"
                defaultAr="إلى جميع أنحاء العالم"
                defaultEn="To The Entire World"
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]">
            <EditableText 
              contentKey="home.hero.subtitle"
              defaultAr="نحن متخصصون في زراعة وتجهيز وتصدير أفضل أنواع الأعشاب والتمور والبذور المصرية بأعلى معايير الجودة العالمية."
              defaultEn="We specialize in growing, processing, and exporting the finest Egyptian herbs, dates, and seeds with the highest global quality standards."
            />
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards]">
            <EditableButton 
              contentKey="home.hero.btn1"
              defaultAr="اطلب تسعيرة الآن"
              defaultEn="Request a Quote"
              defaultHref="/contact"
              className="btn-magnetic w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-brand-gold text-white font-bold text-lg shadow-gold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              icon={<Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            />
            <EditableButton 
              contentKey="home.hero.btn2"
              defaultAr="عرض المنتجات"
              defaultEn="View Products"
              defaultHref="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl glass border border-white/30 text-white font-bold text-lg hover:bg-white/20 transition-all duration-300 group"
              icon={<Play className="w-4 h-4 fill-white" />}
            />
          </div>

          {/* Decorative scroll hint */}
          <div className="mt-16 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards]">
            <span className="text-white/40 text-xs tracking-widest uppercase">
              <EditableText 
                contentKey="home.hero.scrollHint"
                defaultAr="اكتشف المزيد"
                defaultEn="Discover More"
              />
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-5xl mx-auto px-4">
            <div className="glass border-t border-white/10 border-x-0 border-b-0 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10 rtl:divide-x-reverse">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-1 py-5 px-4">
                  <stat.icon className="w-5 h-5 text-brand-gold mb-1" />
                  <EditableText 
                    contentKey={`home.hero.stat${i}.value`}
                    defaultAr={stat.value}
                    defaultEn={stat.value}
                    className="text-2xl font-bold text-white"
                  />
                  <EditableText 
                    contentKey={`home.hero.stat${i}.label`}
                    defaultAr={stat.label}
                    defaultEn={stat.label}
                    className="text-white/50 text-xs text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EditableSection>
  </section>
  );
}

function IntroSection() {
  const { t, isRTL, getPath } = useLanguage();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  const features = [
    { contentKey: 'home.intro.feature1', defaultAr: 'أعشاب عضوية 100%', defaultEn: '100% Organic Herbs' },
    { contentKey: 'home.intro.feature2', defaultAr: 'معايير جودة عالمية', defaultEn: 'Global Quality Standards' },
    { contentKey: 'home.intro.feature3', defaultAr: 'أسعار تنافسية', defaultEn: 'Competitive Pricing' },
    { contentKey: 'home.intro.feature4', defaultAr: 'شحن سريع وموثوق', defaultEn: 'Fast & Reliable Shipping' },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EditableSection sectionId="intro">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image collage */}
          <div className={`animate-reveal-${isRTL ? 'right' : 'left'} relative`}>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="img-zoom rounded-2xl overflow-hidden h-48 shadow-brand">
                    <EditableImage
                      contentKey="home.intro.img1"
                      defaultSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80&auto=format&fit=crop"
                      alt="Egyptian herbs"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>
                  <div className="img-zoom rounded-2xl overflow-hidden h-32 shadow-brand">
                    <EditableImage
                      contentKey="home.intro.img2"
                      defaultSrc="https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=400&q=80&auto=format&fit=crop"
                      alt="Spices"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="img-zoom rounded-2xl overflow-hidden h-32 shadow-brand">
                    <EditableImage
                      contentKey="home.intro.img3"
                      defaultSrc="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop"
                      alt="Seeds"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>
                  <div className="img-zoom rounded-2xl overflow-hidden h-48 shadow-brand">
                    <EditableImage
                      contentKey="home.intro.img4"
                      defaultSrc="https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80&auto=format&fit=crop"
                      alt="Chamomile"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 glass-card rounded-2xl p-4 shadow-brand animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-brand-green">100%</div>
                    <div className="text-xs text-gray-500">{isRTL ? 'طبيعي وموثوق' : 'Natural & Trusted'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className={`animate-reveal-${isRTL ? 'left' : 'right'}`}>
            <SectionBadge className="mb-4">
              <EditableText 
                contentKey="home.intro.badge"
                defaultAr="عن الرحيق"
                defaultEn="About Al-Raheeq"
              />
            </SectionBadge>
            <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText 
                contentKey="home.intro.title"
                defaultAr="جذورنا في الأرض"
                defaultEn="Our Roots in the Earth"
              />{' '}
              <EditableText 
                className="text-gradient"
                contentKey="home.intro.titleAccent"
                defaultAr="ورؤيتنا للعالم"
                defaultEn="Our Vision for the World"
              />
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              <EditableText 
                contentKey="home.intro.text1"
                defaultAr="منذ تأسيسنا، التزمنا بتقديم أفضل المنتجات الزراعية المصرية للأسواق العالمية."
                defaultEn="Since our founding, we have been committed to providing the best Egyptian agricultural products to global markets."
              />
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              <EditableText 
                contentKey="home.intro.text2"
                defaultAr="نعمل مباشرة مع المزارعين لضمان الجودة والاستدامة في كل خطوة."
                defaultEn="We work directly with farmers to ensure quality and sustainability at every step."
              />
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className={`animate-scale-in stagger-${i + 1} flex items-center gap-2.5 p-3 rounded-xl bg-brand-green/5 border border-brand-green/10`}
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />
                  <EditableText 
                    contentKey={feature.contentKey}
                    defaultAr={feature.defaultAr}
                    defaultEn={feature.defaultEn}
                    className="text-sm font-medium text-gray-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EditableSection>
  </section>
  );
}

function ProcessSection() {
  const { t, isRTL, getPath } = useLanguage();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  const steps = [
    {
      number: '01',
      titleKey: 'home.process.step1Title',
      textKey: 'home.process.step1Text',
      titleAr: 'زراعة مستدامة',
      titleEn: 'Sustainable Farming',
      textAr: 'نختار أفضل الأراضي الزراعية والمزارعين لضمان زراعة عضوية 100%.',
      textEn: 'We select the best agricultural lands and farmers to ensure 100% organic farming.',
      icon: '🌿',
      color: 'from-emerald-400 to-brand-green',
    },
    {
      number: '02',
      titleKey: 'home.process.step2Title',
      textKey: 'home.process.step2Text',
      titleAr: 'حصاد وتجهيز دقيق',
      titleEn: 'Careful Harvest & Processing',
      textAr: 'نحصد في الوقت المثالي ونجهز المحاصيل في منشآت معتمدة عالمياً.',
      textEn: 'We harvest at the perfect time and process crops in globally certified facilities.',
      icon: '🔍',
      color: 'from-brand-green to-brand-olive',
    },
    {
      number: '03',
      titleKey: 'home.process.step3Title',
      textKey: 'home.process.step3Text',
      titleAr: 'تصدير عالمي',
      titleEn: 'Global Export',
      textAr: 'نشحن منتجاتنا بسرعة وأمان إلى شركائنا في جميع أنحاء العالم.',
      textEn: 'We ship our products quickly and safely to our partners worldwide.',
      icon: '🚢',
      color: 'from-brand-olive to-brand-gold',
    },
  ];

  return (
    <section className="py-24 bg-brand-beige relative overflow-hidden pattern-dots">
      <EditableSection sectionId="process">
      {/* Decorative */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-reveal">
          <SectionBadge className="mb-4">
            <EditableText 
              contentKey="home.process.badge"
              defaultAr="رحلة الرحيق"
              defaultEn="The Al-Raheeq Journey"
            />
          </SectionBadge>
          <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mt-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="home.process.title"
              defaultAr="من مزارعنا"
              defaultEn="From Our Farms"
            />{' '}
            <EditableText 
              className="text-gradient"
              contentKey="home.process.titleAccent"
              defaultAr="إلى العالم"
              defaultEn="To The World"
            />
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-brand-green via-brand-olive to-brand-gold" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`animate-reveal stagger-${i + 1} relative group`}
              >
                {/* Card */}
                <div className="glass-card rounded-3xl p-8 hover:shadow-brand-lg transition-all duration-500 hover:-translate-y-2">
                  {/* Number badge */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl mb-6 shadow-brand group-hover:scale-110 transition-transform`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-4">{step.icon}</div>

                  <h3 className={`text-xl font-bold text-gray-900 mb-3 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                    <EditableText 
                      contentKey={step.titleKey}
                      defaultAr={step.titleAr}
                      defaultEn={step.titleEn}
                    />
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    <EditableText 
                      contentKey={step.textKey}
                      defaultAr={step.textAr}
                      defaultEn={step.textEn}
                    />
                  </p>
                </div>

                {/* Arrow (between cards) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 -right-6 z-10 w-12 h-12 items-center justify-center">
                    {isRTL
                      ? <ChevronLeft className="w-8 h-8 text-brand-green/40" />
                      : <ChevronRight className="w-8 h-8 text-brand-green/40" />
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </EditableSection>
  </section>
  );
}

function WhyUsSection() {
  const { t, isRTL, getPath } = useLanguage();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  const reasons = [
    {
      icon: '⭐',
      titleKey: 'home.why.r1Title',
      textKey: 'home.why.r1Text',
      titleAr: 'جودة لا تضاهى',
      titleEn: 'Unmatched Quality',
      textAr: 'منتجاتنا تخضع لفحوصات جودة صارمة من المزرعة وحتى الشحن.',
      textEn: 'Our products undergo strict quality checks from farm to shipping.',
      gradient: 'from-brand-green/10 to-emerald-50',
      border: 'border-brand-green/20',
    },
    {
      icon: '🌐',
      titleKey: 'home.why.r2Title',
      textKey: 'home.why.r2Text',
      titleAr: 'تغطية عالمية',
      titleEn: 'Global Reach',
      textAr: 'نصدر إلى أكثر من 30 دولة في أوروبا، آسيا، والأمريكتين.',
      textEn: 'We export to over 30 countries in Europe, Asia, and the Americas.',
      gradient: 'from-brand-olive/10 to-lime-50',
      border: 'border-brand-olive/20',
    },
    {
      icon: '📦',
      titleKey: 'home.why.r3Title',
      textKey: 'home.why.r3Text',
      titleAr: 'تعبئة مخصصة',
      titleEn: 'Custom Packaging',
      textAr: 'خيارات تعبئة وتغليف مرنة تناسب احتياجات علامتك التجارية.',
      textEn: 'Flexible packaging options to suit your brand needs.',
      gradient: 'from-blue-50 to-cyan-50',
      border: 'border-blue-100',
    },
    {
      icon: '🤝',
      titleKey: 'home.why.r4Title',
      textKey: 'home.why.r4Text',
      titleAr: 'شراكة موثوقة',
      titleEn: 'Trusted Partnership',
      textAr: 'نحن لا نبيع فقط، بل نبني شراكات طويلة الأمد مع عملائنا.',
      textEn: 'We dont just sell; we build long-term partnerships with our clients.',
      gradient: 'from-brand-gold/10 to-amber-50',
      border: 'border-brand-gold/20',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EditableSection sectionId="why">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-reveal">
          <SectionBadge className="mb-4">
            <EditableText 
              contentKey="home.why.badge"
              defaultAr="لماذا الرحيق؟"
              defaultEn="Why Al-Raheeq?"
            />
          </SectionBadge>
          <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mt-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="home.why.title"
              defaultAr="شريكك الموثوق"
              defaultEn="Your Trusted Partner"
            />{' '}
            <EditableText 
              className="text-gradient"
              contentKey="home.why.titleAccent"
              defaultAr="للنجاح"
              defaultEn="For Success"
            />
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className={`animate-scale-in stagger-${i + 1} group relative p-6 rounded-3xl border ${reason.border} bg-gradient-to-br ${reason.gradient} hover:shadow-brand-lg transition-all duration-500 hover:-translate-y-2`}
            >
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
                {reason.icon}
              </div>
              <h3 className={`text-lg font-bold text-gray-900 mb-3 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                <EditableText 
                  contentKey={reason.titleKey}
                  defaultAr={reason.titleAr}
                  defaultEn={reason.titleEn}
                />
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                <EditableText 
                  contentKey={reason.textKey}
                  defaultAr={reason.textAr}
                  defaultEn={reason.textEn}
                />
              </p>

              {/* Decorative corner */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditableSection>
  </section>
  );
}

function CategoriesSection() {
  const { t, isRTL, getPath } = useLanguage();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
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
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80&auto=format&fit=crop',
      color: 'from-emerald-900/80 to-brand-green/60',
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
      image: 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=600&q=80&auto=format&fit=crop',
      color: 'from-amber-900/80 to-amber-700/60',
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
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80&auto=format&fit=crop',
      color: 'from-red-900/80 to-orange-700/60',
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
      image: 'https://images.unsplash.com/photo-1618512496248-a07e43164f87?w=600&q=80&auto=format&fit=crop',
      color: 'from-green-900/80 to-lime-700/60',
    },
  ];

  return (
    <section className="py-24 bg-brand-beige relative overflow-hidden">
      <EditableSection sectionId="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div className="animate-reveal">
            <SectionBadge className="mb-3">
              <EditableText 
                contentKey="home.categories.badge"
                defaultAr="فئات المنتجات"
                defaultEn="Product Categories"
              />
            </SectionBadge>
            <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText 
                contentKey="home.categories.title"
                defaultAr="استكشف"
                defaultEn="Explore"
              />{' '}
              <EditableText 
                className="text-gradient"
                contentKey="home.categories.titleAccent"
                defaultAr="محاصيلنا"
                defaultEn="Our Harvest"
              />
            </h2>
          </div>
          <EditableButton
            contentKey="home.categories.viewAll"
            defaultAr="عرض كل المنتجات"
            defaultEn="View All Products"
            defaultHref="/products"
            className="animate-reveal inline-flex items-center gap-2 text-brand-green font-medium hover:text-brand-green-dark transition-colors shrink-0"
            icon={<Arrow className="w-4 h-4" />}
          />
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`animate-scale-in stagger-${i + 1} group relative rounded-3xl overflow-hidden h-72 block`}
            >
              <EditableImage
                contentKey={cat.imageKey}
                defaultSrc={cat.image}
                alt={cat.labelEn}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover img-zoom"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} pointer-events-none`} />
              <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
                <h3 className="text-white font-bold text-xl mb-1 pointer-events-auto">
                  <EditableText contentKey={cat.labelKey} defaultAr={cat.labelAr} defaultEn={cat.labelEn} />
                </h3>
                <p className="text-white/70 text-sm mb-3 pointer-events-auto">
                  <EditableText contentKey={cat.descKey} defaultAr={cat.descAr} defaultEn={cat.descEn} />
                </p>
                <Link to={getPath(cat.href)} className="inline-flex items-center gap-1.5 text-brand-gold text-sm font-medium group-hover:gap-2.5 transition-all pointer-events-auto w-max">
                  <EditableText contentKey="home.categories.explore" defaultAr="استكشف" defaultEn="Explore" />
                  <Arrow className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditableSection>
  </section>
  );
}

function TestimonialsSection() {
  const { t, isRTL, getPath } = useLanguage();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-brand-gradient relative overflow-hidden">
      <EditableSection sectionId="testimonials">
      {/* Decorative */}
      <div className="absolute inset-0 pattern-dots opacity-10" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-reveal">
          <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
            <EditableText 
              contentKey="home.testimonials.badge"
              defaultAr="شهادات"
              defaultEn="Testimonials"
            />
          </SectionBadge>
          <h2 className={`text-4xl font-bold text-white mb-12 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="home.testimonials.title"
              defaultAr="ماذا يقول"
              defaultEn="What Our"
            />{' '}
            <EditableText 
              className="text-brand-gold"
              contentKey="home.testimonials.titleAccent"
              defaultAr="عملاؤنا"
              defaultEn="Clients Say"
            />
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="animate-scale-in">
          <div className="glass rounded-3xl p-8 md:p-12 mb-8">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 relative">
              <span className={`absolute -top-4 ${isRTL ? 'right-0' : 'left-0'} text-brand-gold text-6xl leading-none opacity-30 font-serif`}>"</span>
              {getSafeValue(testimonials[current].textAr, 'ar')}
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 border-2 border-brand-gold/30 flex items-center justify-center text-xl">
                {getSafeValue(testimonials[current].country, isRTL ? 'ar' : 'en')}
              </div>
              <div className="text-left rtl:text-right">
                <div className="font-semibold text-white">
                  {isRTL ? testimonials[current].nameAr : testimonials[current].nameEn}
                </div>
                <div className="text-white/50 text-sm">
                  {isRTL ? testimonials[current].roleAr : testimonials[current].roleEn}
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-8 h-2.5 bg-brand-gold' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </EditableSection>
  </section>
  );
}

function CTASection() {
  const { t, isRTL, getPath } = useLanguage();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EditableSection sectionId="cta">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-reveal">
          <SectionBadge className="mb-4">
            <EditableText 
              contentKey="home.cta.badge"
              defaultAr="تواصل معنا"
              defaultEn="Contact Us"
            />
          </SectionBadge>
          <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="home.cta.title"
              defaultAr="جاهز لبدء"
              defaultEn="Ready to Start"
            />{' '}
            <EditableText 
              className="text-gradient"
              contentKey="home.cta.titleAccent"
              defaultAr="رحلة نجاحك؟"
              defaultEn="Your Success Journey?"
            />
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            <EditableText 
              contentKey="home.cta.text"
              defaultAr="فريقنا مستعد لتلبية احتياجاتك بأفضل الأسعار وأعلى جودة."
              defaultEn="Our team is ready to meet your needs with the best prices and highest quality."
            />
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <EditableButton 
              contentKey="home.cta.btn1"
              defaultAr="تواصل معنا الآن"
              defaultEn="Contact Us Now"
              defaultHref="/contact"
              className="btn-magnetic w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-brand-gradient text-white font-semibold shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1 group"
              icon={<Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            />
            <EditableButton 
              contentKey="home.cta.btn2"
              defaultAr="تصفح المنتجات"
              defaultEn="Browse Products"
              defaultHref="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-brand-green/30 text-brand-green font-semibold hover:bg-brand-green/5 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </EditableSection>
  </section>
  );
}

// Featured Products
function FeaturedProducts() {
  const { t, isRTL, getPath } = useLanguage();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getAll().then(res => res.data),
  });

  const featured = Array.isArray(response) ? response.slice(0, 4) : (response?.data?.slice(0, 4) || []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EditableSection sectionId="featuredProducts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-12">
          <div className="animate-reveal">
            <SectionBadge className="mb-3">
              <EditableText 
                contentKey="home.featured.badge"
                defaultAr="المنتجات المميزة"
                defaultEn="Featured Products"
              />
            </SectionBadge>
            <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText 
                contentKey="home.featured.title"
                defaultAr="أجود أنواع"
                defaultEn="Premium Quality"
              />{' '}
              <EditableText 
                className="text-gradient"
                contentKey="home.featured.titleAccent"
                defaultAr="منتجاتنا"
                defaultEn="Our Products"
              />
            </h2>
          </div>
          <EditableButton 
            contentKey="home.featured.viewAll"
            defaultAr="عرض جميع المنتجات"
            defaultEn="View All Products"
            defaultHref="/products"
            className="animate-reveal inline-flex items-center gap-2 text-brand-green font-bold hover:gap-3 transition-all"
            icon={<Arrow className="w-4 h-4" />}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500">
            Error loading products.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
  const { isRTL, getPath } = useLanguage();
  const { data: certs, isLoading } = useQuery({
    queryKey: ['home-certs'],
    queryFn: () => certificateApi.getAll().then(res => res.data),
  });

  if (!isLoading && (!certs || certs.length === 0)) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <EditableSection sectionId="certificates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-reveal">
          <SectionBadge className="mb-4">
            <EditableText 
              contentKey="home.certs.badge"
              defaultAr="الشهادات والاعتمادات"
              defaultEn="Certificates & Accreditations"
            />
          </SectionBadge>
          <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mt-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            <EditableText 
              contentKey="home.certs.title"
              defaultAr="ثقة عالمية في"
              defaultEn="Global Trust in"
            />{' '}
            <span className="text-gradient">
              <EditableText 
                contentKey="home.certs.titleAccent"
                defaultAr="منتجاتنا"
                defaultEn="Our Quality"
              />
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-80 hover:opacity-100 transition-opacity">
          {isLoading ? (
            [...Array(4)].map((_, i) => <div key={i} className="w-32 h-32 bg-gray-100 rounded-2xl animate-pulse" />)
          ) : certs.map((cert: any) => {
            let title = { ar: '', en: '' };
            try {
              title = typeof cert.title === 'string' ? JSON.parse(cert.title) : (cert.title || title);
            } catch (e) {
              console.error("Error parsing certificate title", e);
            }
            
            return (
              <div key={cert.id} className="group flex flex-col items-center gap-4 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="w-32 h-32 md:w-40 md:h-40 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center group-hover:shadow-brand transition-all">
                  <img 
                    src={cert.image_url} 
                    alt={isRTL ? title.ar : title.en} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-brand-green text-center max-w-[150px]">
                  {isRTL ? title.ar : title.en}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </EditableSection>
  </section>
  );
}

// Featured Blog Section
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
    <section className="py-24 bg-brand-beige relative overflow-hidden">
      <EditableSection sectionId="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-12">
          <div className="animate-reveal">
            <SectionBadge className="mb-3">
              <EditableText 
                contentKey="home.blog.badge"
                defaultAr="آخر الأخبار"
                defaultEn="Latest News"
              />
            </SectionBadge>
            <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              <EditableText 
                contentKey="home.blog.title"
                defaultAr="المدونة و"
                defaultEn="Blog &"
              />{' '}
              <EditableText 
                className="text-gradient"
                contentKey="home.blog.titleAccent"
                defaultAr="أحدث المقالات"
                defaultEn="Recent Articles"
              />
            </h2>
          </div>
          <EditableButton
            contentKey="home.blog.viewAll"
            defaultAr="زيارة المدونة"
            defaultEn="Visit Blog"
            defaultHref="/blog"
            className="animate-reveal inline-flex items-center gap-2 text-brand-green font-bold hover:gap-3 transition-all"
            icon={<Arrow className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-gray-200 animate-pulse" />
            ))
          ) : (
            featured.map((post: any) => {
              const titleStr = getSafeValue(post.title, isRTL ? 'ar' : 'en');
              
              return (
                <article key={post.id} className="animate-reveal group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                  <Link to={getPath(`/blog/${post.slug}`)} className="block aspect-[16/10] overflow-hidden">
                    <img src={post.image_url} alt={titleStr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </Link>
                  <div className="p-6">
                    <h3 className={`text-lg font-bold text-gray-900 mb-3 group-hover:text-brand-green transition-colors ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                      {titleStr}
                    </h3>
                    <Link to={getPath(`/blog/${post.slug}`)} className="text-brand-green font-bold text-sm inline-flex items-center gap-1 group/btn">
                      {isRTL ? 'اقرأ المزيد' : 'Read More'}
                      <Arrow size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </EditableSection>
  </section>
  );
}

function TrustBar() {
  return (
    <section className="bg-white border-b border-gray-100 py-6 relative overflow-hidden">
      <EditableSection sectionId="trustBar">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <ShieldCheck className="w-5 h-5 text-brand-green" />
            <EditableText 
              contentKey="home.trust.1"
              defaultAr="جودة معتمدة"
              defaultEn="Certified Quality"
              className="text-sm font-semibold tracking-wide uppercase"
            />
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <MapPin className="w-5 h-5 text-brand-green" />
            <EditableText 
              contentKey="home.trust.2"
              defaultAr="من مزارعنا"
              defaultEn="Direct from Farms"
              className="text-sm font-semibold tracking-wide uppercase"
            />
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <Package className="w-5 h-5 text-brand-green" />
            <EditableText 
              contentKey="home.trust.3"
              defaultAr="تعبئة مخصصة"
              defaultEn="Custom Packaging"
              className="text-sm font-semibold tracking-wide uppercase"
            />
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <Award className="w-5 h-5 text-brand-green" />
            <EditableText 
              contentKey="home.trust.4"
              defaultAr="خبرة عالمية"
              defaultEn="Global Export Expert"
              className="text-sm font-semibold tracking-wide uppercase"
            />
          </div>
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
      <FeaturedProducts />
      <CategoriesSection />
      <FeaturedBlog />
      <CertificatesSection />
      <IntroSection />
      <WhyUsSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
