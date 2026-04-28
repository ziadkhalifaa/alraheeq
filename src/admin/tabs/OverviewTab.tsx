import { useQuery } from '@tanstack/react-query';
import { analyticsApi, inquiryApi, productApi, blogApi } from '@/api/api';
import { Eye, Mail, Package, FileText, TrendingUp, ArrowUpRight } from 'lucide-react';
import { CardSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function OverviewTab() {
  const { data: statsRes, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-stats-overview'],
    queryFn: () => analyticsApi.getOverview().then(res => res.data),
  });

  const { data: unreadRes } = useQuery({
    queryKey: ['admin-unread-count'],
    queryFn: () => inquiryApi.getUnreadCount().then(res => res.data),
  });

  const { data: productsRes } = useQuery({
    queryKey: ['admin-products-count'],
    queryFn: () => productApi.getAll(undefined, 1).then(res => res.data),
  });

  const { data: blogRes } = useQuery({
    queryKey: ['admin-blog-count'],
    queryFn: () => blogApi.getAll().then(res => res.data),
  });

  if (loadingStats) return <CardSkeleton count={4} />;

  const stats = statsRes?.overview || { totalViews: 0, totalInquiries: 0, conversionRate: 0 };
  
  // Handle both array and object responses (legacy support)
  const products = Array.isArray(productsRes) ? productsRes : (productsRes?.data || []);
  const productsCount = productsRes?.meta?.total ?? productsRes?.total ?? products.length;
  
  const blogData = Array.isArray(blogRes) ? blogRes : (blogRes?.data || []);
  const blogCount = blogRes?.meta?.total ?? blogRes?.total ?? blogData.length;

  // Mock trend data for sparklines (in a real app, this would come from the API)
  const mockTrend = [
    { v: 10 }, { v: 25 }, { v: 15 }, { v: 30 }, { v: 20 }, { v: 45 }, { v: 35 }
  ];

  const cards = [
    { label: 'Total Products', value: productsCount, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/dashboard/products', trend: '#3b82f6' },
    { label: 'Unread Inquiries', value: unreadRes?.count || 0, icon: Mail, color: 'text-brand-green', bg: 'bg-green-50', link: '/admin/dashboard/inquiries', trend: '#1F7A63' },
    { label: 'Blog Posts', value: blogCount, icon: FileText, color: 'text-brand-gold', bg: 'bg-amber-50', link: '/admin/dashboard/blog', trend: '#C9A66B' },
    { label: 'Page Views', value: stats.totalViews, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/dashboard/analytics', trend: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Link key={i} to={card.link} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <card.icon className={card.color} size={24} />
              </div>
              <ArrowUpRight className="text-gray-300 group-hover:text-gray-900 transition-colors" size={20} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">{card.label}</div>
              <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            </div>
            
            {/* Sparkline */}
            <div className="h-10 w-full mt-4 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrend}>
                  <Line type="monotone" dataKey="v" stroke={card.trend} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Conversion Performance</h3>
            <Badge variant="outline" className="text-brand-green border-brand-green/20">
              <TrendingUp size={12} className="mr-1" /> {stats.conversionRate}% Rate
            </Badge>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Your website is currently converting visitors to leads at a stable rate. 
            Consider updating blog content to drive more organic traffic.
          </p>
          <div className="flex gap-4">
            <Link to="/admin/dashboard/inquiries" className="flex-1">
              <Button className="w-full bg-brand-green hover:bg-brand-green-dark rounded-xl">Review Inquiries</Button>
            </Link>
            <Link to="/admin/blog/new" className="flex-1">
              <Button variant="outline" className="w-full rounded-xl">Write New Post</Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1 bg-brand-gradient p-8 rounded-3xl text-white shadow-brand relative overflow-hidden flex flex-col">
          <div className="relative z-10 flex-grow">
            <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
            <p className="text-white/70 text-sm mb-6">Common tasks and shortcuts</p>
            <div className="space-y-3">
              {[
                { label: 'Add New Product', icon: Package, link: '/admin/products/new' },
                { label: 'Upload Media', icon: Eye, link: '/admin/dashboard/media' },
                { label: 'Edit Home Page', icon: FileText, link: '/admin/pages/editor/home' },
              ].map((action, i) => (
                <Link key={i} to={action.link} className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <action.icon size={18} />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-gold/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
