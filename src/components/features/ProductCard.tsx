import { ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/constants/products';
import { useLanguage } from '@/hooks/useLanguage';
import { getSafeValue } from '@/editor/utils';

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
      className={`animate-scale-in stagger-${Math.min(index + 1, 6)} card-3d group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-brand-lg transition-all duration-500`}
    >
      {/* Image */}
      <div className="img-zoom relative h-52">
        <img
          src={product.image_url}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-green text-white shadow-sm">
            {(() => {
              const catLabel = label ? t(`home.categories.${label}`) : "";
              return typeof catLabel === 'string' ? catLabel : (isRTL ? 'منتج' : 'Product');
            })()}
          </span>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-40 transition-opacity duration-400" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-gold" />
          <span className="text-xs text-gray-400">{product.origin}</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-base mb-1.5 group-hover:text-brand-green transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        <Link
          to={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-green group-hover:text-brand-green-dark transition-colors"
        >
          {t('nav.requestQuote')}
          <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
