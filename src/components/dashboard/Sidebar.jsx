import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Target, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, onTabChange, userData }) => {
  const { user } = useAuth();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Logo and User Info */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary mb-4">TrackMint</h1>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-primary">
              {user?.name || 'Welcome back!'}
            </p>
            <p className="text-sm text-secondary">
              ₹{userData?.income?.monthly?.toLocaleString() || '0'}/month
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-accent text-white shadow-md'
                      : 'text-secondary hover:bg-light hover:text-primary'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-border">
        <ul className="space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-secondary hover:bg-light hover:text-primary transition-all"
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Risk Profile Badge */}
      {userData?.riskAppetite && (
        <div className="p-4">
          <div className={`px-3 py-2 rounded-lg text-center text-sm font-semibold ${
            userData.riskAppetite === 'Conservative' ? 'bg-blue-100 text-blue-600' :
            userData.riskAppetite === 'Balanced' ? 'bg-green-100 text-green-600' :
            'bg-red-100 text-red-600'
          }`}>
            {userData.riskAppetite} Investor
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
