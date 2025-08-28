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
      const response = await fetch('/api/auth/verificar', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsuario(data.user);
      } else {
        setUsuario(null);
      }
    } catch {
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
