import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Building2, Package, Calendar, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSafeValue } from '@/editor/utils';

interface InquiryDetailModalProps {
  inquiry: any;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => void;
}

export default function InquiryDetailModal({ inquiry, onClose, onUpdateStatus }: InquiryDetailModalProps) {
  if (!inquiry) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-[#1c4b42] p-8 text-white relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <UserIcon name={inquiry.name} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{inquiry.name}</h2>
                <p className="text-white/60 text-sm">{inquiry.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#86c434] text-[#1c4b42] border-none">
                {inquiry.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {inquiry.priority?.toUpperCase() || 'LOW'} PRIORITY
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem icon={Mail} label="Email" value={inquiry.email} href={`mailto:${inquiry.email}`} />
              <DetailItem icon={Phone} label="Phone" value={inquiry.phone || 'N/A'} href={inquiry.phone ? `tel:${inquiry.phone}` : undefined} />
              <DetailItem icon={Building2} label="Company" value={inquiry.company || 'N/A'} />
              <DetailItem icon={Package} label="Interested Product" value={getSafeValue(inquiry.product_name, 'en') || 'General Inquiry'} />
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-[#1c4b42] font-bold">
                <MessageSquare size={18} />
                Message
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {inquiry.message || 'No message provided.'}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Received on {new Date(inquiry.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                {new Date(inquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Footer/Actions */}
          <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
            <select 
              value={inquiry.status || 'pending'} 
              onChange={(e) => onUpdateStatus(inquiry.id, e.target.value)}
              className="flex-grow h-12 px-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#86c434] font-bold text-[#1c4b42]"
            >
              <option value="pending">Mark as Pending</option>
              <option value="contacted">Mark as Contacted</option>
              <option value="quote_sent">Quote Sent</option>
              <option value="closed">Closed / Deal Won</option>
              <option value="lost">Lost / No Interest</option>
            </select>
            <Button onClick={onClose} className="h-12 px-8 bg-[#1c4b42] hover:bg-[#2a6b5e] text-white rounded-xl">
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function DetailItem({ icon: Icon, label, value, href }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#f7fbf2] flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#1c4b42]" />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        {href ? (
          <a href={href} className="text-gray-900 font-bold hover:text-[#86c434] transition-colors truncate block max-w-[200px]">
            {value}
          </a>
        ) : (
          <p className="text-gray-900 font-bold truncate block max-w-[200px]">{value}</p>
        )}
      </div>
    </div>
  );
}

function UserIcon({ name }: { name: string }) {
  const initial = name?.charAt(0).toUpperCase() || '?';
  return (
    <span className="text-2xl font-black text-white">{initial}</span>
  );
}
