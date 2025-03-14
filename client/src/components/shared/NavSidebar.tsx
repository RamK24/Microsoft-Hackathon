
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Mic,
  Building
} from 'lucide-react';

export const NavSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { coach, logout } = useAuth();
  const location = useLocation();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Mic, label: 'Meetups', path: '/meetups' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
  
  return (
    <div 
      className={`fixed h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-sidebar font-bold text-xl">B</span>
            </div>
            {!collapsed && (
              <h1 className="ml-3 font-semibold text-xl text-primary">Bridge</h1>
            )}
          </div>
          
          <button 
            onClick={toggleSidebar}
            className={`text-primary/70 hover:text-primary focus-ring rounded-full p-1 ${
              collapsed ? 'absolute -right-3 bg-background border border-sidebar-border rounded-full shadow-sm' : ''
            }`}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-md transition-all ${
                      isActive 
                        ? 'bg-primary text-sidebar' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/30 hover:text-primary'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-inner">
              <span className="text-sidebar font-medium">
                {coach?.name?.charAt(0) || 'C'}
              </span>
            </div>
            
            {!collapsed && (
              <div className="ml-3 flex-1 truncate">
                <p className="font-medium truncate text-sidebar-foreground">{coach?.name || 'Coach'}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{coach?.email || 'coach@example.com'}</p>
              </div>
            )}
            
            <button 
              onClick={logout}
              className="text-primary/60 hover:text-primary focus-ring rounded-full p-1"
              title="Log out"
            >
              <LogOut size={collapsed ? 20 : 16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
