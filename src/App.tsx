import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import { Home } from './pages/Home';
import { Invest } from './pages/Invest';
import { OneProductDetails } from './pages/OneProductDetails';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import NavMain from './components/NavMain';
import FooterMain from './components/FooterMain';

function App() {
  return (
    <div className="relative h-screen">
      {/* background image */}
      <img
        src="/assets/img/brand-fraction-img-top.png"
        alt="image brand"
        className="fixed inset-0 -z-10 w-full object-cover pointer-events-none [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]
             [mask-repeat:no-repeat] [mask-size:100%_100%]"
      />

      <BrowserRouter>
        <div className="grid grid-rows-[auto_1fr_auto] gap-y-6 grid-cols-[minmax(16px,1fr)_minmax(0,1200px)_minmax(16px,1fr)] h-full">
          <NavMain />
          <div className="col-start-2 col-end-3">
            <Routes>
              {/* Auth routes */}
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

              {/* Main app routes */}
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
          </div>
          <FooterMain />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
