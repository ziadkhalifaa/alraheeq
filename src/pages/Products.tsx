import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';
import ProductCard from '@/components/features/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi } from '@/api/api';

function useRevealObserver() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
      );
      const elements = document.querySelectorAll('.animate-reveal, .animate-reveal-left, .animate-reveal-right, .animate-scale-in');
      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  });
}

export default function Products() {
  const { t, isRTL, getPath } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const catParam = searchParams.get('cat') || 'all';

  useRevealObserver();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(res => res.data),
  });

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['products', catParam],
    queryFn: () => productApi.getAll(catParam === 'all' ? undefined : catParam).then(res => res.data),
  });

  const products = response?.data || [];

  const handleFilter = (key: string) => {
    if (key === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ cat: key });
    }
  };

  const categoryInfo = {
    herbs: { title: t('products.herbs.title'), desc: t('products.herbs.desc'), emoji: '🌿' },
    seeds: { title: t('products.seeds.title'), desc: t('products.seeds.desc'), emoji: '🌾' },
    spices: { title: t('products.spices.title'), desc: t('products.spices.desc'), emoji: '🫙' },
    dehydrated: { title: t('products.dehydrated.title'), desc: t('products.dehydrated.desc'), emoji: '🥕' },
  };

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative py-28 bg-brand-gradient overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-beige to-transparent" />

        <div className="absolute top-12 right-12 opacity-20 animate-float">
          <Leaf className="w-24 h-24 text-brand-gold" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
            {t('products.hero.badge')}
          </SectionBadge>
          <h1 className={`text-5xl lg:text-6xl font-bold text-white mt-4 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            {t('products.hero.title')}{' '}
            <span className="text-brand-gold">{t('products.hero.titleAccent')}</span>
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            {t('products.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-brand-beige border-b border-brand-gold/10 sticky top-20 z-30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleFilter('all')}
              className={`category-chip text-sm font-medium transition-all duration-300 ${
                catParam === 'all' ? 'active' : ''
              }`}
            >
              {t('products.filter.all')}
            </button>
            {categoriesData?.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => handleFilter(cat.slug)}
                className={`category-chip text-sm font-medium transition-all duration-300 ${
                  catParam === cat.slug ? 'active' : ''
                }`}
              >
                {(() => {
                  try {
                    const name = typeof cat.name === 'string' ? JSON.parse(cat.name) : cat.name;
                    return isRTL ? name.ar : name.en;
                  } catch (e) {
                    return typeof cat.name === 'string' ? cat.name : '';
                  }
                })()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Info Banner (when filtered) */}
      {catParam !== 'all' && categoryInfo[catParam as keyof typeof categoryInfo] && (
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{categoryInfo[catParam as keyof typeof categoryInfo].emoji}</span>
              <div>
                <h2 className={`text-2xl font-bold text-gray-900 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                  {categoryInfo[catParam as keyof typeof categoryInfo].title}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {categoryInfo[catParam as keyof typeof categoryInfo].desc}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500">
              Error loading products. Please try again later.
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">{isRTL ? 'لا توجد منتجات' : 'No products found'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any, i: number) => (
                <ProductCard key={product.id} product={product} index={i % 6} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-beige">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-10">
            <h2 className={`text-3xl font-bold text-gray-900 mb-3 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              {t('products.cta.title')}
            </h2>
            <p className="text-gray-500 mb-8">{t('products.cta.subtitle')}</p>
            <Link
              to={getPath("/contact")}
              className="btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-gradient text-white font-semibold shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              {t('products.cta.btn')}
              <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
