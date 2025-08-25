import React from 'react';
import { AuthProvider, useAuth, ProtectedRoute } from './context/AuthContext';
import { WizardProvider, useWizard } from './context/WizardContext';
import AuthContainer from './components/auth/AuthContainer';
import FinanceWizard from './components/wizard/FinanceWizard';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  // Show protected content if authenticated
  return (
    <ProtectedRoute>
      <WizardProvider>
        <ProtectedAppContent />
      </WizardProvider>
    </ProtectedRoute>
  );
}

function ProtectedAppContent() {
  const { isComplete, userData, dispatch, actions } = useWizard();
  const { logout } = useAuth();

  const handleWizardComplete = () => {
    dispatch({ type: actions.COMPLETE_WIZARD });
  };

  const handleResetWizard = () => {
    dispatch({ type: actions.RESET_WIZARD });
  };

  const handleLogout = () => {
    logout();
  };

  if (!isComplete) {
    return <FinanceWizard onComplete={handleWizardComplete} />;
  }

  return (
    <Dashboard 
      userData={userData} 
      onResetWizard={handleResetWizard}
      onLogout={handleLogout}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
