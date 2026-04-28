import { ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/constants/products';
import { useLanguage } from '@/hooks/useLanguage';
import { getSafeValue, getImgUrl } from '@/editor/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t, isRTL, getPath } = useLanguage();

  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const label = product.category_slug || '';

  const name = getSafeValue(product.name, isRTL ? 'ar' : 'en') || 'Unnamed Product';
  const description = getSafeValue(product.description, isRTL ? 'ar' : 'en');

  return (
    <div
      className={`animate-scale-in stagger-${Math.min(index + 1, 6)} group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
    >
      {/* Image */}
      <Link to={getPath(`/products/${product.slug}`)} className="block relative h-64 overflow-hidden">
        <img
          src={getImgUrl(product.image_url)}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 right-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-black bg-[#b4e717] text-[#1c4b42] shadow-lg uppercase tracking-widest">
            {(() => {
              const catLabel = label ? t(`home.categories.${label}`) : "";
              return typeof catLabel === 'string' ? catLabel : (isRTL ? 'منتج ممتاز' : 'Premium');
            })()}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c4b42]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#b4e717]" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.origin}</span>
        </div>
        <Link to={getPath(`/products/${product.slug}`)} className="block">
          <h3 className={`font-black text-[#1c4b42] text-2xl mb-4 group-hover:text-[#1c4b42]/80 transition-colors ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            {name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 line-clamp-2 font-medium">
          {description}
        </p>

        <Link
          to={`/products/${product.slug}`}
          className="inline-flex items-center gap-3 text-sm font-black text-[#1c4b42] uppercase tracking-tighter group/link"
        >
          <span>{isRTL ? 'تفاصيل المنتج' : 'Product Details'}</span>
          <Arrow className="w-5 h-5 transition-transform group-hover/link:translate-x-2 text-[#b4e717]" />
        </Link>
      </div>
    </div>
  );
}
