import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  variant?: 'admin' | 'user';
}

export default function MobileHeader({ 
  title, 
  subtitle, 
  isMobileMenuOpen, 
  onToggleMobileMenu,
  variant = 'user'
}: MobileHeaderProps) {
  const isDark = variant === 'admin';
  
  return (
    <div className={`lg:hidden fixed top-0 left-0 right-0 z-30 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    } shadow-md border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMobileMenu}
            className={`p-2 ${
              isDark 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
          <div>
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            {subtitle && (
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}