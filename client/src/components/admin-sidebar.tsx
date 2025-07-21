import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  LogOut,
  Wrench,
  FolderOpen,
  Bell,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileMenu } from "@/hooks/useMobileMenu";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Submissions", icon: FileText },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/payments", label: "Payments & Invoices", icon: CreditCard },
  { href: "/admin/services", label: "Service Management", icon: Wrench },
  { href: "/admin/documents", label: "Document Management", icon: FolderOpen },
  { href: "/admin/messages", label: "Messages & CRM", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const [location] = useLocation();
  const { isMobile } = useMobileMenu();

  const handleLogout = () => {
    // Use client-side logout
    import('@/lib/auth').then(({ logout }) => {
      logout();
      window.location.href = '/';
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">AutoService Pro</h2>
            <p className="text-sm text-gray-300">Admin Panel</p>
          </div>
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-300 hover:text-white hover:bg-gray-800 p-1 h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href === "/admin" && (location === "/admin" || location === "/admin/dashboard"));
          
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={`flex items-center px-6 py-3 transition-colors cursor-pointer ${
                  isActive
                    ? "text-blue-400 bg-gray-800 border-r-2 border-blue-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => isMobile && onClose && onClose()}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full justify-start px-4 py-3 text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
}
