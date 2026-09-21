import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PromoModal from './components/PromoModal';
import ChatWidget from './components/ChatWidget';
import BottomNav from './components/BottomNav';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import LiveVideo from './pages/LiveVideo';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderStatus from './pages/OrderStatus';
import MyOrders from './pages/MyOrders';
import PulsaTagihan from './pages/PulsaTagihan';
import RcsFood from './pages/RcsFood';
import RcsPay from './pages/RcsPay';
import RPayLater from './pages/RPayLater';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentOrderId, setPaymentOrderId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [activePromoTab, setActivePromoTab] = useState('free-shipping');

  const [myOrdersTab, setMyOrdersTab] = useState('Semua');

  const openPromoModal = (tabId) => {
    setActivePromoTab(tabId === 'all-promo' ? 'all-promo' : 'free-shipping');
    setIsPromoModalOpen(true);
  };

  const handlePaymentComplete = (orderId, status) => {
    setPaymentOrderId(orderId);
    setPaymentStatus(status);

    if (status === 'success' || status === 'paid' || status === 'pending') {
      try {
        const saved = localStorage.getItem('rcs_saved_orders');
        let currentOrders = [];
        if (saved) {
          try { currentOrders = JSON.parse(saved); } catch (e) { }
        }

        const newOrder = {
          id: orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          shopName: 'Delisa Official Shop',
          isMall: true,
          isLive: false,
          status: 'Dikemas',
          statusCategory: 'Dikemas',
          productName: 'Produk Pilihan Pesanan (Pembayaran Berhasil)',
          variant: 'Standard Package',
          quantity: 1,
          originalPrice: 350000,
          finalPrice: 277920,
          totalPrice: 277920,
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300',
          coinAlert: 'Penjual sedang menyiapkan pesanan Anda',
          coinAmount: ''
        };

        localStorage.setItem('rcs_saved_orders', JSON.stringify([newOrder, ...currentOrders]));
      } catch (e) {
        console.error('Error saving paid order:', e);
      }
      setMyOrdersTab('Dikemas');
    }
    setCurrentPage('order-status');
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            searchQuery={searchQuery}
            openPromoModal={openPromoModal}
            onSelectProduct={handleSelectProduct}
          />
        );
      case 'cart':
        return (
          <Cart
            setCurrentPage={setCurrentPage}
            onPaymentComplete={handlePaymentComplete}
            onSelectProduct={handleSelectProduct}
            onOpenChat={() => setIsChatOpen(true)}
          />
        );
      case 'checkout':
        return (
          <Checkout
            setCurrentPage={setCurrentPage}
            onPaymentComplete={handlePaymentComplete}
          />
        );
      case 'product-detail':
        return (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setCurrentPage('home')}
            setCurrentPage={setCurrentPage}
            onPaymentComplete={handlePaymentComplete}
          />
        );
      case 'profile':
        return (
          <Profile
            setCurrentPage={setCurrentPage}
            onOpenChat={() => setIsChatOpen(true)}
          />
        );
      case 'notifications':
        return (
          <Notifications
            setCurrentPage={setCurrentPage}
            onOpenChat={() => setIsChatOpen(true)}
          />
        );
      case 'live-video':
        return (
          <LiveVideo
            onSelectProduct={handleSelectProduct}
          />
        );
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;
      case 'register':
        return <Register setCurrentPage={setCurrentPage} />;
      case 'order-status':
        return (
          <OrderStatus
            orderId={paymentOrderId}
            status={paymentStatus}
            setCurrentPage={setCurrentPage}
            setMyOrdersInitialTab={setMyOrdersTab}
          />
        );
      case 'my-orders':
        return <MyOrders setCurrentPage={setCurrentPage} initialTab={myOrdersTab} />;
      case 'pulsa-tagihan':
        return <PulsaTagihan setCurrentPage={setCurrentPage} />;
      case 'shopee-food':
        return <RcsFood setCurrentPage={setCurrentPage} />;
      case 'shopee-pay':
        return <RcsPay setCurrentPage={setCurrentPage} />;
      case 'spay-later':
        return <RPayLater setCurrentPage={setCurrentPage} />;
      default:
        return (
          <Home
            searchQuery={searchQuery}
            openPromoModal={openPromoModal}
            onSelectProduct={handleSelectProduct}
          />
        );
    }
  };

  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '60px' }}>
      {/* Top Header Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content View */}
      <main style={{ flexGrow: 1 }}>
        {renderPage()}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        openPromoModal={openPromoModal}
      />

      {/* Promo & Free Shipping Modal */}
      <PromoModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        activeTab={activePromoTab}
      />

      {/* Support Chat Widget */}
      <ChatWidget
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />

      {/* Footer */}
      <footer style={{
        padding: '36px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--glass-border)',
        color: 'var(--text-subtle)',
        fontSize: '0.85rem',
        marginTop: '60px',
        background: 'var(--navbar-bg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Privasi & Kebijakan</span>
          <span>Syarat & Ketentuan</span>
          <span>Pusat Bantuan RCSMART</span>
          <span>Mitra Seller</span>
        </div>
        <p>© 2026 RCSMART Marketplace. All rights reserved. Powered by Go, gRPC, React & Midtrans.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <ThemeProvider>
            <MainApp />
          </ThemeProvider>
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  );
}
