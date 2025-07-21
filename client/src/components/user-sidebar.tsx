import { Link, useLocation } from "wouter";
import { Home, PlusCircle, List, CreditCard, MessageCircle, UserCog, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/submit-request", label: "Submit New Request", icon: PlusCircle },
  { href: "/my-submissions", label: "My Submissions", icon: List },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/support", label: "Messages/Support", icon: MessageCircle },
  { href: "/profile", label: "Profile Settings", icon: UserCog },
];

export default function UserSidebar() {
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
    <div className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">ServiceFlow</h2>
        <p className="text-sm text-gray-500">User Portal</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center px-6 py-3 transition-colors cursor-pointer ${
                isActive
                  ? "text-primary bg-blue-50 border-r-2 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}>
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-6 left-6 right-6">
        <Button onClick={handleLogout} variant="outline" className="justify-start px-4 py-3 min-w-32">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
