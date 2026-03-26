import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import About from './pages/About';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminSettings from './pages/admin/AdminSettings';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminLayout from './components/admin/AdminLayout';
import { useState, useEffect, useRef } from 'react';
import WishlistModal from './components/WishlistModal';

import './App.css';

const UserLayout = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const handleOpenWishlist = () => setIsWishlistOpen(true);
    window.addEventListener('openWishlist', handleOpenWishlist);
    return () => window.removeEventListener('openWishlist', handleOpenWishlist);
  }, []);

  // Custom gold cursor — uses refs so elements are guaranteed present
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      // Slight delay on the ring for trailing effect
      setTimeout(() => {
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
      }, 80);
    };

    const addHover = (e) => {
      if (e.target.closest('button, a, [role="button"], .fchip, .svg-card, .hcard')) {
        cursor.classList.add('hovered');
        ring.classList.add('hovered');
      }
    };

    const removeHover = (e) => {
      if (e.target.closest('button, a, [role="button"], .fchip, .svg-card, .hcard')) {
        cursor.classList.remove('hovered');
        ring.classList.remove('hovered');
      }
    };

    document.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseover', addHover, { passive: true });
    document.addEventListener('mouseout', removeHover, { passive: true });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', addHover);
      document.removeEventListener('mouseout', removeHover);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Custom cursor elements — using refs not getElementById */}
      <div ref={cursorRef} id="cursor" />
      <div ref={ringRef} id="cursor-ring" />
      <Navbar onOpenWishlist={() => setIsWishlistOpen(true)} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};



function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* User Routes */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductEdit />} />
            <Route path="products/edit/:id" element={<AdminProductEdit />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
