import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pageApi } from '@/api/api';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Globe, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getSafeValue } from '@/editor/utils';

export default function PagesManager() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: () => pageApi.getAll().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => pageApi.create(data),
    onSuccess: () => {
      toast.success('Page created');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setIsCreating(false);
      setNewTitle('');
      setNewSlug('');
    },
    onError: () => toast.error('Failed to create page')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pageApi.delete(id),
    onSuccess: () => {
      toast.success('Page deleted');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: () => toast.error('Failed to delete page')
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ title: newTitle, slug: newSlug });
  };

  // We have hardcoded static pages that should always be listed and editable
  const staticPages = [
    { id: 'static-home', title: 'Home Page', slug: 'home', isStatic: true },
    { id: 'static-about', title: 'About Us', slug: 'about', isStatic: true },
    { id: 'static-quality', title: 'Quality', slug: 'quality', isStatic: true },
    { id: 'static-certs', title: 'Certificates', slug: 'certificates', isStatic: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pages</h2>
          <p className="text-gray-500 mt-1">Manage website pages and content</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-xl hover:bg-brand-green-dark transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Page
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-scale-in">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Page</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green"
                  placeholder="e.g. Services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green"
                  placeholder="e.g. services"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-brand-green text-white rounded-xl hover:bg-brand-green-dark font-medium disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Page</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">URL Slug</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Render Static Pages First */}
            {staticPages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-900">{page.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">/{page.slug}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Static Core Page
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/admin/pages/editor/${page.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Live Editor
                  </Link>
                </td>
              </tr>
            ))}
            
            {/* Render Dynamic Pages */}
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading pages...</td></tr>
            ) : (
              pages?.map((page: any) => (
                <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-gray-900">{getSafeValue(page.title, 'en') || 'Untitled'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Dynamic Built Page
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/admin/pages/editor/${page.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Live Editor
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this page?')) {
                          deleteMutation.mutate(page.id);
                        }
                      }}
                      className="inline-flex p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
