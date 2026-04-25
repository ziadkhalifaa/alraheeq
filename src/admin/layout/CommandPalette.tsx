import React, { useEffect, useState } from 'react';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';
import { 
  Package, FileText, LayoutDashboard, Search, 
  Settings, Mail, Award, ImageIcon 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi, blogApi, pageApi } from '@/api/api';
import { getSafeValue } from '@/editor/utils';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: products } = useQuery({
    queryKey: ['admin-products-search'],
    queryFn: () => productApi.getAll(undefined, 5).then(res => res.data),
    enabled: open
  });

  const { data: blogs } = useQuery({
    queryKey: ['admin-blog-search'],
    queryFn: () => blogApi.getAll().then(res => res.data),
    enabled: open
  });

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const productList = Array.isArray(products) ? products : (products?.data || []);
  const blogList = Array.isArray(blogs) ? blogs : (blogs?.data || []);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="relative hidden lg:flex items-center group w-80"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
        <div className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-100 group-hover:border-gray-200 text-left text-sm text-gray-400 rounded-xl flex justify-between items-center">
          <span>Search everything...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="custom-scrollbar">
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => runCommand(() => navigate('/admin/dashboard/overview'))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard Overview</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate('/admin/dashboard/inquiries'))}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Business Inquiries</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Products">
            {productList.slice(0, 5).map((p: any) => (
              <CommandItem key={p.id} onSelect={() => runCommand(() => navigate(`/admin/products/edit/${p.id}`))}>
                <Package className="mr-2 h-4 w-4" />
                <span>{getSafeValue(p.name, 'en')}</span>
              </CommandItem>
            ))}
            <CommandItem onSelect={() => runCommand(() => navigate('/admin/dashboard/products'))}>
              <Search className="mr-2 h-4 w-4" />
              <span>View All Products</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Blog">
            {blogList.slice(0, 5).map((p: any) => (
              <CommandItem key={p.id} onSelect={() => runCommand(() => navigate(`/admin/blog/edit/${p.id}`))}>
                <FileText className="mr-2 h-4 w-4" />
                <span>{getSafeValue(p.title, 'en')}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => navigate('/admin/dashboard/media'))}>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Media Library</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate('/admin/dashboard/pages'))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Page Manager</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
