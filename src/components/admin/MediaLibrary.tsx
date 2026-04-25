import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '@/api/api';
import { UploadCloud, Image as ImageIcon, Trash2, Copy, CheckCircle, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  isModal?: boolean;
}

export default function MediaLibrary({ onSelect, isModal = false }: MediaLibraryProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data: mediaRes, isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: () => mediaApi.getAll().then(res => res.data),
  });

  const media = Array.isArray(mediaRes) ? mediaRes : (mediaRes?.data || []);
  const filteredMedia = media.filter((m: any) => 
    m.filename.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => mediaApi.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Image uploaded and optimized successfully');
    },
    onError: () => {
      toast.error('Failed to upload image');
    },
    onSettled: () => setUploading(false)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mediaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Image deleted');
    },
    onError: () => {
      toast.error('Failed to delete image');
    }
  });

  const handleUpload = (file: File) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'general'); // Or determine based on context
    uploadMutation.mutate(formData);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const copyUrl = (url: string, id: number) => {
    const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getFullUrl = (url: string) => {
    return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`;
  };

  return (
    <div className={`flex flex-col h-full ${!isModal ? 'bg-white rounded-3xl border border-gray-100 shadow-sm' : ''}`}>
      {/* Toolbar */}
      <div className={`p-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center ${isModal ? 'bg-gray-50/50' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-green/20 w-64 text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-green text-white rounded-xl font-semibold shadow-brand hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UploadCloud size={18} />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      {/* Upload Zone & Grid */}
      <div 
        className="flex-grow p-6 overflow-y-auto"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {dragActive && (
          <div className="absolute inset-0 z-50 bg-brand-green/10 border-4 border-dashed border-brand-green rounded-3xl flex items-center justify-center backdrop-blur-sm m-6 transition-all">
            <div className="text-center">
              <UploadCloud size={64} className="mx-auto text-brand-green mb-4" />
              <h3 className="text-2xl font-bold text-brand-green">Drop image here</h3>
              <p className="text-brand-green/80 mt-2">File will be automatically optimized to WebP</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ImageIcon size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No media found</h3>
            <p className="text-gray-500 max-w-sm mb-6">Upload images to your library. They will be automatically converted to highly optimized WebP formats.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-brand-green font-bold hover:underline"
            >
              Click here to upload
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMedia.map((item: any) => (
              <div 
                key={item.id} 
                className="group relative aspect-square rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => onSelect && onSelect(getFullUrl(item.url))}
              >
                <img 
                  src={getFullUrl(item.url)} 
                  alt={item.filename} 
                  className="w-full h-full object-cover"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-mono text-white">
                      {(item.size / 1024).toFixed(1)} KB
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(confirm('Delete image?')) deleteMutation.mutate(item.id) }}
                      className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); copyUrl(item.url, item.id); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      {copiedId === item.id ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                      {copiedId === item.id ? 'Copied' : 'Copy'}
                    </button>
                    {onSelect && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelect(getFullUrl(item.url)); }}
                        className="flex-1 flex items-center justify-center py-1.5 bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
