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
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function AdminSidebar() {
  const [location] = useLocation();

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
    <div className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">AutoService Pro</h2>
        <p className="text-sm text-gray-300">Admin Panel</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href === "/admin" && (location === "/admin" || location === "/admin/dashboard"));
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center px-6 py-3 transition-colors cursor-pointer ${
                isActive
                  ? "text-blue-400 bg-gray-800 border-r-2 border-blue-400"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-6 left-6 right-6">
        <Button onClick={handleLogout} variant="outline" className="justify-start px-4 py-3 min-w-32 text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
