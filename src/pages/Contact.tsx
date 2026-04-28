import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Leaf, Globe, Building2, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import SectionBadge from '@/components/features/SectionBadge';
import { EditableText } from '@/editor/EditableText';
import { toast } from 'sonner';
import { inquiryApi } from '@/api/api';

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
  const containerRef = useRef(null);

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
    { icon: Mail, label: isRTL ? 'البريد الإلكتروني' : 'Email', value: 'info@alraheeqherbs.com', href: 'mailto:info@alraheeqherbs.com', color: 'bg-blue-500' },
    { icon: Phone, label: isRTL ? 'الهاتف' : 'Phone', value: '+20 1010213937', href: 'tel:+201010213937', color: 'bg-[#86c434]' },
    { icon: MapPin, label: isRTL ? 'العنوان' : 'Address', value: t('contact.info.address'), href: '#', color: 'bg-emerald-500' },
  ];

  const productOptions = [
    { value: 'herbs', labelAr: 'الأعشاب والمنقوعات', labelEn: 'Herbs & Infusions' },
    { value: 'seeds', labelAr: 'البذور', labelEn: 'Seeds' },
    { value: 'spices', labelAr: 'التوابل', labelEn: 'Spices' },
    { value: 'dehydrated', labelAr: 'الخضروات المجففة', labelEn: 'Dehydrated Vegetables' },
    { value: 'mixed', labelAr: 'منتجات متعددة', labelEn: 'Mixed Products' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
  };

  return (
    <main className="overflow-hidden bg-white pt-20" ref={containerRef}>
      {/* High-End Modern Hero */}
      <section className="relative py-32 bg-[#1c4b42] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full pattern-grid" />
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.div variants={fadeInUp}>
            <SectionBadge className="mb-8 bg-white/10 text-white border-white/20 backdrop-blur-md">
              <EditableText contentKey="contact.hero.badge" defaultAr="تواصل معنا" defaultEn="Contact Us" />
            </SectionBadge>
          </motion.div>
          <motion.h1 
            variants={fadeInUp}
            className={`text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}
          >
            {t('contact.hero.title')}{' '}
            <span className="text-[#86c434] block mt-2">{t('contact.hero.titleAccent')}</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            {t('contact.hero.subtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Interactive Contact & Form Section */}
      <section className="py-32 bg-[#f7fbf2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Contact Cards (Left) */}
            <div className="lg:col-span-4 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1c4b42]/5 rounded-full -mr-16 -mt-16" />
                <h3 className={`text-2xl font-bold text-[#1c4b42] mb-8 ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                  {isRTL ? 'معلومات التواصل' : 'Contact Info'}
                </h3>
                <div className="space-y-6">
                  {contactItems.map((item, i) => (
                    <motion.a
                      key={i}
                      href={item.href}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-5 p-4 rounded-xl hover:bg-gray-50 transition-all group"
                    >
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                        <p className="text-base font-bold text-[#1c4b42] group-hover:text-[#86c434] transition-colors" dir="ltr">{item.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-gray-100">
                  <h4 className="text-gray-900 font-bold mb-6">{isRTL ? 'تواصل معنا عبر واتساب' : 'Chat via WhatsApp'}</h4>
                  <a
                    href="https://wa.me/201010213937"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 bg-[#25D366] rounded-xl text-white shadow-lg hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-base">{isRTL ? 'ابدأ الدردشة' : 'Start Chatting'}</span>
                    </div>
                    <Send className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </a>
                </div>
              </motion.div>

              {/* Map Card */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="h-[300px] rounded-2xl overflow-hidden border-4 border-white shadow-xl relative"
              >
                <iframe
                  title="Alraheeq Herbs Location"
                  src="https://maps.google.com/maps?q=منشاة+أبو+مليح،+سمسطا،+بني+سويف&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* Premium Contact Form (Right) */}
            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100"
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20"
                    >
                      <div className="w-24 h-24 bg-[#f7fbf2] rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-12 h-12 text-[#86c434]" />
                      </div>
                      <h3 className="text-4xl font-black text-[#1c4b42] mb-6">{t('contact.form.successTitle')}</h3>
                      <p className="text-gray-500 text-xl max-w-md mx-auto mb-10">{t('contact.form.success')}</p>
                      <button
                        onClick={() => setSent(false)}
                        className="px-10 py-5 bg-[#1c4b42] text-white font-black rounded-2xl hover:bg-[#86c434] transition-all"
                      >
                        {t('contact.form.sendAnother')}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="form">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-[#1c4b42] rounded-lg flex items-center justify-center">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className={`text-2xl font-bold text-[#1c4b42] ${isRTL ? 'font-heading-ar' : 'font-heading-en'}`}>
                            {t('contact.form.title')}
                          </h2>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('contact.cta.title')}</p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="relative group">
                            <label className="block text-sm font-black text-[#1c4b42] mb-2 uppercase tracking-widest">{t('contact.form.name')} *</label>
                            <div className="relative">
                              <User className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#86c434] transition-colors`} size={20} />
                              <input 
                                required name="name" value={form.name} onChange={handleChange}
                                className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#86c434] focus:bg-white outline-none transition-all font-bold`}
                                placeholder={t('contact.form.namePlaceholder')}
                              />
                            </div>
                          </div>
                          
                          <div className="relative group">
                            <label className="block text-sm font-black text-[#1c4b42] mb-2 uppercase tracking-widest">{t('contact.form.email')} *</label>
                            <div className="relative">
                              <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#86c434] transition-colors`} size={20} />
                              <input 
                                type="email" required name="email" value={form.email} onChange={handleChange} dir="ltr"
                                className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#86c434] focus:bg-white outline-none transition-all font-bold`}
                                placeholder={t('contact.form.emailPlaceholder')}
                              />
                            </div>
                          </div>

                          <div className="relative group">
                            <label className="block text-sm font-black text-[#1c4b42] mb-2 uppercase tracking-widest">{t('contact.form.phone')}</label>
                            <div className="relative">
                              <Phone className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#86c434] transition-colors`} size={20} />
                              <input 
                                name="phone" value={form.phone} onChange={handleChange} dir="ltr"
                                className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#86c434] focus:bg-white outline-none transition-all font-bold`}
                                placeholder={t('contact.form.phonePlaceholder')}
                              />
                            </div>
                          </div>

                          <div className="relative group">
                            <label className="block text-sm font-black text-[#1c4b42] mb-2 uppercase tracking-widest">{t('contact.form.company')}</label>
                            <div className="relative">
                              <Building2 className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#86c434] transition-colors`} size={20} />
                              <input 
                                name="company" value={form.company} onChange={handleChange}
                                className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#86c434] focus:bg-white outline-none transition-all font-bold`}
                                placeholder={t('contact.form.companyPlaceholder')}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="relative group">
                          <label className="block text-sm font-black text-[#1c4b42] mb-2 uppercase tracking-widest">{t('contact.form.product')}</label>
                          <div className="relative">
                            <Leaf className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#86c434] transition-colors`} size={20} />
                            <select 
                              name="product" value={form.product} onChange={handleChange}
                              className={`w-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#86c434] focus:bg-white outline-none transition-all font-bold appearance-none`}
                            >
                              <option value="">{t('contact.form.productPlaceholder')}</option>
                              {productOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{isRTL ? opt.labelAr : opt.labelEn}</option>
                              ))}
                            </select>
                            <ChevronDown className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none`} />
                          </div>
                        </div>

                        <div className="relative group">
                          <label className="block text-sm font-black text-[#1c4b42] mb-2 uppercase tracking-widest">{t('contact.form.message')} *</label>
                          <textarea 
                            required name="message" value={form.message} onChange={handleChange}
                            rows={5}
                            className="w-full px-6 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#86c434] focus:bg-white outline-none transition-all font-bold resize-none"
                            placeholder={t('contact.form.messagePlaceholder')}
                          />
                        </div>

                        <button 
                          disabled={sending}
                          className="w-full py-4 bg-[#1c4b42] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                          {sending ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send size={20} />
                              {t('contact.form.submit')}
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
