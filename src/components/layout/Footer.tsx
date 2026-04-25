import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';

export default function Footer() {
  const { t, isRTL, getPath } = useLanguage();
  const { trackEvent } = useTracking();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const productLinks = [
    { href: getPath('/products?cat=herbs'), label: t('nav.products') + ' - ' + t('home.categories.herbs') },
    { href: getPath('/products?cat=seeds'), label: t('nav.products') + ' - ' + t('home.categories.seeds') },
    { href: getPath('/products?cat=spices'), label: t('nav.products') + ' - ' + t('home.categories.spices') },
    { href: getPath('/products?cat=dehydrated'), label: t('nav.products') + ' - ' + t('home.categories.dehydrated') },
  ];

  const navLinks = [
    { href: getPath('/'), label: t('nav.home') },
    { href: getPath('/about'), label: t('nav.about') },
    { href: getPath('/quality'), label: t('nav.quality') },
    { href: getPath('/certificates'), label: t('nav.certificates') },
    { href: getPath('/faq'), label: t('nav.faq') },
    { href: getPath('/contact'), label: t('nav.contact') },
  ];

  return (
    <footer className="bg-brand-gradient relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10 pattern-dots" />

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to={getPath("/")}>
              <img
                src="https://cdn-ai.onspace.ai/onspace/project/uploads/MoJYwGH33bc9qvJ38ADo9Y/AlraheeqLogoWeb.png"
                alt="Alraheeq Herbs"
                className="h-16 w-auto object-contain brightness-0 invert mb-4"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/201010213937"
                onClick={() => trackEvent('click_whatsapp_footer')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href="mailto:info@alraheeqherbs.com"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-gold flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-brand-gold" />
              {t('footer.links')}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-brand-gold" />
              {t('footer.products')}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-brand-gold" />
              {t('footer.contact')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm leading-relaxed">
                  {t('contact.info.address')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a
                  href="tel:+201010213937"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                  dir="ltr"
                >
                  +20 1010213937
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a
                  href="mailto:info@alraheeqherbs.com"
                  className="text-white/60 hover:text-white text-sm transition-colors break-all"
                >
                  info@alraheeqherbs.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="text-white/60 text-sm">Egypt</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center">
            {t('footer.rights')}
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-gold flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}
