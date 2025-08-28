// hooks/useProtectRoute.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth.tsx';

type Rol = 'cliente' | 'prestador';

export const useProtectRoute = (rolesPermitidos?: Rol[]) => {
  const { usuario, loading } = useAuth();
  const navigate = useNavigate();
  console.log('useProtectRoute renderizado');
  useEffect(() => {
    if (loading) return; // Esperar a que termine de cargar

    // Si no hay usuario, redirigir al inicio
    if (!usuario) {
      console.log('useProtectRoute: usuario no autenticado');
      navigate('/');
      return;
    }

    // Si se especificaron roles y el usuario no los tiene
    if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
      console.log('useProtectRoute: usuario no tiene acceso');
      navigate('/'); // Redirigir al inicio
      return;
    }
  }, [usuario, loading, rolesPermitidos, navigate]);

  return { usuario, loading };
};

export const useRoleReturn = () => {
  console.log('useRoleReturn renderizado');
  const { usuario } = useAuth();
  console.log('useRoleReturn: usuario', usuario);
  return usuario?.rol ?? '';
};
