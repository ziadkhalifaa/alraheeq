import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const isHome = location.pathname === `/${i18n.language}` || location.pathname === `/${i18n.language}/`;
  const showSolid = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProductsOpen(false);
  }, [location.pathname]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    
    if (pathParts[0] === 'ar' || pathParts[0] === 'en') {
      pathParts[0] = nextLang;
    } else {
      pathParts.unshift(nextLang);
    }
    
    navigate(`/${pathParts.join('/')}${location.search}`, { replace: true });
  };

  const getPath = (path: string) => `/${i18n.language}${path === '/' ? '' : path}`;

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    {
      href: '/products',
      label: t('nav.products'),
      hasDropdown: true,
      children: [
        { href: '/products?cat=herbs', label: isRTL ? 'الأعشاب' : 'Herbs' },
        { href: '/products?cat=seeds', label: isRTL ? 'البذور' : 'Seeds' },
        { href: '/products?cat=spices', label: isRTL ? 'التوابل' : 'Spices' },
        { href: '/products?cat=dehydrated', label: isRTL ? 'الخضروات المجففة' : 'Dehydrated Vegetables' },
      ],
    },
    { href: '/quality', label: t('nav.quality') },
    { href: '/certificates', label: t('nav.certificates') },
    { 
      href: '/faq', 
      label: t('nav.faq'),
      hasDropdown: true,
      children: [
        { href: '/faq', label: t('nav.faq') },
        { href: '/blog', label: isRTL ? 'المقالات' : 'Articles' },
      ]
    },
    { href: '/contact', label: t('nav.contact') },
  ];

  const isActive = (href: string) => {
    const targetPath = getPath(href).split('?')[0];
    const currentPath = location.pathname;
    if (href === '/') return currentPath === `/${i18n.language}` || currentPath === `/${i18n.language}/`;
    return currentPath.startsWith(targetPath);
  };

  return (
    <>
      <div className="scroll-progress" id="scroll-progress" style={{ width: '0%' }} />

      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          showSolid ? 'navbar-glass shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link to={getPath('/')} className="flex items-center gap-3 shrink-0 group">
              <img
                src="https://cdn-ai.onspace.ai/onspace/project/uploads/MoJYwGH33bc9qvJ38ADo9Y/AlraheeqLogoWeb.png"
                alt="Alraheeq Herbs"
                className={`h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${!showSolid ? 'brightness-0 invert' : ''}`}
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  <div key={link.href} className="relative group">
                    <Link
                      to={getPath(link.href)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.href)
                          ? showSolid 
                            ? 'text-brand-green bg-brand-green/10' 
                            : 'text-[#b4e717] bg-white/10'
                          : showSolid
                          ? 'text-gray-700 hover:text-brand-green hover:bg-brand-green/5'
                          : 'text-white hover:text-brand-gold'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                    </Link>
                    <div className="absolute top-full mt-2 w-52 glass-card rounded-xl shadow-brand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                      {link.children?.map((child) => (
                        <Link
                          key={child.href}
                          to={getPath(child.href)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:text-brand-green hover:bg-brand-green/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={getPath(link.href)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? showSolid 
                          ? 'text-brand-green bg-brand-green/10' 
                          : 'text-[#b4e717] bg-white/10'
                        : showSolid
                        ? 'text-gray-700 hover:text-brand-green hover:bg-brand-green/5'
                        : 'text-white hover:text-brand-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <button
                onClick={toggleLanguage}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showSolid
                    ? 'text-brand-green border border-brand-green/30 hover:bg-brand-green/5'
                    : 'text-white border border-white/30 hover:bg-white/10'
                }`}
              >
                <Globe className="w-4 h-4" />
                {t('nav.switchLang')}
              </button>

              <Link
                to={getPath('/contact')}
                className="btn-magnetic px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-gradient text-white shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                {t('nav.requestQuote')}
              </Link>
            </div>

            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-lg transition-colors ${
                  showSolid ? 'text-brand-green' : 'text-white'
                }`}
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  showSolid ? 'text-gray-700' : 'text-white'
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="navbar-glass border-t border-brand-gold/10 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  to={getPath(link.href)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-brand-green bg-brand-green/10'
                      : 'text-gray-700 hover:text-brand-green hover:bg-brand-green/5'
                  }`}
                >
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <div className={`${isRTL ? 'pr-8' : 'pl-8'} space-y-1 mt-1`}>
                    {link.children?.map((child) => (
                      <Link
                        key={child.href}
                        to={getPath(child.href)}
                        className="block px-4 py-2 text-xs text-gray-600 hover:text-brand-green"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to={getPath('/contact')}
              className="block w-full text-center px-5 py-3 rounded-xl text-sm font-semibold bg-brand-gradient text-white mt-3"
            >
              {t('nav.requestQuote')}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
