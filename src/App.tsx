// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingLayout from './layouts/LandingLayout';
import SpaciousLayout from './layouts/SpaciousLayout';
import Landing from './pages/Landing';
import { Invest } from './pages/Invest';
import { Dashboard } from './pages/Profil';
import { OneProductDetails } from './pages/OneProductDetails';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ConfirmPasswordResetPage from './components/auth/ConfirmPasswordResetPage.tsx';
import RequestPasswordResetForm from './components/auth/RequestPasswordResetForm.tsx';
import ErrorPage from './pages/ErrorPage';
import 'mapbox-gl/dist/mapbox-gl.css';
import AuthProvider from '../src/components/auth/AuthProvider';
import RequireAuth from '../src/components/auth/RequireAuth';
import { PublicOnly } from '../src/components/auth/PublicOnly';
import PropertySell from './pages/property/SellProperty';
import VerifyEmailPage from './components/auth/VerifyEmailPage';

function App() {
  return (
    <div className="relative h-screen">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* 🔒 Routes protégées */}
            <Route
              path="/profil"
              element={
                <RequireAuth>
                  <SpaciousLayout>
                    <Dashboard />
                  </SpaciousLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/sell"
              element={
                <RequireAuth>
                  <SpaciousLayout>
                    <PropertySell />
                  </SpaciousLayout>
                </RequireAuth>
              }
            />

            {/*  Pages visibles uniquement si NON connecté */}
            <Route
              path="/signup"
              element={
                <PublicOnly>
                  <AuthLayout>
                    <SignupPage />
                  </AuthLayout>
                </PublicOnly>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                </PublicOnly>
              }
            />

            {/* Vérification d’e-mail — accessible à tous (pas sous RequireAuth/PublicOnly) */}
            <Route
              path="/verify-email"
              element={
                <AuthLayout>
                  <VerifyEmailPage />
                </AuthLayout>
              }
            />

            {/* 🌐 Pages publiques */}
            <Route
              path="/"
              element={
                <LandingLayout>
                  <Landing />
                </LandingLayout>
              }
            />
            <Route
              path="/invest"
              element={
                <MainLayout>
                  <Invest />
                </MainLayout>
              }
            />
            <Route
              path="/oneProductDetails"
              element={
                <MainLayout>
                  <OneProductDetails />
                </MainLayout>
              }
            />

            {/* 🔑 Password reset flow */}
            <Route
              path="/forgot-password"
              element={<RequestPasswordResetForm />}
            />
            <Route
              path="/reset-password"
              element={<ConfirmPasswordResetPage />}
            />

            {/* ❌ 404 */}
            <Route
              path="/404"
              element={
                <SpaciousLayout>
                  <ErrorPage />
                </SpaciousLayout>
              }
            />
            {/* Optional: catch-all to /404 */}
            {/* <Route path='*' element={<Navigate to='/404' replace />} /> */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
