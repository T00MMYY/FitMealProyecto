import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = Number(user.id_rol) || Number(user.rol);
  
  if (!user || userRole !== 1) {
    console.log("AdminProtectedRoute bloqueando acceso. Usuario:", user);
    return <Navigate to="/" replace />;
  }

  return children;
}