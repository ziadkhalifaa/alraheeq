
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateApi } from '@/api/api';
import { toast } from 'sonner';
import { ArrowLeft, Save, Globe, Image as ImageIcon, Hash } from 'lucide-react';

export default function CertificateForm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: { ar: '', en: '' },
    description: { ar: '', en: '' },
    image_url: '',
    order_index: 0
  });

  useEffect(() => {
    if (isEdit && location.state?.certificate) {
      const c = location.state.certificate;
      setFormData({
        title: c.title,
        description: c.description || { ar: '', en: '' },
        image_url: c.image_url,
        order_index: c.order_index || 0
      });
    }
  }, [isEdit, location.state]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? certificateApi.update(Number(id), data) : certificateApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certs'] });
      toast.success(isEdit ? 'Certificate updated' : 'Certificate created');
      navigate('/admin/dashboard');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Operation failed'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading-en">
              {isEdit ? 'Edit Certificate' : 'Add New Certificate'}
            </h1>
          </div>
          <button onClick={handleSubmit} disabled={mutation.isPending} className="flex items-center gap-2 px-8 py-3 bg-brand-gradient text-white rounded-xl font-bold shadow-brand hover:shadow-brand-lg transition-all hover:-translate-y-0.5 disabled:opacity-60">
            <Save size={20} /> {mutation.isPending ? 'Saving...' : 'Save Certificate'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (EN) *</label>
                <input required value={formData.title.en} onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان (AR) *</label>
                <input required value={formData.title.ar} onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold/10 font-heading-ar" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (EN)</label>
                <textarea rows={3} value={formData.description.en} onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 resize-none text-sm" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (AR)</label>
                <textarea rows={3} value={formData.description.ar} onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold/10 resize-none text-sm font-body-ar" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><ImageIcon size={16} /> Image URL *</label>
                <input type="url" required value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Hash size={16} /> Order Index</label>
                <input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
