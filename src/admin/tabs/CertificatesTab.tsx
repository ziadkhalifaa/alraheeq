import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateApi } from '@/api/api';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import { toast } from 'sonner';
import { getSafeValue } from '@/editor/utils';
import { TableSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function CertificatesTab() {
  const queryClient = useQueryClient();

  const { data: certsRes, isLoading: loadingCerts } = useQuery({
    queryKey: ['admin-certs'],
    queryFn: () => certificateApi.getAll().then(res => res.data),
  });

  const deleteCert = useMutation({
    mutationFn: (id: number) => certificateApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certs'] });
      toast.success('Certificate deleted');
    },
  });

  const certs = Array.isArray(certsRes) ? certsRes : (certsRes?.data || []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Quality Certificates</h2>
        <Link to="/admin/certificates/new">
          <Button className="bg-brand-green hover:bg-brand-green-dark gap-2 rounded-xl shadow-brand">
            <Plus size={18} /> Add Certificate
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Certificate</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loadingCerts ? (
              <tr><td colSpan={2} className="px-6 py-8"><TableSkeleton rows={5} cols={2} /></td></tr>
            ) : certs.length === 0 ? (
              <tr><td colSpan={2} className="px-6 py-20 text-center text-gray-400">No certificates found</td></tr>
            ) : certs.map((cert: any) => (
              <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                    <img src={cert.image_url} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="font-bold text-gray-900">{getSafeValue(cert.title, 'en') || 'Untitled'}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/certificates/edit/${cert.id}`} state={{ certificate: cert }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => { if(confirm('Delete certificate?')) deleteCert.mutate(cert.id) }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
