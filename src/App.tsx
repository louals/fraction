// ======== Tools =========
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
// ======== Layout =========
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingLayout from './layouts/LandingLayout';
import SpaciousLayout from './layouts/SpaciousLayout';
// ======== Pages =========
// global pages
import LandingPage from './pages/LandingPage.tsx';
import ErrorPage from './pages/ErrorPage';
import InvestPage from './pages/InvestPage.tsx';
import ProfilPage from './pages/ProfilPage.tsx';
import OneProductDetailsPage from './pages/OneProductDetailsPage.tsx';
import PropertySellPage from './pages/property/SellPropertyPage.tsx';
// Authentification pages
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import VerifyEmailPage from './components/auth/VerifyEmailPage';
// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage.tsx';
import DashboardIncomePage from './pages/dashboard/DashboardIncomePage.tsx';
// ======== Components =========
import AuthProvider from '../src/components/auth/AuthProvider';
import RequireAuth from '../src/components/auth/RequireAuth';
import { PublicOnly } from '../src/components/auth/PublicOnly';
import ConfirmPasswordResetPage from './components/auth/ConfirmPasswordResetPage.tsx';
import RequestPasswordResetForm from './components/auth/RequestPasswordResetForm.tsx';

function App() {
  return (
    <div className='relative h-screen'>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* 🔒 Routes protégées */}
            <Route
              path='/profil'
              element={
                <RequireAuth>
                  <SpaciousLayout>
                    <ProfilPage />
                  </SpaciousLayout>
                </RequireAuth>
              }
            />
            <Route
              path='/sell'
              element={
                <RequireAuth>
                  <SpaciousLayout>
                    <PropertySellPage />
                  </SpaciousLayout>
                </RequireAuth>
              }
            />
            <Route
              path='/dashboard'
              element={
                <RequireAuth>
                  <SpaciousLayout>
                    <DashboardPage />
                  </SpaciousLayout>
                </RequireAuth>
              }
            />
            <Route
              path='/dashboard/income'
              element={
                <RequireAuth>
                  <SpaciousLayout>
                    <DashboardIncomePage />
                  </SpaciousLayout>
                </RequireAuth>
              }
            />

            {/*  Pages visibles uniquement si NON connecté */}
            <Route
              path='/signup'
              element={
                <PublicOnly>
                  <AuthLayout>
                    <SignupPage />
                  </AuthLayout>
                </PublicOnly>
              }
            />
            <Route
              path='/login'
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
              path='/verify-email'
              element={
                <AuthLayout>
                  <VerifyEmailPage />
                </AuthLayout>
              }
            />

            {/* 🌐 Pages publiques */}
            <Route
              path='/'
              element={
                <LandingLayout>
                  <LandingPage />
                </LandingLayout>
              }
            />
            <Route
              path='/invest'
              element={
                <MainLayout>
                  <InvestPage />
                </MainLayout>
              }
            />
            <Route
              path='/oneProductDetails'
              element={
                <MainLayout>
                  <OneProductDetailsPage />
                </MainLayout>
              }
            />

            {/* 🔑 Password reset flow */}
            <Route
              path='/forgot-password'
              element={<RequestPasswordResetForm />}
            />
            <Route
              path='/reset-password'
              element={<ConfirmPasswordResetPage />}
            />

            {/* ❌ 404 */}
            <Route
              path='/404'
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
