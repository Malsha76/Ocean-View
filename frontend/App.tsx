import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import Search from './pages/Search';
import ReservationPage from './pages/ReservationPage';
import ReservationListPage from './pages/ReservationListPage';
import BillingPage from './pages/BillingPage';
import HelpPage from './pages/HelpPage';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import StaffDashboard from './pages/dashboard/StaffDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ManageStaffPage from './pages/admin/ManageStaffPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastViewport from './components/ToastViewport';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ToastViewport />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedRoles={['STAFF']}>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route path="/search" element={<Search />} />

            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STAFF']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservations"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'STAFF']}>
                  <ReservationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservation-list"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'STAFF', 'ADMIN']}>
                  <ReservationListPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/billing"
              element={
                <ProtectedRoute allowedRoles={['STAFF']}>
                  <BillingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/help"
              element={
                <ProtectedRoute allowedRoles={['STAFF']}>
                  <HelpPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageStaffPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageUsersPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
