import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, analyticsApi } from '@/api/api';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, LayoutGrid, List, Filter, ArrowUpDown, Package } from 'lucide-react';
import { toast } from 'sonner';
import { getSafeValue } from '@/editor/utils';
import { TableSkeleton, CardSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProductsTab() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');

  const { data: response, isLoading: loadingProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productApi.getAll(undefined, 1, 100).then(res => res.data),
  });

  const { data: perfRes } = useQuery({
    queryKey: ['admin-perf'],
    queryFn: () => analyticsApi.getProducts().then(res => res.data),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: number) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
  });

  const products = response?.data || [];
  
  const filtered = products.filter((p: any) => {
    const matchesSearch = p.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.name?.ar?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' ? true : (p.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const renderTable = () => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">
              <div className="flex items-center gap-1 cursor-pointer hover:text-brand-green">
                Views <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Inquiries</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loadingProducts ? (
            [...Array(5)].map((_, i) => (
              <tr key={i}>
                <td colSpan={5} className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : filtered.length === 0 ? (
            <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-400">No products found</td></tr>
          ) : filtered.map((product: any) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 flex items-center gap-4">
                <img src={product.image_url} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                <div>
                  <div className="font-bold text-gray-900">{getSafeValue(product.name, 'en')}</div>
                  <div className="text-xs text-gray-400">{getSafeValue(product.name, 'ar')}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 font-medium text-gray-900">
                  <Eye size={14} className="text-gray-400" />
                  {Number(perfRes?.find((p:any) => p.id === product.id)?.total_views || 0)}
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">
                {Number(perfRes?.find((p:any) => p.id === product.id)?.total_inquiries || 0)}
              </td>
              <td className="px-6 py-4">
                <Badge variant={product.status === 'draft' ? 'secondary' : 'default'} className="capitalize">
                  {product.status || 'active'}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link to={`/admin/products/edit/${product.id}`} state={{ product }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => { if(confirm('Delete product?')) deleteProduct.mutate(product.id) }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loadingProducts ? (
        <CardSkeleton count={8} />
      ) : filtered.map((product: any) => (
        <div key={product.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <div className="aspect-square relative">
            <img src={product.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute top-3 right-3 flex gap-2">
              <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border-none shadow-sm capitalize">
                {product.status || 'active'}
              </Badge>
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Link to={`/admin/products/edit/${product.id}`} className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center hover:scale-110 transition-transform">
                <Edit size={18} />
              </Link>
              <button onClick={() => { if(confirm('Delete?')) deleteProduct.mutate(product.id) }} className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center hover:scale-110 transition-transform">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="font-bold text-gray-900 truncate">{getSafeValue(product.name, 'en')}</div>
            <div className="text-xs text-gray-400 mb-3">{getSafeValue(product.name, 'ar')}</div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Eye size={12} /> {Number(perfRes?.find((p:any) => p.id === product.id)?.total_views || 0)}
              </div>
              <Badge variant="outline" className="text-[10px]">
                {perfRes?.find((p:any) => p.id === product.id)?.performance || 'low'}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-200">
          <button 
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-brand-green text-white shadow-brand' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-green text-white shadow-brand' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutGrid size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-green bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
          <Link to="/admin/products/new" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-brand-green text-white rounded-xl font-semibold shadow-brand hover:-translate-y-0.5 transition-all">
            <Plus size={18} /> Add
          </Link>
        </div>
      </div>

      {viewMode === 'table' ? renderTable() : renderGrid()}
      
      {filtered.length === 0 && !loadingProducts && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Package className="mx-auto text-gray-200 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No products match your criteria</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-1">Try adjusting your filters or search term to find what you're looking for.</p>
          <Button variant="outline" className="mt-6" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';
