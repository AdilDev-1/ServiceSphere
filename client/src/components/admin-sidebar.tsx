import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  List, 
  FileText, 
  Settings, 
  TrendingUp, 
  Users, 
  MessageSquare,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/submissions", label: "All Submissions", icon: List },
  { href: "/admin/documents", label: "Document Review", icon: FileText },
  { href: "/admin/services", label: "Manage Services", icon: Settings },
  { href: "/admin/payments", label: "Payment History", icon: TrendingUp },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/messages", label: "Message Center", icon: MessageSquare },
];

export default function AdminSidebar() {
  const [location] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold">ServiceFlow</h2>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href === "/admin/dashboard" && location === "/");
          
          return (
            <Link key={item.href} href={item.href}>
              <a className={`flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? "text-white bg-gray-800 border-r-2 border-primary"
                  : "text-gray-300 hover:bg-gray-800"
              }`}>
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-6 left-6 right-6">
        <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
