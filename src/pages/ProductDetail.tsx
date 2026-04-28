import React, { useState, useEffect, Component, ErrorInfo } from 'react';

class ErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen pt-32 px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
          <pre className="text-left bg-gray-100 p-4 rounded overflow-auto text-sm text-red-800 inline-block max-w-full">
            {this.state.error?.toString()}
            <br/><br/>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/api';
import { useLanguage } from '@/hooks/useLanguage';
import { getSafeValue, getImgUrl } from '@/editor/utils';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, MapPin, Package, ShieldCheck, Check, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SectionBadge from '@/components/features/SectionBadge';
import InquiryForm from '@/components/features/InquiryForm';
import { useTracking } from '@/hooks/useTracking';

export default function ProductDetail() {
  return (
    <ErrorBoundary>
      <ProductDetailContent />
    </ErrorBoundary>
  );
}

function ProductDetailContent() {
  const { slug } = useParams();
  const { t, isRTL, getPath } = useLanguage();
  const { trackEvent } = useTracking();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getBySlug(slug!).then(res => res.data),
    enabled: !!slug,
  });

  // View tracking is handled automatically by the backend when getBySlug is called
  useEffect(() => {
    // We only track special events here, not basic views
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 animate-pulse">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[500px] bg-gray-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-12 w-64 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link to={getPath("/products")} className="text-brand-green mt-4 inline-block">Back to products</Link>
      </div>
    );
  }

  const name = getSafeValue(product.name, isRTL ? 'ar' : 'en') || 'Unnamed Product';
  const description = getSafeValue(product.description, isRTL ? 'ar' : 'en');
  const metaTitle = getSafeValue(product.meta_title, isRTL ? 'ar' : 'en') || `${name} | Alraheeq Herbs`;
  const metaDesc = getSafeValue(product.meta_description, isRTL ? 'ar' : 'en') || description.substring(0, 160);

  // Gallery
  let images = [];
  try {
    const rawImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    if (Array.isArray(rawImages) && rawImages.length > 0) {
      images = rawImages;
    } else if (product.image_url) {
      images = [product.image_url];
    }
  } catch (e) {
    if (product.image_url) images = [product.image_url];
  }
  
  const nextImage = () => setCurrentImageIndex((prev) => images.length > 0 ? (prev + 1) % images.length : 0);
  const prevImage = () => setCurrentImageIndex((prev) => images.length > 0 ? (prev - 1 + images.length) % images.length : 0);

  // Specs
  let specs: any = {};
  try {
    specs = (typeof product.specs === 'string') ? JSON.parse(product.specs) : (product.specs || {});
  } catch (e) {
    specs = {};
  }
  const hasSpecs = Object.keys(specs).length > 0;

  // Format spec key for display
  const formatKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };



  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={images[0] || ''} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400 font-medium">
          <Link to={getPath("/")} className="hover:text-brand-green transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <Arrow className="w-3 h-3 opacity-50" />
          <Link to={getPath("/products")} className="hover:text-brand-green transition-colors">{isRTL ? 'المنتجات' : 'Products'}</Link>
          <Arrow className="w-3 h-3 opacity-50" />
          <span className="text-gray-900 line-clamp-1">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Gallery Column - Smaller and Constrained */}
          <div className="space-y-6">
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
              {images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={getImgUrl(images[currentImageIndex])}
                    alt={name}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <Package className="w-20 h-20" />
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-brand-green text-xs font-bold uppercase tracking-widest border border-gray-100 shadow-sm">
                  {product.category_slug}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 transition-all border-2 ${currentImageIndex === idx ? 'border-brand-green scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={getImgUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Column */}
            <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className={`text-4xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                  {name}
                </h1>

                {/* Quick Highlights */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 bg-brand-green/5 px-4 py-2 rounded-xl border border-brand-green/10">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    <span className="text-sm font-bold text-brand-green/80 uppercase tracking-wider">
                      {product.origin || (isRTL ? 'مصر' : 'Egypt')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-brand-green/5 px-4 py-2 rounded-xl border border-brand-green/10">
                    <ShieldCheck className="w-4 h-4 text-brand-green" />
                    <span className="text-sm font-bold text-brand-green/80 uppercase tracking-wider">
                      {isRTL ? 'جودة تصدير' : 'Export Grade'}
                    </span>
                  </div>
                </div>

                <div className="prose prose-lg text-gray-500 mb-10 max-w-none">
                  <p className="text-xl leading-relaxed whitespace-pre-wrap font-medium lg:pr-12">
                    {/* If description is too long or contains specs-like text, we can truncate or format it */}
                    {description?.length > 300 ? `${description.substring(0, 300)}...` : description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-gray-100">
                  <a 
                    href="#inquiry" 
                    className="flex-1 min-w-[220px] px-10 py-5 bg-[#1c4b42] text-[#b4e717] font-bold rounded-2xl hover:bg-[#b4e717] hover:text-[#1c4b42] transition-all shadow-2xl shadow-[#1c4b42]/20 flex items-center justify-center gap-3 group"
                  >
                    {isRTL ? 'اطلب عرض سعر' : 'Request a Quote'}
                    <Arrow className={`w-5 h-5 transition-transform group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'}`} />
                  </a>
                  <a
                    href={`https://wa.me/201014167512?text=${encodeURIComponent(
                      isRTL 
                        ? `مرحباً، أريد الاستفسار عن منتج: ${name}`
                        : `Hello, I'm inquiring about: ${name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-5 border-2 border-gray-100 text-gray-900 font-bold rounded-2xl hover:border-brand-green hover:text-brand-green transition-all"
                  >
                    WhatsApp
                  </a>
                </div>
              </motion.div>
            </div>
        </div>

        {/* Technical Specs Section - One Place Only */}
        <div className="mt-24 pt-24 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            <div className="lg:col-span-2">
              <h2 className={`text-3xl font-bold text-gray-900 mb-10 flex items-center gap-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                <span className="w-2 h-10 bg-brand-green rounded-full" />
                {isRTL ? 'المواصفات الفنية' : 'Technical Specifications'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-4 border-b border-gray-50 group hover:bg-gray-50 transition-colors px-4 rounded-xl">
                    <span className="text-gray-400 font-bold text-sm uppercase">{formatKey(key)}</span>
                    <span className="text-gray-900 font-bold">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-[#1c4b42] rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#b4e717]/10 rounded-full blur-3xl" />
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <Package className="w-6 h-6 text-[#b4e717]" />
                  {isRTL ? 'التعبئة والشحن' : 'Packaging & Shipping'}
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-[#b4e717] text-xs font-bold uppercase tracking-widest mb-2">{isRTL ? 'أوزان التعبئة' : 'Weights'}</div>
                    <div className="text-lg font-medium">10kg, 20kg, 25kg PP bags</div>
                  </div>
                  <div>
                    <div className="text-[#b4e717] text-xs font-bold uppercase tracking-widest mb-2">{isRTL ? 'سعة الحاوية' : 'FCL Capacity'}</div>
                    <div className="text-lg font-medium">6 - 12 Tons per 20ft</div>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-[#b4e717]" />
                      {isRTL ? 'متاح فحص خارجي (SGS)' : 'External inspection available (SGS)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uses & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h4 className="text-xl font-bold text-gray-900 mb-4">{isRTL ? 'الاستخدامات' : 'Uses'}</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              {isRTL 
                ? 'يستخدم هذا المنتج في العديد من الصناعات الغذائية والدوائية ومستحضرات التجميل لجودته العالية ونقائه التام.'
                : 'This product is widely used in food, pharmaceutical, and cosmetic industries due to its high quality and purity.'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h4 className="text-xl font-bold text-gray-900 mb-4">{isRTL ? 'المزايا' : 'Benefits'}</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              {isRTL
                ? 'يحتوي على خصائص طبيعية تعزز الصحة العامة وتوفر فوائد غذائية أساسية لمختلف الاستخدامات.'
                : 'Contains natural properties that promote overall health and provide essential nutritional benefits for various applications.'}
            </p>
          </div>
        </div>
      </div>

      {/* Inquiry Section */}
      <section id="inquiry" className="mt-24 bg-gray-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold text-gray-900 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              {isRTL ? 'اطلب تسعير لهذا المنتج' : 'Request Pricing for This Product'}
            </h2>
            <p className="text-gray-500 font-medium">
              {isRTL ? 'سوف يقوم فريقنا بالرد عليك خلال أقل من 24 ساعة بمواصفات العرض الكاملة.' : 'Our team will respond with a full quote within 24 hours.'}
            </p>
          </div>
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100">
            <InquiryForm productName={name} productId={product.id} />
          </div>
        </div>
      </section>
    </main>
  );
}

