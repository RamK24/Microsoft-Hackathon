
import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavSidebar } from '../shared/NavSidebar';
import { useAuth } from '../../contexts/AuthContext';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Only render sidebar if authenticated
  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-background animate-fade-in">
      {isAuthenticated && <NavSidebar />}
      <div className={`flex-1 flex flex-col overflow-hidden ${isAuthenticated ? 'ml-64' : ''}`}>
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
