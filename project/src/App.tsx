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
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer/Footer';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import CartDrawer from './components/Cart/CartDrawer';

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
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
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </div>
            <Footer />
            <CartDrawer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
