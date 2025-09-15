import './index.css';
import NavMain from './components/NavMain';
import FooterMain from './components/FooterMain';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { Invest } from './pages/Invest';
import { OneProductDetails } from './pages/OneProductDetails';

function App() {
  return (
    <div className='relative h-screen'>
      {/* image de fond derrière tout */}
      <img
        src='/assets/img/brand-fraction-img-top.png'
        alt='image brand'
        className='fixed inset-0 -z-10 w-full object-cover pointer-events-none [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]
             [mask-repeat:no-repeat] [mask-size:100%_100%]'
      />
      <BrowserRouter>
        <div className='grid grid-rows-[auto_1fr_auto] gap-y-6 row-gap-[1rem] grid-cols-[minmax(16px,1fr)_minmax(0,1200px)_minmax(16px,1fr)] h-full'>
          <NavMain />
          <div className='col-start-2 col-end-3'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/invest' element={<Invest />} />
              <Route
                path='/oneProductDetails'
                element={<OneProductDetails />}
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
