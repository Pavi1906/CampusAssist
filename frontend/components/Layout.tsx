import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isOfficer = user?.role === 'response_officer' || user?.role === 'supervisor';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(isOfficer ? '/admin' : '/student')}>
              <ShieldAlert className="h-8 w-8 text-blue-100" />
              <span className="text-xl font-bold tracking-tight">CampusAssist</span>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-sm text-blue-100">
                  {user.email}
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors text-sm font-medium">
                    <UserIcon className="h-4 w-4" />
                    <span>Hi, {isOfficer ? 'Admin' : 'Student'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 hidden group-hover:block border border-slate-100">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;