import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';

// Placeholder components for other tabs
const ExpensesTab = ({ userData }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-primary">Expenses</h1>
    <div className="card">
      <p className="text-secondary">Expense tracking interface coming soon...</p>
    </div>
  </div>
);

const PortfolioTab = ({ userData }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-primary">Portfolio</h1>
    <div className="card">
      <p className="text-secondary">Detailed portfolio analysis coming soon...</p>
    </div>
  </div>
);

const GoalsTab = ({ userData }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-primary">Financial Goals</h1>
    <div className="card">
      <p className="text-secondary">Goal setting and tracking coming soon...</p>
    </div>
  </div>
);

const SettingsTab = ({ userData, onResetWizard }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-primary">Settings</h1>
    <div className="card">
      <h3 className="font-semibold text-primary mb-4">Account Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="form-label">Monthly Income</label>
          <input 
            type="text" 
            className="form-input" 
            value={`₹${userData.income.monthly?.toLocaleString() || '0'}`}
            readOnly 
          />
        </div>
        <div>
          <label className="form-label">Budget Rule</label>
          <input 
            type="text" 
            className="form-input" 
            value={userData.budgetRule}
            readOnly 
          />
        </div>
        <div>
          <label className="form-label">Risk Appetite</label>
          <input 
            type="text" 
            className="form-input" 
            value={userData.riskAppetite}
            readOnly 
          />
        </div>
        <button 
          onClick={onResetWizard}
          className="btn btn-outline text-sm"
        >
          Reset and Run Setup Again
        </button>
      </div>
    </div>
  </div>
);

const Dashboard = ({ userData, onResetWizard, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab) => {
    if (tab === 'logout') {
      onLogout?.();
      return;
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview userData={userData} />;
      case 'expenses':
        return <ExpensesTab userData={userData} />;
      case 'portfolio':
        return <PortfolioTab userData={userData} />;
      case 'goals':
        return <GoalsTab userData={userData} />;
      case 'settings':
        return <SettingsTab userData={userData} onResetWizard={onResetWizard} />;
      default:
        return <DashboardOverview userData={userData} />;
    }
  };

  return (
    <div className="flex h-screen bg-light">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        userData={userData}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="min-h-full p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
