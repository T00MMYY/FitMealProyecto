import { BrowserRouter, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import AppRouter from './router';

function AppContent() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const cartOwner = String(user?.id_usuario ?? user?.id ?? 'guest');
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/entrenador');

  return (
    <CartProvider key={cartOwner} cartOwner={cartOwner}>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />
        <div className="flex-1">
          <AppRouter />
        </div>
        {!isAdmin && <Footer />}
      </div>
    </CartProvider>
  );
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}
