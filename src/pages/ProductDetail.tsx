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
import { getSafeValue } from '@/editor/utils';
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

  useEffect(() => {
    if (product?.id) {
      trackEvent('view', product.id);
    }
  }, [product?.id, trackEvent]);

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
    <main className="pt-24 pb-20">
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDesc} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDesc} />
          <meta property="og:image" content={images[0] || ''} />
        </Helmet>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Link to={getPath("/")} className="hover:text-brand-green transition-colors">Home</Link>
            <Arrow className="w-3 h-3" />
            <Link to={getPath("/products")} className="hover:text-brand-green transition-colors">Products</Link>
            <Arrow className="w-3 h-3" />
            <span className="text-gray-900">{name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Gallery & Details */}
            <div className="lg:col-span-7 space-y-10">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-brand-lg border border-gray-100 bg-white group">
                  {images.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={images[currentImageIndex]}
                        alt={`${name} - View ${currentImageIndex + 1}`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load", images[currentImageIndex]);
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                        }}
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={isRTL ? nextImage : prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-gray-800 hover:bg-white hover:text-brand-green transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={isRTL ? prevImage : nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-gray-800 hover:bg-white hover:text-brand-green transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-gray-100 text-brand-green text-sm font-bold shadow-sm">
                      {product.category_slug?.toUpperCase()}
                    </span>
                    {specs.purity && (
                      <span className="px-4 py-1.5 rounded-full bg-brand-gold text-white text-sm font-bold shadow-sm">
                        {specs.purity} Purity
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all ${currentImageIndex === idx ? 'ring-2 ring-brand-green ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="glass-card rounded-3xl p-8 border border-gray-100">
                <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                  {isRTL ? 'تفاصيل المنتج' : 'Product Description'}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>

              {/* Uses & Benefits Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card rounded-3xl p-8 border border-gray-100">
                  <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-6">
                    <Leaf className="w-6 h-6 text-brand-green" />
                  </div>
                  <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                    {isRTL ? 'الاستخدامات والتطبيقات' : 'Uses & Applications'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {isRTL 
                      ? 'يستخدم هذا المنتج في العديد من الصناعات الغذائية والدوائية ومستحضرات التجميل لجودته العالية ونقائه التام.'
                      : 'This product is widely used in food, pharmaceutical, and cosmetic industries due to its high quality and purity.'}
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-8 border border-gray-100">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                    {isRTL ? 'الفوائد الصحية' : 'Health Benefits'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {isRTL
                      ? 'يحتوي على خصائص طبيعية تعزز الصحة العامة وتوفر فوائد غذائية أساسية لمختلف الاستخدامات.'
                      : 'Contains natural properties that promote overall health and provide essential nutritional benefits for various applications.'}
                  </p>
                </div>
              </div>

              {/* Packaging & Export */}
              <div className="glass-card rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className={`text-2xl font-bold text-gray-900 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                    {isRTL ? 'التعبئة والتصدير' : 'Packaging & Export'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="font-bold text-gray-900 mb-1">{isRTL ? 'أوزان التعبئة' : 'Weights'}</div>
                    <div className="text-sm text-gray-500">10kg, 20kg, 25kg PP bags</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="font-bold text-gray-900 mb-1">{isRTL ? 'سعة الحاوية' : 'FCL Capacity'}</div>
                    <div className="text-sm text-gray-500">6 - 12 Tons per 20ft</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="font-bold text-gray-900 mb-1">{isRTL ? 'المنشأ' : 'Origin'}</div>
                    <div className="text-sm text-gray-500">{isRTL ? 'مصر' : 'Egypt (Alraheeq Farms)'}</div>
                  </div>
                </div>
              </div>

              {/* Technical Specs Table */}
              {hasSpecs && (
                <div className="glass-card rounded-3xl p-8 border border-gray-100">
                  <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                    {isRTL ? 'المواصفات الفنية' : 'Technical Specifications'}
                  </h2>
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                    <table className="w-full text-left" dir={isRTL ? 'rtl' : 'ltr'}>
                      <tbody className="divide-y divide-gray-100">
                        {Object.entries(specs).map(([key, value], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                            <th className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">
                              {formatKey(key)}
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {String(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Action Panel */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-28 space-y-6">
                
                {/* Product Header & Highlights */}
                <div>
                  <h1 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                    {name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex items-center gap-2 bg-brand-beige px-4 py-2 rounded-full border border-brand-gold/20">
                      <MapPin className="w-4 h-4 text-brand-gold" />
                      <span className="text-sm font-medium text-gray-800">{product.origin || 'Egypt'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-brand-green/5 px-4 py-2 rounded-full border border-brand-green/20">
                      <ShieldCheck className="w-4 h-4 text-brand-green" />
                      <span className="text-sm font-medium text-gray-800">100% Certified</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-800">Export Ready</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {['Premium Quality Guaranteed', 'Customizable Packaging Available', 'Global Shipping'].map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-600">
                        <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-brand-green" />
                        </div>
                        <span className={isRTL ? 'font-body-ar' : 'font-body-en'}>
                          {isRTL && i===0 ? 'جودة عالية مضمونة' : isRTL && i===1 ? 'تعبئة مخصصة متاحة' : isRTL && i===2 ? 'شحن عالمي' : feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inquiry Form Component */}
                <InquiryForm productName={name} productId={product.id} />

                {/* Quick WhatsApp Contact */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mb-3">{isRTL ? 'أو تواصل معنا مباشرة عبر' : 'Or contact us directly via'}</p>
                  <a
                    href={`https://wa.me/201014167512?text=${encodeURIComponent(
                      isRTL 
                        ? `مرحباً، أريد الاستفسار عن منتج: ${name}`
                        : `Hello, I'm inquiring about: ${name}`
                    )}`}
                    onClick={() => trackEvent('click_whatsapp', product.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366]/10 text-[#25D366] font-bold hover:bg-[#25D366] hover:text-white transition-all w-full"
                  >
                    WhatsApp
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
  );
}

