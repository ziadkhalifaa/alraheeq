
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateApi } from '@/api/api';
import { toast } from 'sonner';
import { ArrowLeft, Save, Globe, Image as ImageIcon, Hash, X } from 'lucide-react';
import MediaSelectorModal from '@/components/admin/MediaSelectorModal';

export default function CertificateForm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
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
      navigate('/admin/dashboard/certificates');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Operation failed'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleMediaSelect = (url: string) => {
    setFormData({ ...formData, image_url: url });
    setShowMediaLibrary(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/admin/dashboard/certificates')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={20} /> Back to Certificates
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading-en">
              {isEdit ? 'Edit Certificate' : 'Add New Certificate'}
            </h1>
          </div>
          <button onClick={handleSubmit} disabled={mutation.isPending} className="flex items-center gap-2 px-8 py-3 bg-[#1c4b42] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-60">
            <Save size={20} /> {mutation.isPending ? 'Saving...' : 'Save Certificate'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Title (EN) *</label>
                <input required value={formData.title.en} onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#1c4b42] focus:ring-4 focus:ring-[#1c4b42]/5 transition-all outline-none" placeholder="e.g. ISO 9001:2015" />
              </div>
              <div dir="rtl" className="space-y-2 text-right">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mr-1">العنوان (AR) *</label>
                <input required value={formData.title.ar} onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#1c4b42] focus:ring-4 focus:ring-[#1c4b42]/5 transition-all outline-none font-heading-ar" placeholder="مثال: شهادة الأيزو 9001" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Description (EN)</label>
                <textarea rows={3} value={formData.description.en} onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#1c4b42] focus:ring-4 focus:ring-[#1c4b42]/5 transition-all outline-none resize-none" placeholder="Short description for English visitors..." />
              </div>
              <div dir="rtl" className="space-y-2 text-right">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mr-1">الوصف (AR)</label>
                <textarea rows={3} value={formData.description.ar} onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#1c4b42] focus:ring-4 focus:ring-[#1c4b42]/5 transition-all outline-none resize-none font-body-ar" placeholder="وصف مختصر للزوار العرب..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2"><ImageIcon size={16} /> Certificate Image *</label>
                <div className="flex gap-2">
                  <input type="url" required value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="flex-grow px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#1c4b42] focus:ring-4 focus:ring-[#1c4b42]/5 transition-all outline-none" placeholder="Paste URL or choose from library" />
                  <button type="button" onClick={() => setShowMediaLibrary(true)} className="px-6 bg-gray-100 hover:bg-gray-200 text-[#1c4b42] font-bold rounded-2xl transition-all whitespace-nowrap">
                    Library
                  </button>
                </div>
                {formData.image_url && (
                  <div className="mt-3 relative w-32 aspect-square rounded-2xl overflow-hidden border-2 border-[#1c4b42]/10 p-1 group">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2"><Hash size={16} /> Display Order</label>
                <input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#1c4b42] focus:ring-4 focus:ring-[#1c4b42]/5 transition-all outline-none" />
                <p className="text-xs text-gray-400 ml-1">Lower numbers appear first</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <MediaSelectorModal 
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
