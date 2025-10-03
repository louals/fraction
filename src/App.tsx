import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingLayout from './layouts/LandingLayout';
import SpaciousLayout from './layouts/SpaciousLayout';
import Landing from './pages/Landing';
import { Invest } from './pages/Invest';
import { Dashboard } from './pages/Dashboard';
import { OneProductDetails } from './pages/OneProductDetails';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import RequestPasswordResetForm from './components/auth/RequestPasswordResetForm';
import ConfirmPasswordResetPage from './components/auth/ConfirmPasswordResetPage';
import SellProperty from './pages/property/SellProperty';
import ErrorPage from './pages/ErrorPage';
import 'mapbox-gl/dist/mapbox-gl.css';
import AuthProvider from '../src/components/auth/AuthProvider';
import RequireAuth from '../src/components/auth/RequireAuth';
import { PublicOnly } from '../src/components/auth/PublicOnly';

function App() {
  return (
    <div className='relative h-screen'>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* 🔒 Route protégée */}
            <Route
              path='/profil'
              element={
                <RequireAuth>
                  <SpaciousLayout>
                    <Dashboard />
                  </SpaciousLayout>
                </RequireAuth>
              }
            />
            <Route
              path='/sell'
              element={
                <RequireAuth>
                  <SpaciousLayout>
                    <SellProperty />
                  </SpaciousLayout>
                </RequireAuth>
              }
            />

            {/* 🚪 Page visible uniquement si NON connecté */}
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
            {/*  Page visible en tout temps*/}
            <Route
              path='/'
              element={
                <LandingLayout>
                  <Landing />
                </LandingLayout>
              }
            />
            <Route
              path='/invest'
              element={
                <MainLayout>
                  <Invest />
                </MainLayout>
              }
            />

            <Route
              path='/oneProductDetails'
              element={
                <MainLayout>
                  <OneProductDetails />
                </MainLayout>
              }
            />
            <Route
              path='/404'
              element={
                <SpaciousLayout>
                  <ErrorPage />
                </SpaciousLayout>
              }
            />

            <Route
              path='/forgot-password'
              element={<RequestPasswordResetForm />}
            />
            <Route
              path='/reset-password'
              element={<ConfirmPasswordResetPage />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
