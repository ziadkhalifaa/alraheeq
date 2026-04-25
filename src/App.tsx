import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, Component } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import Quality from "./pages/Quality";
import Certificates from "./pages/Certificates";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import DynamicPage from "./pages/DynamicPage";
import AdminLogin from "./admin/Login";
import AdminDashboard from "./admin/Dashboard";
import ProductForm from "./admin/ProductForm";
import BlogForm from "./admin/BlogForm";
import CertificateForm from "./admin/CertificateForm";
import LiveEditor from "./admin/editor/LiveEditor";
import { adminApi } from "./api/api";
import { EditorProvider } from "./editor/EditorContext";

const queryClient = new QueryClient();

class GlobalErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
          <div className="max-w-2xl w-full bg-white p-8 rounded-3xl shadow-2xl border border-red-100">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Application Error</h1>
            <p className="text-gray-600 mb-6 font-medium">The application crashed during rendering. See details below:</p>
            <pre className="bg-red-50 p-6 rounded-2xl text-sm text-red-800 overflow-auto max-h-96 border border-red-100 mb-6">
              {this.state.error?.toString()}
              {"\n\nStack Trace:\n"}
              {this.state.error?.stack}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function LanguageHandler() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang && (lang === 'ar' || lang === 'en')) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    } else {
      // Redirect to default language if not specified or invalid
      const savedLang = localStorage.getItem('i18nextLng') || 'ar';
      const targetLang = (savedLang === 'ar' || savedLang === 'en') ? savedLang : 'ar';
      
      // Remove leading slash if it exists to avoid double slashes
      const currentPath = location.pathname.startsWith('/') ? location.pathname.substring(1) : location.pathname;
      // If the first part is a language code, remove it
      const pathParts = currentPath.split('/');
      const cleanPath = (pathParts[0] === 'ar' || pathParts[0] === 'en') 
        ? pathParts.slice(1).join('/') 
        : currentPath;

      navigate(`/${targetLang}/${cleanPath}`, { replace: true });
    }
  }, [lang, i18n, navigate, location.pathname]);

  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        await adminApi.getMe();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };
    verifySession();
  }, []);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige">
        <div className="w-12 h-12 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const { i18n } = useTranslation();

  // Determine slug for static pages
  const path = location.pathname.split('/').slice(2).filter(Boolean).join('/') || 'home';
  const params = useParams();
  const dynamicSlug = params['*'] || params.slug; // Capture the * from the parent route or :slug
  const pageSlug = ['about', 'quality', 'certificates', 'products', 'blog', 'faq', 'contact'].includes(path) ? path : (path === 'home' ? 'home' : dynamicSlug);

  return (
    <div className="min-h-screen flex flex-col transition-all duration-500 ease-in-out">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${location.pathname}-${i18n.language}`}
            initial={{ opacity: 0, x: i18n.language === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: i18n.language === 'ar' ? -20 : 20 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Wrap public pages in EditorProvider (Viewer mode) */}
            <EditorProvider slug={pageSlug || 'home'} isEditing={false}>
              <Routes>
                <Route index element={<Index />} />
                <Route path="about" element={<About />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:slug" element={<ProductDetail />} />
                <Route path="quality" element={<Quality />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogDetail />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="contact" element={<Contact />} />
                <Route path=":slug" element={<DynamicPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </EditorProvider>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

import { HelmetProvider } from "react-helmet-async";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={
            <GlobalErrorBoundary>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </GlobalErrorBoundary>
          } />
          <Route path="/admin/products/new" element={
            <GlobalErrorBoundary>
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            </GlobalErrorBoundary>
          } />
          <Route path="/admin/products/edit/:id" element={
            <GlobalErrorBoundary>
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            </GlobalErrorBoundary>
          } />
          
          <Route path="/admin/blog/new" element={
            <GlobalErrorBoundary>
              <ProtectedRoute>
                <BlogForm />
              </ProtectedRoute>
            </GlobalErrorBoundary>
          } />
          <Route path="/admin/blog/edit/:id" element={
            <GlobalErrorBoundary>
              <ProtectedRoute>
                <BlogForm />
              </ProtectedRoute>
            </GlobalErrorBoundary>
          } />

          <Route path="/admin/certificates/new" element={
            <GlobalErrorBoundary>
              <ProtectedRoute>
                <CertificateForm />
              </ProtectedRoute>
            </GlobalErrorBoundary>
          } />
          <Route path="/admin/certificates/edit/:id" element={
            <GlobalErrorBoundary>
              <ProtectedRoute>
                <CertificateForm />
              </ProtectedRoute>
            </GlobalErrorBoundary>
          } />

          <Route path="/admin/pages/editor/:slug" element={
            <GlobalErrorBoundary>
              <ProtectedRoute>
                <LiveEditor />
              </ProtectedRoute>
            </GlobalErrorBoundary>
          } />
          
          <Route path="/:lang/*" element={
            <GlobalErrorBoundary>
              <LanguageHandler />
              <AppContent />
            </GlobalErrorBoundary>
          } />
          <Route path="*" element={<Navigate to="/ar" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
