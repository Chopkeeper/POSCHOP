import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import SideNav from './components/SideNav';
import SalesPage from './pages/SalesPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SettingsPage from './pages/SettingsPage';
import KitchenPage from './pages/KitchenPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import { Page, UserRole } from './types';

const AppContent: React.FC = () => {
  const { state } = useAppContext();
  
  // Set default page based on role after login
  const getDefaultPage = (role?: UserRole): Page => {
    switch(role) {
      case UserRole.Admin: return 'dashboard';
      case UserRole.Kitchen: return 'kitchen';
      case UserRole.Cashier:
      case UserRole.Server:
      default:
        return 'sales';
    }
  };

  const [activePage, setActivePage] = useState<Page>('sales');

  React.useEffect(() => {
    if (state.currentUser) {
      setActivePage(getDefaultPage(state.currentUser.role));
    }
  }, [state.currentUser]);


  if (!state.currentUser) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return state.currentUser?.role === UserRole.Admin ? <DashboardPage /> : <p>Access Denied</p>;
      case 'products':
        return state.currentUser?.role === UserRole.Admin ? <ProductsPage /> : <p>Access Denied</p>;
      case 'users':
        return state.currentUser?.role === UserRole.Admin ? <UsersPage /> : <p>Access Denied</p>;
      case 'settings':
        return state.currentUser?.role === UserRole.Admin ? <SettingsPage /> : <p>Access Denied</p>;
      case 'kitchen':
        return state.currentUser?.role === UserRole.Kitchen || state.currentUser?.role === UserRole.Admin ? <KitchenPage /> : <p>Access Denied</p>;
      case 'sales':
      default:
         return state.currentUser?.role === UserRole.Cashier || state.currentUser?.role === UserRole.Admin ? <SalesPage /> : <p>Access Denied</p>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <SideNav activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
