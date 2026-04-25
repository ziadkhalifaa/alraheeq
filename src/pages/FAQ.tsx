import { useState, useEffect } from 'react';
import { Plus, Minus, HelpCircle, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';

function useRevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.05 }
    );
    const elements = document.querySelectorAll('.animate-reveal, .animate-scale-in');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className={`animate-reveal border rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'border-brand-green/30 shadow-brand bg-white'
          : 'border-gray-100 bg-white hover:border-brand-green/20 hover:shadow-sm'
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left rtl:text-right"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-4">
          <span className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
            isOpen ? 'bg-brand-green text-white' : 'bg-brand-green/10 text-brand-green'
          }`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`font-semibold text-gray-900 text-base leading-relaxed ${isOpen ? 'text-brand-green' : ''}`}>
            {question}
          </span>
        </div>
        <span className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-brand-green text-white rotate-0' : 'bg-gray-100 text-gray-400'
        }`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
          <div className="ps-12">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { t, isRTL, getPath } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  useRevealObserver();

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
  ];

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient" />
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-beige to-transparent" />

        <div className="absolute top-12 right-12 opacity-20 animate-float">
          <Leaf className="w-24 h-24 text-brand-gold" />
        </div>
        <div className="absolute bottom-16 left-12 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <HelpCircle className="w-20 h-20 text-white" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
            {t('faq.hero.badge')}
          </SectionBadge>
          <h1 className={`text-5xl lg:text-6xl font-bold text-white mt-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            {t('faq.hero.title')}{' '}
            <span className="text-brand-gold">{t('faq.hero.titleAccent')}</span>
          </h1>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-20 bg-brand-beige">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions? */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-reveal">
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-5 shadow-brand">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-2xl font-bold text-gray-900 mb-3 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            {t('faq.stillQuestionsTitle')}
          </h2>
          <p className="text-gray-500 mb-6">
            {t('faq.stillQuestionsSubtitle')}
          </p>
          <Link
            to={getPath("/contact")}
            className="btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-gradient text-white font-semibold shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1"
          >
            {t('faq.contactBtn')}
          </Link>
        </div>
      </section>
    </main>
  );
}
