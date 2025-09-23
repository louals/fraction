import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardLayout2 from './layouts/DashboardLayout2';

import { Home } from './pages/Home';
import { Invest } from './pages/Invest';
import { Dashboard } from './pages/Dashboard';
import { OneProductDetails } from './pages/OneProductDetails';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ErrorPage from './pages/ErrorPage';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  return (
    <div className='relative h-screen'>
      <BrowserRouter>
        <Routes>
          {/* Auth routes - full page */}
          <Route
            path='/login'
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />
          <Route
            path='/signup'
            element={
              <AuthLayout>
                <SignupPage />
              </AuthLayout>
            }
          />

          {/* Main app routes - wrapped in MainLayout */}
          <Route
            path='/'
            element={
              <MainLayout>
                <Home />
              </MainLayout>
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
            path='/dashboard'
            element={
              <DashboardLayout2>
                <Dashboard />
              </DashboardLayout2>
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
              <DashboardLayout2>
                <ErrorPage />
              </DashboardLayout2>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
