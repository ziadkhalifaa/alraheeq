import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiryApi } from '@/api/api';
import { Mail, FileText, ExternalLink, Search, LayoutGrid, List, MoreVertical, PhoneForwarded, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { getSafeValue } from '@/editor/utils';
import { TableSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export default function InquiriesTab() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);

  const { data: inquiriesRes, isLoading: loadingInquiries } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: () => inquiryApi.getAll().then(res => res.data),
  });

  const updateInquiryStatus = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => inquiryApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-unread-count'] });
      toast.success('Status updated');
    },
  });

  const updateCRM = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => inquiryApi.updateCRM(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-unread-count'] });
      toast.success('Lead updated');
    },
  });

  const inquiries = Array.isArray(inquiriesRes) ? inquiriesRes : (inquiriesRes?.data || []);
  const validInquiries = inquiries.filter((i: any) => i && typeof i === 'object');

  const handleExportCSV = async () => {
    try {
      const response = await inquiryApi.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const columns = [
    { id: 'pending', title: 'Pending', color: 'bg-gray-100' },
    { id: 'contacted', title: 'Contacted', color: 'bg-blue-50' },
    { id: 'quote_sent', title: 'Quote Sent', color: 'bg-amber-50' },
    { id: 'closed', title: 'Closed', color: 'bg-green-50' },
    { id: 'lost', title: 'Lost', color: 'bg-red-50' },
  ];

  const renderTable = () => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Priority</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loadingInquiries ? (
            <tr><td colSpan={5} className="px-6 py-8"><TableSkeleton rows={5} /></td></tr>
          ) : validInquiries.map((inq: any) => (
            <tr key={inq.id} className={`hover:bg-gray-50/80 transition-colors ${!inq.is_read ? 'bg-blue-50/30' : ''}`}>
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  {inq.name}
                  {!inq.is_read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <div className="text-xs text-gray-500">{inq.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 font-medium">
                  {getSafeValue(inq.product_name, 'en') || 'General Inquiry'}
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge className={`uppercase text-[10px] ${
                  inq.priority === 'high' ? 'bg-red-100 text-red-700' : 
                  inq.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 
                  'bg-gray-100 text-gray-500'
                }`}>
                  {inq.priority || 'low'}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <select 
                  value={inq.status || 'pending'} 
                  onChange={(e) => updateInquiryStatus.mutate({ id: inq.id, status: e.target.value })}
                  className="text-xs bg-transparent border-none focus:ring-0 font-medium text-gray-600 cursor-pointer hover:text-brand-green"
                >
                  {columns.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                </select>
              </td>
              <td className="px-6 py-4 text-right">
                <Button variant="ghost" size="icon" onClick={() => setSelectedInquiryId(inq.id)}>
                  <ExternalLink size={18} className="text-brand-green" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderKanban = () => (
    <div className="flex gap-6 overflow-x-auto pb-6 -mx-8 px-8">
      {columns.map(col => (
        <div key={col.id} className="flex-shrink-0 w-80 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              {col.title}
              <Badge variant="secondary" className="rounded-full h-5 w-5 flex items-center justify-center p-0">
                {validInquiries.filter((i: any) => (i.status || 'pending') === col.id).length}
              </Badge>
            </h3>
          </div>
          <div className={`p-3 rounded-2xl ${col.color} min-h-[500px] space-y-3`}>
            {validInquiries.filter((i: any) => (i.status || 'pending') === col.id).map((inq: any) => (
              <motion.div 
                layoutId={`inq-${inq.id}`}
                key={inq.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedInquiryId(inq.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-gray-900 text-sm">{inq.name}</div>
                  <Badge className={`text-[9px] px-1.5 py-0 ${
                    inq.priority === 'high' ? 'bg-red-500' : inq.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-400'
                  }`}>
                    {inq.priority?.charAt(0).toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mb-3 truncate">{getSafeValue(inq.product_name, 'en') || 'General'}</div>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock size={10} /> {new Date(inq.created_at).toLocaleDateString()}
                  </div>
                  {inq.last_contacted_at && <CheckCircle2 size={12} className="text-brand-green" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Lead Intelligence</h2>
          <p className="text-sm text-gray-500">Track and manage customer conversions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 rounded-xl">
            <FileText size={18} /> Export
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? renderTable() : renderKanban()}
    </div>
  );
}
