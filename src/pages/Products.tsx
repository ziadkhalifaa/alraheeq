import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Leaf, Package } from 'lucide-react';
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

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(res => res.data),
  });

  const catParam = searchParams.get('cat') || 'all';
  const pageParam = parseInt(searchParams.get('page') || '1');
  const limit = 12;

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['products', catParam, pageParam],
    queryFn: () => productApi.getAll(catParam === 'all' ? undefined : catParam, pageParam, limit).then(res => res.data),
  });

  const products = response?.data || [];
  const meta = response?.meta || { total: 0, totalPages: 1, page: 1 };

  const handleFilter = (key: string) => {
    if (key === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ cat: key, page: '1' });
    }
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <section className="relative py-28 bg-[#1c4b42] overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="absolute top-12 right-12 opacity-20 animate-float">
          <Leaf className="w-24 h-24 text-[#b4e717]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
            {t('products.hero.badge')}
          </SectionBadge>
          <h1 className={`text-3xl lg:text-5xl font-bold text-white mt-4 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            {t('products.hero.title')}{' '}
            <span className="text-[#b4e717]">{t('products.hero.titleAccent')}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-medium">
            {t('products.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleFilter('all')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                catParam === 'all' 
                  ? 'bg-[#1c4b42] text-[#b4e717] border-[#1c4b42] shadow-lg' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#1c4b42]/30'
              }`}
            >
              {t('products.filter.all')}
            </button>
            {categoriesData?.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => handleFilter(cat.slug)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                  catParam === cat.slug 
                    ? 'bg-[#1c4b42] text-[#b4e717] border-[#1c4b42] shadow-lg' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#1c4b42]/30'
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
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1c4b42]/5 flex items-center justify-center text-3xl">
                {categoryInfo[catParam as keyof typeof categoryInfo].emoji}
              </div>
              <div>
                <h2 className={`text-2xl font-black text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                  {categoryInfo[catParam as keyof typeof categoryInfo].title}
                </h2>
                <p className="text-gray-500 font-medium mt-1">
                  {categoryInfo[catParam as keyof typeof categoryInfo].desc}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-[2.5rem] bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500 font-bold">
              Error loading products. Please try again later.
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-bold">{isRTL ? 'لا توجد منتجات في هذا القسم حالياً' : 'No products found in this category'}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product: any, i: number) => (
                  <ProductCard key={product.id} product={product} index={i % 6} />
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="mt-20 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePageChange(meta.page - 1)}
                    disabled={meta.page === 1}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1c4b42] hover:text-[#b4e717] hover:border-[#1c4b42] transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit"
                  >
                    {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {[...Array(meta.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-12 h-12 rounded-full font-bold transition-all ${
                          meta.page === i + 1 
                            ? 'bg-[#1c4b42] text-[#b4e717] shadow-lg shadow-[#1c4b42]/20' 
                            : 'hover:bg-gray-100 text-gray-400'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={meta.page === meta.totalPages}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1c4b42] hover:text-[#b4e717] hover:border-[#1c4b42] transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit"
                  >
                    {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                  </button>
                </div>
              )}
              
              {/* Results count info */}
              <div className="mt-8 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                {isRTL ? (
                  <>عرض {(meta.page - 1) * limit + 1} - {Math.min(meta.page * limit, meta.total)} من {meta.total} منتج</>
                ) : (
                  <>Showing {(meta.page - 1) * limit + 1} - {Math.min(meta.page * limit, meta.total)} of {meta.total} products</>
                )}
              </div>
            </>
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
