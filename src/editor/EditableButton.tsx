import React, { useState } from 'react';
import { useEditor } from './EditorContext';
import { Link } from 'react-router-dom';
import { Settings, Check, X } from 'lucide-react';
import { getSafeValue } from './utils';
import { createPortal } from 'react-dom';

interface EditableButtonProps {
  contentKey: string;
  defaultAr: string;
  defaultEn: string;
  defaultHref: string;
  className?: string;
  icon?: React.ReactNode;
}

export function EditableButton({ 
  contentKey, 
  defaultAr, 
  defaultEn, 
  defaultHref,
  className = '',
  icon
}: EditableButtonProps) {
  const { isEditing, currentLang, pageContent, updateContent } = useEditor();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Get current content using getSafeValue
  const contentValue = pageContent[contentKey] || {};
  const displayLabel = getSafeValue(
    { ar: contentValue.labelAr || defaultAr, en: contentValue.labelEn || defaultEn },
    currentLang
  );
  const displayHref = contentValue.href || defaultHref;

  const [editLabelAr, setEditLabelAr] = useState(contentValue.labelAr || defaultAr);
  const [editLabelEn, setEditLabelEn] = useState(contentValue.labelEn || defaultEn);
  const [editHref, setEditHref] = useState(displayHref);

  const handleSave = () => {
    updateContent(contentKey, {
      labelAr: editLabelAr,
      labelEn: editLabelEn,
      href: editHref
    });
    setIsPopoverOpen(false);
  };

  const buttonContent = (
    <>
      {icon}
      {displayLabel}
    </>
  );

  if (!isEditing) {
    return (
      <Link to={displayHref} className={className}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <div className={`relative inline-block ${className} cursor-pointer hover:ring-2 hover:ring-brand-gold/50 hover:ring-offset-2 transition-all group/btn`}
         onClick={(e) => {
           e.preventDefault();
           e.stopPropagation();
           setIsPopoverOpen(true);
         }}>
      {buttonContent}
      
      {/* Edit indicator - minimal */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-gold rounded-full shadow-sm opacity-0 group-hover/btn:opacity-100 transition-opacity" />

      {/* Popover/Modal using Portal to avoid Z-index/clipping issues */}
      {isPopoverOpen && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={(e) => {
              e.stopPropagation();
              setIsPopoverOpen(false);
            }} 
          />
          
          {/* Content */}
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-gray-900">Edit Button</h4>
              <button 
                onClick={() => setIsPopoverOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Text (Arabic)</label>
                <input 
                  type="text" 
                  value={editLabelAr} 
                  onChange={e => setEditLabelAr(e.target.value)}
                  className="w-full text-base px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Text (English)</label>
                <input 
                  type="text" 
                  value={editLabelEn} 
                  onChange={e => setEditLabelEn(e.target.value)}
                  className="w-full text-base px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link URL</label>
                <input 
                  type="text" 
                  value={editHref} 
                  onChange={e => setEditHref(e.target.value)}
                  className="w-full text-base px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
                  placeholder="/products"
                />
              </div>
              
              <button 
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 bg-brand-green text-white py-4 rounded-2xl text-base font-bold hover:bg-brand-green-dark transition-all hover:shadow-lg active:scale-[0.98] mt-4"
              >
                <Check className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
