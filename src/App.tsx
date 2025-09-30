import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingLayout from './layouts/LandingLayout';
import SpaciousLayout from './layouts/SpaciousLayout';
import Landing from './pages/Landing';
import { Home } from './pages/Home';
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

function App() {
  return (
    <div className="relative h-screen">
      <BrowserRouter>
        <Routes>
          {/* Ladnging route - Wrapped in LadingLayout */}
          <Route
            path="/"
            element={
              <LandingLayout>
                <Landing />
              </LandingLayout>
            }
          />
          {/* Auth routes - full page */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthLayout>
                <SignupPage />
              </AuthLayout>
            }
          />

          {/* Main app routes - wrapped in MainLayout */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
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
            path="/dashboard"
            element={
              <SpaciousLayout>
                <Dashboard />
              </SpaciousLayout>
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
          <Route
            path="/404"
            element={
              <SpaciousLayout>
                <ErrorPage />
              </SpaciousLayout>
            }
          />
          {/** Routes for property */}
          <Route
            path="/sell"
            element={
              <SpaciousLayout>
                <SellProperty />
              </SpaciousLayout>
            }
          />

          <Route
            path="/forgot-password"
            element={<RequestPasswordResetForm />}
          />
          <Route
            path="/reset-password"
            element={<ConfirmPasswordResetPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
