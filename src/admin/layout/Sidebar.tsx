import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Mail, BarChart2, FileText, Award, Image as ImageIcon, 
  ExternalLink, LogOut, ChevronLeft, ChevronRight, LayoutDashboard,
  Settings, Users, Bell
} from 'lucide-react';
import { adminApi } from '@/api/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  unreadInquiries?: number;
}

export default function Sidebar({ unreadInquiries = 0 }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      localStorage.removeItem('alraheeq_admin_user');
      navigate('/admin/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const navSections = [
    {
      title: 'Main',
      items: [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard/overview' },
      ]
    },
    {
      title: 'Content',
      items: [
        { id: 'products', icon: Package, label: 'Products', path: '/admin/dashboard/products' },
        { id: 'blog', icon: FileText, label: 'Blog & News', path: '/admin/dashboard/blog' },
        { id: 'certificates', icon: Award, label: 'Certificates', path: '/admin/dashboard/certificates' },
      ]
    },
    {
      title: 'Marketing',
      items: [
        { id: 'inquiries', icon: Mail, label: 'Inquiries', path: '/admin/dashboard/inquiries', badge: unreadInquiries },
        { id: 'analytics', icon: BarChart2, label: 'Analytics', path: '/admin/dashboard/analytics' },
      ]
    },
    {
      title: 'Site',
      items: [
        { id: 'pages', icon: FileText, label: 'Pages', path: '/admin/dashboard/pages' },
        { id: 'media', icon: ImageIcon, label: 'Media Library', path: '/admin/dashboard/media' },
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-brand-gradient text-white flex flex-col relative transition-all duration-300 ease-in-out shrink-0"
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-brand-gold text-white rounded-full flex items-center justify-center shadow-lg z-50 hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Area */}
      <div className={`p-6 mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
          <img src="https://cdn-ai.onspace.ai/onspace/project/uploads/MoJYwGH33bc9qvJ38ADo9Y/AlraheeqLogoWeb.png" alt="A" className="h-6 w-auto brightness-0 invert" />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-xl tracking-tight"
          >
            Alraheeq<span className="text-brand-gold">CMS</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-8 overflow-y-auto custom-scrollbar pb-10">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map(item => (
                <TooltipProvider key={item.id} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                          isActive(item.path) 
                            ? 'bg-white text-brand-green shadow-lg' 
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <item.icon size={20} className={isActive(item.path) ? 'text-brand-green' : 'group-hover:scale-110 transition-transform'} />
                        {!isCollapsed && (
                          <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                            {item.label}
                          </motion.span>
                        )}
                        
                        {item.badge > 0 && (
                          <span className={`absolute ${isCollapsed ? 'top-1 right-1' : 'right-4'} flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-white border-2 border-brand-green shadow-sm animate-pulse`}>
                            {item.badge}
                          </span>
                        )}

                        {isActive(item.path) && (
                          <motion.div 
                            layoutId="active-pill"
                            className="absolute left-0 w-1 h-6 bg-brand-gold rounded-r-full"
                          />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="bg-brand-green border-brand-green-dark text-white font-bold">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link 
          to="/" 
          target="_blank"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isCollapsed ? 'justify-center' : ''} text-white/60 hover:text-white hover:bg-white/5`}
        >
          <ExternalLink size={20} />
          {!isCollapsed && <span className="text-sm">View Site</span>}
        </Link>
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${isCollapsed ? 'justify-center' : ''} text-red-300/60 hover:text-red-400 hover:bg-red-500/10`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
}
