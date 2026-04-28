import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { mediaApi } from '@/api/api';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getImgUrl } from '@/editor/utils';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { data: media, isLoading, refetch } = useQuery({
    queryKey: ['editor-media'],
    queryFn: () => mediaApi.getAll().then(res => res.data), // Get all media across folders
    enabled: isOpen
  });

  if (!isOpen) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'general');

      const res = await mediaApi.upload(formData);
      toast.success('Image uploaded successfully');
      refetch();
      onSelect(res.data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Media Library</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">Select an existing asset or upload a new one</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-all hover:rotate-90 duration-300"
          >
            <X className="w-7 h-7 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar / Upload area */}
            <div className="lg:col-span-1">
              <label className="sticky top-0 flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer bg-white hover:bg-gray-50 hover:border-brand-green transition-all group overflow-hidden">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-brand-green" />
                  </div>
                  <p className="mb-2 text-sm text-gray-700 font-bold">
                    Upload New
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Drop your image here or click to browse
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
                
                {isUploading && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-3" />
                    <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">Uploading</span>
                  </div>
                )}
              </label>
            </div>

            {/* Grid Area */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4" />
                  <p className="text-gray-400 font-medium">Loading your library...</p>
                </div>
              ) : media?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {media.map((item: any) => (
                    <div 
                      key={item.id}
                      onClick={() => onSelect(item.url)}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 cursor-pointer hover:border-brand-green hover:shadow-xl transition-all"
                    >
                      <img 
                        src={getImgUrl(item.url)} 
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-brand-green/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white text-brand-green px-4 py-2 rounded-xl text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          Select Image
                        </span>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[8px] text-white font-bold uppercase tracking-widest">
                          {item.folder}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg">Your library is empty</h3>
                  <p className="text-gray-500 mt-1 max-w-xs text-center">Upload your first image to start building your media collection.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
