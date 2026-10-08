import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SellerSidebar } from './components/layout/SellerSidebar';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';
import { FloatingButtons } from './components/ui/FloatingButtons';

// Public Pages
import { HomePage } from './pages/HomePage';
import { BrowseVehiclesPage } from './pages/BrowseVehiclesPage';
import { VehicleDetailsPage } from './pages/VehicleDetailsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { BrandsPage } from './pages/BrandsPage';
import { LocationsPage } from './pages/LocationsPage';
import { AboutPage, ContactPage } from './pages/AboutPage';
import { TermsPage, PrivacyPage } from './pages/TermsPage';

// Seller Pages
import { SellerDashboardPage } from './pages/seller/SellerDashboardPage';
import { MyListingsPage } from './pages/seller/MyListingsPage';
import { AddVehiclePage } from './pages/seller/AddVehiclePage';
import { InterestedBuyersPage } from './pages/seller/InterestedBuyersPage';
import { SellerMessagesPage } from './pages/seller/SellerMessagesPage';
import { SellerFavoritesPage } from './pages/seller/SellerFavoritesPage';
import { SellerProfilePage } from './pages/seller/SellerProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminApprovalsPage } from './pages/admin/AdminApprovalsPage';
import { AdminListingsPage } from './pages/admin/AdminListingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCategoriesPage, AdminBrandsPage } from './pages/admin/AdminCategoriesPage';
import { AdminLocationsPage, AdminInterestsPage } from './pages/admin/AdminLocationsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminActivityLogsPage, AdminSettingsPage } from './pages/admin/AdminActivityLogsPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';

import { Vehicle } from './types';

const MainApp: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null);

  // Sync with browser history popstate if back/forward button is pressed
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath, selectedVehicleId]);

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (!path.startsWith('/vehicles/')) {
      setSelectedVehicleId(null);
    }
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id);
    setCurrentPath(`/vehicles/${vehicle.id}`);
  };

  const handleEditVehicle = (vehicleId: string) => {
    setEditVehicleId(vehicleId);
    setCurrentPath(`/dashboard/listings/${vehicleId}/edit`);
  };

  const isAdminRoute = currentPath.startsWith('/admin');
  const isSellerRoute = currentPath.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. SUPER ADMIN PORTAL LAYOUT */}
      {isAdminRoute ? (
        <div className="flex min-h-screen">
          <AdminSidebar currentPath={currentPath} onNavigate={navigate} />
          
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader
              title={
                currentPath === '/admin' ? 'Super Admin Dashboard' :
                currentPath === '/admin/approvals' ? 'Pending Listing Approvals' :
                currentPath === '/admin/listings' ? 'All Marketplace Listings' :
                currentPath === '/admin/users' ? 'User Accounts & Roles' :
                currentPath === '/admin/interests' ? 'Buyer Interests Pipeline' :
                currentPath === '/admin/messages' ? 'Marketplace Communications' :
                currentPath === '/admin/categories' ? 'Vehicle Categories' :
                currentPath === '/admin/brands' ? 'Automaker Brands' :
                currentPath === '/admin/locations' ? 'Marketplace Locations' :
                currentPath === '/admin/reports' ? 'Analytics & Reports' :
                currentPath === '/admin/activity-logs' ? 'System Moderation Logs' :
                currentPath === '/admin/testimonials' ? 'Testimonials' :
                'Marketplace Settings'
              }
              subtitle="SatyaDeal Classified Platform Control"
              onNavigate={navigate}
            />

            <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
              {currentPath === '/admin' && (
                <AdminDashboardPage onNavigate={navigate} onSelectVehicle={handleSelectVehicle} />
              )}
              {currentPath === '/admin/approvals' && (
                <AdminApprovalsPage onSelectVehicle={handleSelectVehicle} onNavigate={navigate} />
              )}
              {currentPath === '/admin/listings' && (
                <AdminListingsPage
                  onSelectVehicle={handleSelectVehicle}
                  onEditVehicle={handleEditVehicle}
                  onNavigate={navigate}
                />
              )}
              {currentPath === '/admin/users' && <AdminUsersPage />}
              {currentPath === '/admin/interests' && <AdminInterestsPage />}
              {currentPath === '/admin/messages' && <AdminMessagesPage />}
              {currentPath === '/admin/categories' && <AdminCategoriesPage />}
              {currentPath === '/admin/brands' && <AdminBrandsPage />}
              {currentPath === '/admin/locations' && <AdminLocationsPage />}
              {currentPath === '/admin/reports' && <AdminReportsPage />}
              {currentPath === '/admin/activity-logs' && <AdminActivityLogsPage />}
              {currentPath === '/admin/testimonials' && <AdminTestimonialsPage />}
              {currentPath === '/admin/settings' && <AdminSettingsPage />}
            </main>
          </div>
        </div>
      ) : isSellerRoute ? (
        
        /* 2. SELLER DASHBOARD LAYOUT */
        <div className="flex min-h-screen">
          <SellerSidebar currentPath={currentPath} onNavigate={navigate} />

          <div className="flex-1 flex flex-col min-w-0">
            {/* Header snippet for Seller */}
            <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                {currentPath === '/dashboard' ? 'Seller Overview' :
                 currentPath === '/dashboard/listings' ? 'My Listings' :
                 currentPath === '/dashboard/listings/new' ? 'Add New Vehicle' :
                 currentPath.includes('/edit') ? 'Edit Vehicle Listing' :
                 currentPath === '/dashboard/interests' ? 'Interested Buyers' :
                 currentPath === '/dashboard/messages' ? 'Direct Messages' :
                 currentPath === '/dashboard/favorites' ? 'Saved Vehicles' :
                 'Seller Profile'}
              </h1>

              <button
                onClick={() => navigate('/')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Go to Marketplace
              </button>
            </header>

            <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
              {currentPath === '/dashboard' && (
                <SellerDashboardPage onNavigate={navigate} onSelectVehicle={handleSelectVehicle} />
              )}
              {currentPath === '/dashboard/listings' && (
                <MyListingsPage
                  onNavigate={navigate}
                  onSelectVehicle={handleSelectVehicle}
                  onEditVehicle={handleEditVehicle}
                />
              )}
              {currentPath === '/dashboard/listings/new' && (
                <AddVehiclePage
                  onNavigate={navigate}
                  onSelectVehicle={handleSelectVehicle}
                />
              )}
              {currentPath.includes('/edit') && (
                <AddVehiclePage
                  editVehicleId={editVehicleId}
                  onNavigate={navigate}
                  onSelectVehicle={handleSelectVehicle}
                />
              )}
              {currentPath === '/dashboard/interests' && <InterestedBuyersPage />}
              {currentPath === '/dashboard/messages' && <SellerMessagesPage />}
              {currentPath === '/dashboard/favorites' && (
                <SellerFavoritesPage onSelectVehicle={handleSelectVehicle} onNavigate={navigate} />
              )}
              {(currentPath === '/dashboard/profile' || currentPath === '/dashboard/settings') && (
                <SellerProfilePage />
              )}
            </main>
          </div>
        </div>
      ) : (

        /* 3. PUBLIC MARKETPLACE WEBSITE LAYOUT */
        <>
          <Header currentPath={currentPath} onNavigate={navigate} />

          <main className="flex-1">
            {currentPath === '/' && (
              <HomePage onNavigate={navigate} onSelectVehicle={handleSelectVehicle} />
            )}
            {currentPath === '/vehicles' && (
              <BrowseVehiclesPage onNavigate={navigate} onSelectVehicle={handleSelectVehicle} />
            )}
            {selectedVehicleId && (
              <VehicleDetailsPage
                vehicleId={selectedVehicleId}
                onNavigate={navigate}
                onSelectVehicle={handleSelectVehicle}
              />
            )}
            {currentPath === '/categories' && <CategoriesPage onNavigate={navigate} />}
            {currentPath === '/brands' && <BrandsPage onNavigate={navigate} />}
            {currentPath === '/locations' && <LocationsPage onNavigate={navigate} />}
            {currentPath === '/about' && <AboutPage />}
            {currentPath === '/contact' && <ContactPage />}
            {currentPath === '/terms' && <TermsPage />}
            {currentPath === '/privacy' && <PrivacyPage />}
          </main>

          <Footer onNavigate={navigate} />
          <FloatingButtons />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MarketplaceProvider>
          <MainApp />
        </MarketplaceProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
