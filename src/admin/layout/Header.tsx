import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Plus, User, ChevronRight, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import CommandPalette from './CommandPalette';

export default function Header() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  
  // Breadcrumbs logic
  const breadcrumbs = pathParts.map((part, index) => {
    const path = `/${pathParts.slice(0, index + 1).join('/')}`;
    return { label: part.charAt(0).toUpperCase() + part.slice(1), path };
  });

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <Link to="/admin/dashboard/overview" className="hover:text-brand-green transition-colors">
          <Home size={16} />
        </Link>
        {breadcrumbs.slice(1).map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-gray-300" />
            <Link 
              to={crumb.path} 
              className={`hover:text-brand-green transition-colors ${idx === breadcrumbs.length - 2 ? 'text-gray-900 font-bold' : ''}`}
            >
              {crumb.label}
            </Link>
          </div>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <CommandPalette />

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-gold rounded-full border-2 border-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-xl border-gray-100">
              <DropdownMenuLabel className="px-4 py-3 font-bold text-gray-900">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                {[1, 2].map((i) => (
                  <DropdownMenuItem key={i} className="p-4 rounded-xl cursor-pointer focus:bg-gray-50">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-green-50 text-brand-green rounded-full flex items-center justify-center shrink-0">
                        <Bell size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">New Business Inquiry</div>
                        <div className="text-xs text-gray-500 mt-1">A new message was received from Ahmed Ali regarding "Organic Herbs".</div>
                        <div className="text-[10px] text-gray-400 mt-2">2 minutes ago</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <Link to="/admin/dashboard/inquiries">
                <DropdownMenuItem className="justify-center py-3 text-brand-green font-bold text-sm cursor-pointer hover:underline focus:bg-transparent">
                  View All Notifications
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-3 px-2 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 bg-brand-gradient rounded-lg flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-gray-900 leading-none">Admin User</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Super Admin</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-gray-100">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl cursor-pointer gap-2 py-2.5">
                <User size={16} /> Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl cursor-pointer gap-2 py-2.5">
                <Settings size={16} /> Security
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
