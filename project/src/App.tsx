import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import EcoPage from './pages/EcoPage';
import WellnessPage from './pages/WellnessPage';
import FoodPage from './pages/FoodPage';
import CraftPage from './pages/CraftPage';
import FashionPage from './pages/FashionPage';
import DecorItemsPage from './pages/DecorItemsPage';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/eco" element={<EcoPage />} />
            <Route path="/wellness" element={<WellnessPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/craft" element={<CraftPage />} />
            <Route path="/fashion" element={<FashionPage />} />
            <Route path="/decor" element={<DecorItemsPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
