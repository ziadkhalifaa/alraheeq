
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '@/api/api';
import { toast } from 'sonner';
import ClassicBlogEditorUI from '@/components/admin/blog-editor/ClassicBlogEditorUI';
import { PostMetadata } from '@/components/admin/blog-editor/types';
import { v4 as uuidv4 } from 'uuid';

export default function BlogForm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [content, setContent] = useState<{en: string, ar: string}>({ en: '', ar: '' });
  const [metadata, setMetadata] = useState<PostMetadata | null>(null);

  useEffect(() => {
    if (isEdit && location.state?.post) {
      const p = location.state.post;
      
      // Conversion Bridge: Handle old block content vs new HTML content
      let initialContent = { en: '', ar: '' };
      if (Array.isArray(p.content?.blocks)) {
        // Convert old blocks to HTML string
        const enHtml = p.content.blocks.map((b: any) => {
          if (b.type === 'paragraph') return `<p>${b.content.en || ''}</p>`;
          if (b.type.startsWith('heading')) return `<h${b.type.replace('heading', '')}>${b.content.en || ''}</h${b.type.replace('heading', '')}>`;
          if (b.type === 'image') return `<img src="${b.content.en}" />`;
          if (b.type === 'bulletList') return `<ul><li>${b.content.en}</li></ul>`;
          if (b.type === 'orderedList') return `<ol><li>${b.content.en}</li></ol>`;
          return `<p>${b.content.en || ''}</p>`;
        }).join('');
        
        const arHtml = p.content.blocks.map((b: any) => {
          if (b.type === 'paragraph') return `<p>${b.content.ar || ''}</p>`;
          if (b.type.startsWith('heading')) return `<h${b.type.replace('heading', '')}>${b.content.ar || ''}</h${b.type.replace('heading', '')}>`;
          if (b.type === 'image') return `<img src="${b.content.ar}" />`;
          if (b.type === 'bulletList') return `<ul><li>${b.content.ar}</li></ul>`;
          if (b.type === 'orderedList') return `<ol><li>${b.content.ar}</li></ol>`;
          return `<p>${b.content.ar || ''}</p>`;
        }).join('');
        
        initialContent = { en: enHtml, ar: arHtml };
      } else {
        // Legacy HTML support
        initialContent = { en: p.content?.en || '', ar: p.content?.ar || '' };
      }

      setContent(initialContent);
      setMetadata({
        title: p.title || { en: '', ar: '' },
        excerpt: p.excerpt || { en: '', ar: '' },
        slug: p.slug || '',
        image_url: p.image_url || '',
        author: p.author || 'Alraheeq',
        status: p.status || 'published',
        metaTitle: p.meta_title || { en: '', ar: '' },
        metaDescription: p.meta_description || { en: '', ar: '' }
      });
    } else {
      setMetadata({
        title: { en: '', ar: '' },
        excerpt: { en: '', ar: '' },
        slug: '',
        image_url: '',
        author: 'Alraheeq',
        status: 'draft',
        metaTitle: { en: '', ar: '' },
        metaDescription: { en: '', ar: '' }
      });
    }
  }, [isEdit, location.state]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? blogApi.update(Number(id), data) : blogApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success(isEdit ? 'Post updated' : 'Post created');
      navigate('/admin/dashboard');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Operation failed'),
  });

  const handleSave = (finalContent: {en: string, ar: string}, finalMetadata: PostMetadata) => {
    // Strip HTML tags for the flat preview version sent to backend
    const stripHtml = (html: string) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    };

    const payload = {
      ...finalMetadata,
      content: {
        // We save the HTML directly in the blocks array as a single block to maintain DB compatibility
        blocks: [
          { id: uuidv4(), type: 'html', content: finalContent }
        ],
        en: stripHtml(finalContent.en).substring(0, 500),
        ar: stripHtml(finalContent.ar).substring(0, 500),
      }
    };
    mutation.mutate(payload);
  };

  if (!metadata) return null;

  return (
    <div className="bg-white min-h-screen">
      <ClassicBlogEditorUI 
        initialContent={content} 
        initialMetadata={metadata} 
        onSave={handleSave} 
      />
    </div>
  );
}
