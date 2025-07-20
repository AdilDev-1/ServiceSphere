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

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="w-64 bg-white shadow-lg">
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
              <a className={`flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? "text-primary bg-blue-50 border-r-2 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}>
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-6 left-6 right-6">
        <Button onClick={handleLogout} variant="outline" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
