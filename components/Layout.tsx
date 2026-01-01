
import React, { useContext } from 'react';
import { AuthContext } from '../App';
import { useNavigate, NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Classes', path: '/classes' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">Attendance<span className="text-blue-400">Pro</span></h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `block px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="text-sm font-medium text-gray-400">Logged in as</div>
          <div className="font-bold truncate">{auth?.user?.name || 'Guest'}</div>
          <div className="text-xs text-blue-400 uppercase font-bold mt-1 tracking-wider">{auth?.user?.role || 'User'}</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm z-10">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 font-medium text-sm transition-colors"
          >
            Log Out
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-grow overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
