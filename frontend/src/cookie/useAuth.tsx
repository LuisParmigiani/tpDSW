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

      const token = localStorage.getItem('token'); // 🔑 tomamos el token guardado
      if (!token) {
        setUsuario(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/verificar`, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔑 mandamos el token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsuario(data.user);
      } else {
        setUsuario(null);
      }
    } catch (error) {
      console.log('❌ UseAuth: error en el catch', error);
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
