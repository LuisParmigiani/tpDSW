// hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: number;
  rol: 'cliente' | 'prestador';
}

const useAuth = () => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  console.log('useAuth renderizado');
  const verificarAuth = async () => {
    try {
      const response = await fetch('/api/auth/verificar', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsuario(data.user);
      } else {
        setUsuario(null);
      }
      console.log('useAuth entre al try');
    } catch {
      console.log('useAuth entre al catch');
      setUsuario(null);
    } finally {
      console.log('useAuth entre al finally');
      setLoading(false);
    }
  };

  useEffect(() => {
    verificarAuth();
  }, []);

  return { usuario, loading, verificarAuth };
};
export default useAuth;
