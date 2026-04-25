import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi, categoryApi } from '@/api/api';
import { toast } from 'sonner';
import { ArrowLeft, Save, Globe, Image as ImageIcon, Tag, Hash, DollarSign, Plus, Trash2 } from 'lucide-react';
import MediaSelectorModal from '@/components/admin/MediaSelectorModal';

export default function ProductForm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: { ar: '', en: '' },
    description: { ar: '', en: '' },
    slug: '',
    price: '',
    image_url: '',
    images: [] as string[],
    category_id: '',
    origin: 'Egypt',
    specs: {} as Record<string, string>,
  });

  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [showMainImageModal, setShowMainImageModal] = useState(false);
  const [showGalleryImageModal, setShowGalleryImageModal] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(res => res.data),
  });

  useEffect(() => {
    if (isEdit && location.state?.product) {
      const p = location.state.product;
      setFormData({
        name: p.name,
        description: p.description,
        slug: p.slug,
        price: p.price,
        image_url: p.image_url,
        images: p.images || [],
        category_id: p.category_id,
        origin: p.origin || 'Egypt',
        specs: p.specs || {},
      });
    }
  }, [isEdit, location.state]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? productApi.update(Number(id), data) : productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(isEdit ? 'Product updated' : 'Product created');
      navigate('/admin/dashboard');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Operation failed'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addSpec = () => {
    if (newSpecKey && newSpecValue) {
      setFormData(prev => ({ ...prev, specs: { ...prev.specs, [newSpecKey]: newSpecValue } }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...formData.specs };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading-en">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-500 mt-1">Configure your product details and technical specifications</p>
          </div>
          <button onClick={handleSubmit} disabled={mutation.isPending} className="flex items-center gap-2 px-8 py-3 bg-brand-gradient text-white rounded-xl font-bold shadow-brand hover:shadow-brand-lg transition-all hover:-translate-y-0.5 disabled:opacity-60">
            <Save size={20} /> {mutation.isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* English Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-blue-600 font-bold mb-2"><Globe size={20} /> English Content</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name (EN) *</label>
                <input required value={formData.name.en} onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (EN) *</label>
                <textarea rows={4} required value={formData.description.en} onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
            </div>

            {/* Arabic Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6" dir="rtl">
              <div className="flex items-center gap-2 text-brand-gold font-bold mb-2"><Globe size={20} /> المحتوى العربي</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنتج (AR) *</label>
                <input required value={formData.name.ar} onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold/10 font-heading-ar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (AR) *</label>
                <textarea rows={4} required value={formData.description.ar} onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold/10 resize-none font-body-ar" />
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">General Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200">
                  <option value="">Select category</option>
                  {categories?.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name.en}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug *</label>
                <input required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="e.g. dried-basil" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                <input value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
              </div>
            </div>
          </div>

          {/* Gallery & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Specs */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Technical Specs</h3>
              <div className="space-y-4 mb-6">
                {Object.entries(formData.specs).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div><span className="font-medium text-gray-700">{k}:</span> <span className="text-gray-600">{v}</span></div>
                    <button type="button" onClick={() => removeSpec(k)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newSpecKey} onChange={e => setNewSpecKey(e.target.value)} placeholder="Key (e.g. purity)" className="w-1/3 px-4 py-2 rounded-xl border border-gray-200 text-sm" />
                <input value={newSpecValue} onChange={e => setNewSpecValue(e.target.value)} placeholder="Value (e.g. 99%)" className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm" />
                <button type="button" onClick={addSpec} className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"><Plus size={20} /></button>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Image Gallery</h3>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image *</label>
                <div className="flex gap-4 items-center">
                  <button
                    type="button"
                    onClick={() => setShowMainImageModal(true)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed rounded-xl px-4 py-8 text-sm outline-none transition-all flex flex-col items-center justify-center gap-2 text-gray-500 font-bold"
                  >
                    <ImageIcon size={24} className="text-gray-400" />
                    Select Main Image
                  </button>
                </div>
                {formData.image_url && (
                  <div className="mt-4 relative group rounded-2xl overflow-hidden border border-gray-200 max-w-[200px] aspect-square">
                    <img src={formData.image_url} alt="Main" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Gallery Images</label>
                <button
                  type="button"
                  onClick={() => setShowGalleryImageModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-brand-green/10 text-brand-green font-bold rounded-xl hover:bg-brand-green/20 transition-colors mb-4"
                >
                  <Plus size={20} /> Add Gallery Image
                </button>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-white/90 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </form>
      </div>

      <MediaSelectorModal 
        isOpen={showMainImageModal} 
        onClose={() => setShowMainImageModal(false)} 
        onSelect={(url) => setFormData({ ...formData, image_url: url })} 
      />

      <MediaSelectorModal 
        isOpen={showGalleryImageModal} 
        onClose={() => setShowGalleryImageModal(false)} 
        onSelect={(url) => {
          if (!formData.images.includes(url)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
          }
        }} 
      />
    </div>
  );
}

