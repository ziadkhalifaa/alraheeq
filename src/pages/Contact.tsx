import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';
import { toast } from 'sonner';
import { inquiryApi } from '@/api/api';

function useRevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll('.animate-reveal, .animate-reveal-left, .animate-reveal-right, .animate-scale-in');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  product: string;
  message: string;
}

export default function Contact() {
  const { t, isRTL, getPath } = useLanguage();
  useRevealObserver();

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', company: '', product: '', message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await inquiryApi.create(form);
      setSent(true);
      toast.success(t('contact.form.success'));
      setForm({ name: '', email: '', phone: '', company: '', product: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error(isRTL ? 'حدث خطأ أثناء الإرسال' : 'Failed to send inquiry');
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    { icon: Mail, label: isRTL ? 'البريد الإلكتروني' : 'Email', value: 'info@alraheeqherbs.com', href: 'mailto:info@alraheeqherbs.com' },
    { icon: Phone, label: isRTL ? 'الهاتف' : 'Phone', value: '+20 1010213937', href: 'tel:+201010213937' },
    { icon: MapPin, label: isRTL ? 'العنوان' : 'Address', value: t('contact.info.address'), href: '#' },
  ];

  const productOptions = [
    { value: 'herbs', labelAr: 'الأعشاب والمنقوعات', labelEn: 'Herbs & Infusions' },
    { value: 'seeds', labelAr: 'البذور', labelEn: 'Seeds' },
    { value: 'spices', labelAr: 'التوابل', labelEn: 'Spices' },
    { value: 'dehydrated', labelAr: 'الخضروات المجففة', labelEn: 'Dehydrated Vegetables' },
    { value: 'mixed', labelAr: 'منتجات متعددة', labelEn: 'Mixed Products' },
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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionBadge className="mb-4 !bg-white/10 !text-white !border-white/20">
            {t('contact.hero.badge')}
          </SectionBadge>
          <h1 className={`text-5xl lg:text-6xl font-bold text-white mt-4 mb-4 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
            {t('contact.hero.title')}{' '}
            <span className="text-brand-gold">{t('contact.hero.titleAccent')}</span>
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">{t('contact.hero.subtitle')}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Info (Left) */}
            <div className="lg:col-span-2 space-y-6 animate-reveal-left">
              {/* Company card */}
              <div className="glass-card rounded-3xl p-8 border border-brand-gold/15">
                <img
                  src="https://cdn-ai.onspace.ai/onspace/project/uploads/MoJYwGH33bc9qvJ38ADo9Y/AlraheeqLogoWeb.png"
                  alt="Alraheeq Herbs"
                  className="h-14 w-auto object-contain mb-5"
                />
                <h2 className={`text-xl font-bold text-gray-900 mb-1 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                  {t('contact.info.company')}
                </h2>
                <p className="text-brand-green text-sm font-medium mb-5">{t('contact.info.country')}</p>

                <div className="space-y-4">
                  {contactItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={i}
                        href={item.href}
                        className="flex items-start gap-4 p-3 rounded-xl hover:bg-brand-green/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-brand group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                          <p className="text-sm font-medium text-gray-700 group-hover:text-brand-green transition-colors" dir="ltr">
                            {item.value}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/201010213937"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#25D366] text-white hover:bg-[#1da859] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">{t('contact.info.whatsapp')}</p>
                  <p className="text-white/80 text-sm" dir="ltr">+20 1010213937</p>
                </div>
              </a>

              {/* Map placeholder */}
              <div className="rounded-3xl overflow-hidden h-48 bg-brand-green/10 border border-brand-green/20 relative">
                <iframe
                  title="Alraheeq Herbs Location"
                  src="https://maps.google.com/maps?q=Beni+Suef,+Egypt&t=&z=9&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Contact Form (Right) */}
            <div className="lg:col-span-3 animate-reveal-right">
              <div className="glass-card rounded-3xl p-8 md:p-10 border border-brand-gold/15">
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center mb-5">
                      <CheckCircle2 className="w-10 h-10 text-brand-green" />
                    </div>
                    <h3 className={`text-2xl font-bold text-gray-900 mb-3 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                      {t('contact.form.successTitle')}
                    </h3>
                    <p className="text-gray-500 max-w-sm">{t('contact.form.success')}</p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', company: '', product: '', message: '' }); }}
                      className="mt-6 px-6 py-3 rounded-xl border border-brand-green/30 text-brand-green font-medium hover:bg-brand-green/5 transition-colors"
                    >
                      {t('contact.form.sendAnother')}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className={`text-xl font-bold text-gray-900 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                          {t('contact.form.title')}
                        </h2>
                        <p className="text-gray-400 text-sm">{t('contact.cta.title')}</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {t('contact.form.name')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={t('contact.form.namePlaceholder')}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all bg-white text-sm"
                          />
                        </div>
                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {t('contact.form.email')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder={t('contact.form.emailPlaceholder')}
                            required
                            dir="ltr"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all bg-white text-sm"
                          />
                        </div>
                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {t('contact.form.phone')}
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder={t('contact.form.phonePlaceholder')}
                            dir="ltr"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all bg-white text-sm"
                          />
                        </div>
                        {/* Company */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {t('contact.form.company')}
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            placeholder={t('contact.form.companyPlaceholder')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all bg-white text-sm"
                          />
                        </div>
                      </div>

                      {/* Product */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contact.form.product')}
                        </label>
                        <select
                          name="product"
                          value={form.product}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all bg-white text-sm text-gray-700 appearance-none"
                        >
                          <option value="">{t('contact.form.productPlaceholder')}</option>
                          {productOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {isRTL ? opt.labelAr : opt.labelEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contact.form.message')} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder={t('contact.form.messagePlaceholder')}
                          required
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all bg-white text-sm resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full btn-magnetic flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-brand-gradient text-white font-semibold shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {sending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('contact.form.sending')}
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {t('contact.form.submit')}
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
