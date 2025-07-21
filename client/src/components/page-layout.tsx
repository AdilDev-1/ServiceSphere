import { ReactNode } from 'react';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import MobileHeader from './mobile-header';

interface PageLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title: string;
  subtitle?: string;
  variant?: 'admin' | 'user';
}

export default function PageLayout({ 
  children, 
  sidebar, 
  title, 
  subtitle, 
  variant = 'user' 
}: PageLayoutProps) {
  const { isMobileMenuOpen, isMobile, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebar}
      
      <MobileHeader 
        title={title}
        subtitle={subtitle}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
        variant={variant}
      />
      
      <div className={`flex-1 p-4 lg:p-8 ${isMobile ? 'pt-20' : 'ml-64'} transition-all duration-300 min-h-screen`}>
        {children}
      </div>
    </div>
  );
}