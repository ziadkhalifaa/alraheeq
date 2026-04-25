import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '@/api/api';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getSafeValue } from '@/editor/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton';

export default function BlogTab() {
  const queryClient = useQueryClient();

  const { data: blogRes, isLoading: loadingBlog } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: () => blogApi.getAll().then(res => res.data),
  });

  const deleteBlog = useMutation({
    mutationFn: (id: number) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Post deleted');
    },
  });

  const posts = Array.isArray(blogRes) ? blogRes : (blogRes?.data || []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Blog & News Management</h2>
        <Link to="/admin/blog/new">
          <Button className="bg-brand-green hover:bg-brand-green-dark gap-2 rounded-xl shadow-brand">
            <Plus size={18} /> New Post
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Post</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loadingBlog ? (
              <tr><td colSpan={4} className="px-6 py-8"><TableSkeleton rows={5} /></td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-400">No blog posts found</td></tr>
            ) : posts.map((post: any) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-4">
                  <img src={post.image_url || 'https://via.placeholder.com/150'} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                  <div>
                    <div className="font-bold text-gray-900">{getSafeValue(post.title, 'en') || 'No title'}</div>
                    <div className="text-xs text-gray-400">{post.slug}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="capitalize">
                    {getSafeValue(post.status, 'en') || 'Published'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <a href={`/ar/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-brand-green hover:bg-green-50 rounded-lg transition-colors" title="View Post">
                      <Eye size={18} />
                    </a>
                    <Link to={`/admin/blog/edit/${post.id}`} state={{ post }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Post">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => { if(confirm('Delete post?')) deleteBlog.mutate(post.id) }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Post">
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
