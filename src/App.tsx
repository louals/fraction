import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import { Home } from './pages/Home';
import { Invest } from './pages/Invest';
import { OneProductDetails } from './pages/OneProductDetails';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  return (
    <div className="relative h-screen">
      <BrowserRouter>
        <Routes>
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
            path="/oneProductDetails"
            element={
              <MainLayout>
                <OneProductDetails />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
