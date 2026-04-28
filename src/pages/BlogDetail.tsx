
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/api/api';
import { useLanguage } from '@/hooks/useLanguage';
import { getSafeValue, getImgUrl } from '@/editor/utils';
import { Calendar, User, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, Linkedin as LinkedIn } from 'lucide-react';
import SectionBadge from '@/components/features/SectionBadge';

export default function BlogDetail() {
  const { slug } = useParams();
  const { isRTL, getPath } = useLanguage();
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogApi.getBySlug(slug!).then(res => res.data),
    enabled: !!slug,
  });

  if (isLoading) return <div className="min-h-screen pt-40 text-center">Loading...</div>;
  if (isError || !post) return <div className="min-h-screen pt-40 text-center">Post not found</div>;

  const title = getSafeValue(post.title, isRTL ? 'ar' : 'en') || 'Untitled Post';
  
  // Extract content supporting both legacy HTML and new block-based HTML
  let content = '';
  if (post.content?.blocks && post.content.blocks.length > 0) {
    if (post.content.blocks[0].type === 'html' || post.content.blocks[0].type === 'legacy_html') {
      content = isRTL ? post.content.blocks[0].content.ar : post.content.blocks[0].content.en;
    } else {
      // Very old block format fallback
      content = post.content.blocks.map((b: any) => {
        const text = isRTL ? b.content.ar : b.content.en;
        if (b.type === 'paragraph') return `<p>${text}</p>`;
        if (b.type.startsWith('heading')) return `<h${b.type.replace('heading', '')}>${text}</h${b.type.replace('heading', '')}>`;
        if (b.type === 'image') return `<img src="${text}" />`;
        return `<p>${text}</p>`;
      }).join('');
    }
  } else {
    content = isRTL ? post.content.ar : post.content.en;
  }

  return (
    <main className="pt-20 bg-gray-50/50 min-h-screen pb-32">
      {/* Article Hero */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
        <div className="relative h-[50vh] min-h-[400px] max-h-[600px] rounded-[32px] overflow-hidden shadow-2xl">
          <img 
            src={getImgUrl(post.image_url || 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80')} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white flex flex-col justify-end h-full">
            <Link 
              to={getPath("/blog")}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors w-fit bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium"
            >
              <Arrow className="w-4 h-4" />
              {isRTL ? 'العودة للمدونة' : 'Back to Blog'}
            </Link>
            
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-4xl text-shadow-lg ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 text-brand-gold" />
                {new Date(post.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <User className="w-4 h-4 text-brand-gold" />
                {post.author || 'Alraheeq Team'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[32px] p-8 md:p-12 lg:p-16 border border-gray-100 shadow-xl relative">
          
          <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Share Sidebar - Sticky */}
            <div className="lg:w-16 shrink-0 order-2 lg:order-1">
              <div className="sticky top-32 flex flex-row lg:flex-col gap-4 justify-center">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-green hover:text-white hover:border-brand-green cursor-pointer shadow-sm transition-all hover:scale-110">
                  <Facebook size={16} />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-green hover:text-white hover:border-brand-green cursor-pointer shadow-sm transition-all hover:scale-110">
                  <Twitter size={16} />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-green hover:text-white hover:border-brand-green cursor-pointer shadow-sm transition-all hover:scale-110">
                  <LinkedIn size={16} />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-green hover:text-white hover:border-brand-green cursor-pointer shadow-sm transition-all hover:scale-110">
                  <Share2 size={16} />
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="flex-grow order-1 lg:order-2 min-w-0">
              <div 
                className={`prose prose-lg md:prose-xl max-w-none prose-brand text-gray-800 leading-relaxed overflow-wrap-anywhere break-words ${isRTL ? 'font-body-ar text-right prose-p:text-right' : 'font-body-en'}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
              
              {/* Tags / Footer */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-4">
                <span className="text-sm font-bold text-gray-400">{isRTL ? 'الوسوم:' : 'Tags:'}</span>
                <span className="px-4 py-1.5 rounded-full bg-brand-green/5 text-brand-green text-xs font-bold border border-brand-green/10">#Premium_Quality</span>
                <span className="px-4 py-1.5 rounded-full bg-brand-green/5 text-brand-green text-xs font-bold border border-brand-green/10">#Alraheeq</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
