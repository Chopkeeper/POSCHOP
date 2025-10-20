import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import SalesPage from './pages/SalesPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SettingsPage from './pages/SettingsPage';
import KitchenPage from './pages/KitchenPage';
import ServerPage from './pages/ServerPage';
import UsersPage from './pages/UsersPage';
import SideNav from './components/SideNav';
import { UserRole } from './types';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Main />
      </Router>
    </AppProvider>
  );
};

const Main: React.FC = () => {
  const { state } = useAppContext();
  const { currentUser } = state;

  if (!currentUser) {
    return <LoginPage />;
  }

  const getDefaultRouteForRole = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return '/dashboard';
      case UserRole.Cashier:
        return '/sales';
      case UserRole.Kitchen:
        return '/kitchen';
      case UserRole.Server:
        return '/server';
      default:
        return '/sales';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <SideNav />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to={getDefaultRouteForRole(currentUser.role)} replace />} />
          
          {/* Routes accessible by multiple roles or specific roles */}
          {(currentUser.role === UserRole.Admin || currentUser.role === UserRole.Cashier) && (
            <Route path="/sales" element={<SalesPage />} />
          )}
          
          {currentUser.role === UserRole.Admin && (
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/users" element={<UsersPage />} />
            </>
          )}

          {(currentUser.role === UserRole.Admin || currentUser.role === UserRole.Kitchen) && (
            <Route path="/kitchen" element={<KitchenPage />} />
          )}

          {(currentUser.role === UserRole.Admin || currentUser.role === UserRole.Server) && (
            <Route path="/server" element={<ServerPage />} />
          )}

          {/* Fallback route */}
          <Route path="*" element={<Navigate to={getDefaultRouteForRole(currentUser.role)} replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;