import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminProtectedRoute from '../components/auth/AdminProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Suscripcion from '../pages/Suscripcion';
import MisPedidos from '../pages/MisPedidos';
import Workouts from '../pages/ejercicios/Workouts';
import Ejercicios from '../pages/ejercicios/Ejercicios';
import Recetas from '../pages/Recetas';
import RecetaDetalle from '../pages/RecetaDetalle';
import Onboarding from '../pages/Onboarding';
import Perfil from '../pages/Perfil';
import MiRutina from '../pages/MiRutina';
import Contact from '../pages/Contact';
import OAuthSuccess from '../pages/OAuthSuccess';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminRecipes from '../pages/admin/AdminRecipes';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminExercises from '../pages/admin/AdminExercises';
import AdminTrainers from '../pages/admin/AdminTrainers';
import AdminOrders from '../pages/admin/AdminOrders';
import EntrenadorDashboard from '../pages/entrenador/EntrenadorDashboard';
import Privacidad from '../pages/Privacidad';
import Terminos from '../pages/Terminos';
import Cookies from '../pages/Cookies';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/suscripcion" element={<Suscripcion />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/ejercicios/:id" element={<Ejercicios />} />
      <Route path="/recetas" element={<Recetas />} />
      <Route path="/recetas/:id" element={<RecetaDetalle />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      {/* Legales */}
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/cookies" element={<Cookies />} />

      {/* Usuario autenticado */}
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/pedidos" element={<ProtectedRoute><MisPedidos /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/rutina" element={<ProtectedRoute><MiRutina /></ProtectedRoute>} />

      {/* Entrenador */}
      <Route path="/entrenador" element={<EntrenadorDashboard />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/admin/recipes" element={<AdminProtectedRoute><AdminRecipes /></AdminProtectedRoute>} />
      <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
      <Route path="/admin/exercises" element={<AdminProtectedRoute><AdminExercises /></AdminProtectedRoute>} />
      <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
      <Route path="/admin/trainers" element={<AdminProtectedRoute><AdminTrainers /></AdminProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
