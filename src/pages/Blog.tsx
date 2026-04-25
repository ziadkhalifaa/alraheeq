
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/api/api';
import { useLanguage } from '@/hooks/useLanguage';
import { getSafeValue } from '@/editor/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, ArrowLeft, Leaf } from 'lucide-react';
import SectionBadge from '@/components/features/SectionBadge';

export default function Blog() {
  const { t, isRTL, getPath } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const sectionRef = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => blogApi.getAll().then(res => res.data),
  });

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
            {isRTL ? 'المدونة والأخبار' : 'Blog & News'}
          </SectionBadge>
          <h1 className={`text-5xl lg:text-6xl font-bold text-white mt-4 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            {isRTL ? 'اكتشف عالم' : 'Discover the World of'}{' '}
            <span className="text-brand-gold">{isRTL ? 'الأعشاب الطبيعية' : 'Natural Herbs'}</span>
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            {isRTL 
              ? 'مقالات حصرية عن جودة الأعشاب المصرية وفوائدها الصحية وطرق تصديرها للعالم.' 
              : 'Exclusive articles on the quality of Egyptian herbs, their health benefits, and how they are exported globally.'}
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section ref={sectionRef} className="py-20 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 rounded-3xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any, i: number) => (
                <article 
                  key={post.id}
                  className="animate-reveal group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                >
                  <Link to={getPath(`/blog/${post.slug}`)} className="block relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={post.image_url || 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80'} 
                      alt={getSafeValue(post.title, isRTL ? 'ar' : 'en')}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {post.author || 'Alraheeq'}
                      </div>
                    </div>
                    
                    <h2 className={`text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-green transition-colors ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                      <Link to={getPath(`/blog/${post.slug}`)}>
                        {getSafeValue(post.title, isRTL ? 'ar' : 'en')}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {getSafeValue(post.excerpt, isRTL ? 'ar' : 'en')}
                    </p>
                    
                    <Link 
                      to={getPath(`/blog/${post.slug}`)}
                      className="inline-flex items-center gap-2 text-brand-green font-bold text-sm group/btn"
                    >
                      {isRTL ? 'اقرأ المزيد' : 'Read More'}
                      <Arrow className={`w-4 h-4 transition-transform group-hover/btn:${isRTL ? '-translate-x-1' : 'translate-x-1'}`} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-brand-green/40" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{isRTL ? 'لا توجد مقالات حالياً' : 'No articles found'}</h3>
              <p className="text-gray-500">{isRTL ? 'سنقوم بإضافة مقالات جديدة قريباً.' : 'We will be adding new articles soon.'}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

import { FileText } from 'lucide-react';
