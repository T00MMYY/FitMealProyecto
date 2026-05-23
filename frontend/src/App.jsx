import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Workouts from "./pages/ejercicios/workouts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MisPedidos from "./pages/MisPedidos";
import Ejercicios from "./pages/ejercicios/Ejercicios";
import Recetas from "./pages/Recetas";
import RecetaDetalle from "./pages/RecetaDetalle";
import Onboarding from "./pages/Onboarding";
import Perfil from "./pages/Perfil";
import ProtectedRoute from "./components/ProtectedRoute";
import MiRutina from "./pages/MiRutina";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRecipes from "./pages/admin/AdminRecipes";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminExercises from "./pages/admin/AdminExercises";
import AdminTrainers from "./pages/admin/AdminTrainers";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Contact from "./pages/Contact";
import EntrenadorDashboard from "./pages/entrenador/EntrenadorDashboard";

function AppContent() {
  const { user } = useAuth();
  const cartOwner = String(user?.id_usuario ?? user?.id ?? 'guest');

  return (
    <CartProvider key={cartOwner} cartOwner={cartOwner}>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/pedidos" element={<ProtectedRoute><MisPedidos /></ProtectedRoute>} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/ejercicios/:id" element={<Ejercicios />} />
                <Route path="/recetas" element={<Recetas />} />
                <Route path="/recetas/:id" element={<RecetaDetalle />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/rutina" element={<MiRutina />} />
                <Route path="/contacto" element={<Contact />} />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/recipes"
                  element={
                    <AdminProtectedRoute>
                      <AdminRecipes />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminProtectedRoute>
                      <AdminUsers />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/exercises"
                  element={
                    <AdminProtectedRoute>
                      <AdminExercises />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/trainers"
                  element={
                    <AdminProtectedRoute>
                      <AdminTrainers />
                    </AdminProtectedRoute>
                  }
                />
                <Route path="/entrenador" element={<EntrenadorDashboard />} />
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-950">
                      <div className="text-center text-white">
                        <h1 className="text-6xl font-bold mb-4">404</h1>
                        <p className="text-xl mb-6">Pagina no encontrada</p>
                        <a
                          href="/"
                          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
                        >
                          Volver al inicio
                        </a>
                      </div>
                    </div>
                  }
                />
              </Routes>
      </div>
    </CartProvider>
  );
}

function App() {
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

export default App;
