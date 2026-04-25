import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { inquiryApi } from '@/api/api';
import { useLanguage } from '@/hooks/useLanguage';
import { Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTracking } from '@/hooks/useTracking';

interface InquiryFormProps {
  productName?: string;
  productId?: number;
}

export default function InquiryForm({ productName = '', productId }: InquiryFormProps) {
  const { t, isRTL } = useLanguage();
  const { trackEvent } = useTracking();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    message: productName ? `I am interested in ordering ${productName}. Please provide a quote.` : '',
    product_id: productId || null,
    source: window.location.pathname.includes('products/') ? 'product_page' : 'homepage'
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => inquiryApi.create(data),
    onSuccess: () => {
      setIsSuccess(true);
      trackEvent('inquiry_submit', productId);
      toast.success(isRTL ? 'تم إرسال استفسارك بنجاح!' : 'Inquiry sent successfully!');
      setTimeout(() => setIsSuccess(false), 8000);
      setFormData(prev => ({
        ...prev,
        name: '', email: '', phone: '', company: '', quantity: '',
        message: productName ? `I am interested in ordering ${productName}. Please provide a quote.` : '',
      }));
    },
    onError: () => {
      toast.error(isRTL ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'Error sending inquiry. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-10 border-2 border-brand-green/30 text-center bg-brand-green/5 shadow-brand-lg"
      >
        <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-brand">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {isRTL ? 'تم الإرسال بنجاح' : 'Request Received!'}
        </h3>
        <p className="text-gray-600 mb-6">
          {isRTL 
            ? 'شكراً لتواصلك مع الرحيق للأعشاب. سيقوم فريق التصدير لدينا بمراجعة طلبك والرد عليك خلال 24 ساعة.' 
            : 'Thank you for contacting Alraheeq Herbs. Our export team will review your request and get back to you within 24 hours.'}
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-brand-green font-bold hover:underline"
        >
          {isRTL ? 'إرسال استفسار آخر' : 'Send another inquiry'}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 border border-gray-100 shadow-xl bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-brand-gradient" />
      
      <h3 className={`text-2xl font-bold text-gray-900 mb-2 ${isRTL ? 'font-heading-ar text-right' : 'font-heading-en'}`}>
        {isRTL ? 'طلب تسعيرة بالجملة' : 'Wholesale Quote Request'}
      </h3>
      <p className="text-gray-500 text-sm mb-8">{isRTL ? 'أكمل النموذج وسيقوم فريقنا بالرد عليك فوراً' : 'Complete the form and our team will respond shortly'}</p>
      
      <form onSubmit={handleSubmit} className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
            <input
              type="text"
              name="name"
              required
              placeholder={isRTL ? 'مثال: محمد علي' : 'e.g. John Doe'}
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all bg-gray-50/50 placeholder:text-gray-300"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all bg-gray-50/50 placeholder:text-gray-300 text-left"
              dir="ltr"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+20 123 456 789"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all bg-gray-50/50 placeholder:text-gray-300 text-left"
              dir="ltr"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{isRTL ? 'الشركة / الوجهة' : 'Company / Destination'}</label>
            <input
              type="text"
              name="company"
              placeholder={isRTL ? 'اسم الشركة أو الدولة' : 'Company or Country'}
              value={formData.company}
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all bg-gray-50/50 placeholder:text-gray-300"
            />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{isRTL ? 'الكمية التقريبية' : 'Approx. Quantity'}</label>
          <input
            type="text"
            name="quantity"
            required
            placeholder={isRTL ? 'مثال: 5 طن أو 100 كرتونة' : 'e.g. 5 Tons or 100 Cartons'}
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all bg-gray-50/50 placeholder:text-gray-300"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{isRTL ? 'متطلبات إضافية' : 'Additional Requirements'}</label>
          <textarea
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all bg-gray-50/50 placeholder:text-gray-300 resize-none"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={mutation.isPending}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-brand-gradient text-white rounded-2xl font-bold shadow-brand hover:shadow-brand-lg transition-all disabled:opacity-70"
        >
          {mutation.isPending ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-lg">{isRTL ? 'إرسال الطلب الآن' : 'Submit Request Now'}</span>
            </>
          )}
        </motion.button>
        
        <p className="text-[10px] text-gray-400 text-center mt-4">
          {isRTL 
            ? 'بإرسال هذا الطلب، أنت توافق على سياسة الخصوصية الخاصة بنا.' 
            : 'By submitting this form, you agree to our privacy policy and terms of export.'}
        </p>
      </form>
    </div>
  );
}
