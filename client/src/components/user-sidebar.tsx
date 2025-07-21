import { Link, useLocation } from "wouter";
import { Home, PlusCircle, List, CreditCard, MessageCircle, UserCog, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileMenu } from "@/hooks/useMobileMenu";

const menuItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/submit-request", label: "Submit New Request", icon: PlusCircle },
  { href: "/my-submissions", label: "My Submissions", icon: List },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/support", label: "Messages/Support", icon: MessageCircle },
  { href: "/profile", label: "Profile Settings", icon: UserCog },
];

interface UserSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function UserSidebar({ isOpen = true, onClose }: UserSidebarProps) {
  const [location] = useLocation();
  const { isMobile } = useMobileMenu();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Redirect to landing page after successful logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect even if logout fails
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-64 bg-white shadow-lg min-h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      `}>
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AutoService Pro</h2>
            <p className="text-sm text-gray-500">User Portal</p>
          </div>
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-1 h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
            
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={`flex items-center px-6 py-3 transition-colors cursor-pointer ${
                    isActive
                      ? "text-primary bg-blue-50 border-r-2 border-primary"
                      : "text-gray-600 hover:bg-gray-50"
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
            className="w-full justify-start px-4 py-3"
          >
            <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
}
