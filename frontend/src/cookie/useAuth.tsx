// hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: number;
  rol: 'cliente' | 'prestador';
}

const useAuth = () => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const verificarAuth = async () => {
    try {
      const local = import.meta.env.VITE_LOCAL === 'true';
      const API_BASE_URL = local
        ? 'http://localhost:3000/api'
        : 'https://backend-patient-morning-1303.fly.dev/api';
      const response = await fetch(`${API_BASE_URL}/auth/verificar`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsuario(data.user);
      } else {
        setUsuario(null);
      }
    } catch (error) {
<<<<<<< HEAD
      console.log('useAuth entre al catch', error);
=======
      console.log('❌ UseAuth: error en el catch', error);
>>>>>>> 0f77b45824cbbea0f0eaadf15887b04b27526032
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verificarAuth();
  }, []);

  return { usuario, loading, verificarAuth };
};
export default useAuth;
