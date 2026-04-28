import { useState, useRef } from 'react';
import { Plus, Minus, HelpCircle, Leaf, MessageCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';
import { EditableText } from '@/editor/EditableText';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isRTL: boolean;
}

function FAQItem({ question, answer, index, isOpen, onToggle, isRTL }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group border-2 rounded-[2rem] overflow-hidden transition-all duration-500 ${
        isOpen
          ? 'border-[#86c434] shadow-2xl bg-white scale-[1.02]'
          : 'border-gray-100 bg-white hover:border-[#1c4b42]/20 hover:shadow-lg'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left rtl:text-right"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base font-black transition-all duration-500 ${
            isOpen ? 'bg-[#86c434] text-white rotate-12' : 'bg-[#1c4b42]/5 text-[#1c4b42]'
          }`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`font-bold text-lg leading-tight transition-colors duration-500 ${
            isOpen ? 'text-[#1c4b42]' : 'text-gray-900'
          } ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            {question}
          </span>
        </div>
        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
          isOpen ? 'bg-[#1c4b42] text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-[#1c4b42]/10 group-hover:text-[#1c4b42]'
        }`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-8 pb-8 pt-2">
              <div className="ps-16 text-gray-600 text-lg leading-relaxed border-t border-gray-50 pt-6">
                {answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const { t, isRTL, getPath } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const containerRef = useRef(null);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
  ];

  return (
    <main className="overflow-hidden bg-white" ref={containerRef}>
      {/* High-End Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#1c4b42]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c4b42] via-[#1c4b42]/90 to-[#1c4b42]" />
          <div className="absolute top-0 left-0 w-full h-full pattern-grid opacity-10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <SectionBadge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-md">
            <EditableText contentKey="faq.hero.badge" defaultAr="مساعدة" defaultEn="Help" />
          </SectionBadge>
          <h1 className={`text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            {t('faq.hero.title')}{' '}
            <span className="text-[#86c434] block mt-1">{t('faq.hero.titleAccent')}</span>
          </h1>
          <div className="w-20 h-1.5 bg-[#86c434] mx-auto rounded-full" />
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-20 right-20 opacity-10 animate-float hidden lg:block">
          <HelpCircle className="w-40 h-40 text-white" />
        </div>
      </section>

      {/* FAQ List Section */}
      <section className="py-20 bg-[#f7fbf2] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                isRTL={isRTL}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modern Contact CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-16 rounded-[4rem] bg-[#1c4b42] text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#86c434]/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/20">
                <MessageCircle className="w-10 h-10 text-[#86c434]" />
              </div>
              <h2 className={`text-4xl font-black mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                {t('faq.stillQuestionsTitle')}
              </h2>
              <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto">
                {t('faq.stillQuestionsSubtitle')}
              </p>
              <Link
                to={getPath("/contact")}
                className="inline-flex items-center gap-4 px-12 py-5 bg-[#86c434] text-[#1c4b42] font-black rounded-[2rem] hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl group"
              >
                {t('faq.contactBtn')}
                <ArrowRight className={`w-6 h-6 transition-transform group-hover:translate-x-2 ${isRTL ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
