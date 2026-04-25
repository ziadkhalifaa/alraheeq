import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { useQuery } from '@tanstack/react-query';
import { inquiryApi } from '@/api/api';
import { Loader2 } from 'lucide-react';

// Lazy load tabs
const OverviewTab = lazy(() => import('./tabs/OverviewTab'));
const ProductsTab = lazy(() => import('./tabs/ProductsTab'));
const InquiriesTab = lazy(() => import('./tabs/InquiriesTab'));
const AnalyticsTab = lazy(() => import('./tabs/AnalyticsTab'));
const BlogTab = lazy(() => import('./tabs/BlogTab'));
const CertificatesTab = lazy(() => import('./tabs/CertificatesTab'));
const MediaTab = lazy(() => import('./tabs/MediaTab'));
const PagesTab = lazy(() => import('./tabs/PagesTab'));

export default function AdminDashboard() {
  const { data: unreadRes } = useQuery({
    queryKey: ['admin-unread-count'],
    queryFn: () => inquiryApi.getUnreadCount().then(res => res.data),
    refetchInterval: 30000,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden" dir="ltr">
      {/* Sidebar with unread count */}
      <Sidebar unreadInquiries={unreadRes?.count || 0} />

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <Header />

        <main className="flex-grow p-8 overflow-y-auto custom-scrollbar">
          <Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse">Initializing dashboard...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="overview" element={<OverviewTab />} />
              <Route path="products" element={<ProductsTab />} />
              <Route path="inquiries" element={<InquiriesTab />} />
              <Route path="analytics" element={<AnalyticsTab />} />
              <Route path="blog" element={<BlogTab />} />
              <Route path="certificates" element={<CertificatesTab />} />
              <Route path="media" element={<MediaTab />} />
              <Route path="pages" element={<PagesTab />} />
              
              {/* Default redirect to overview */}
              <Route path="/" element={<Navigate to="overview" replace />} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
