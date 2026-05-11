import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { setUserFromOAuth } = useAuth();

  useEffect(() => {
    const verifyOAuthLogin = async () => {
      try {
        const response = await api.get('/auth/verify');
        const user = response.data.user;
        if (user) {
          setUserFromOAuth(null, user);
          if (user.id_rol === 1) {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          navigate('/login', { replace: true });
        }
      } catch {
        navigate('/login', { replace: true });
      }
    };

    verifyOAuthLogin();
  }, [navigate, setUserFromOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center text-white">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Completando inicio de sesión...</p>
      </div>
    </div>
  );
}
