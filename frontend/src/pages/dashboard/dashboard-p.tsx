import { useState, useEffect } from 'react';
import DashNav from '../../components/DashNav/DashNav';
import type { MenuItem } from '../../components/DashNav/DashNav';
import { Link } from 'react-router-dom';
import PerfilSection from '../../components/Dashboard/PerfilSection';
import ClientesSection from '../../components/Dashboard/ClientesSection';
import ServiciosSection from '../../components/Dashboard/ServiciosSection';
import ComentariosPrestadorSection from '../../components/Dashboard/ComentariosPrestadorSection';
import { useProtectRoute } from '../../cookie/useProtectRoute.tsx';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('perfil');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { usuario, loading: authLoading } = useProtectRoute(['prestador']);

  // Hook para detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Cerrar menú móvil si se cambia a desktop
      if (!mobile && showMobileNav) {
        setShowMobileNav(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showMobileNav]);

  //Me traigo la info del prestador
  if (authLoading || !usuario) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-600">
        Cargando...
      </div>
    );
  }

  const customMenuItems: MenuItem[] = [
    {
      id: 'perfil',
      name: 'Perfil',
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinejoin="round"
            d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
          />
          <circle cx="12" cy="7" r="3" />
        </svg>
      ),
    },
    {
      id: 'clientes',
      name: 'Clientes',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 5.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0ZM5.5 3a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Zm5 3a1 1 0 1 1 2 0a1 1 0 0 1-2 0Zm1-2a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm-10 6.5A1.5 1.5 0 0 1 3 9h5a1.5 1.5 0 0 1 1.5 1.5v.112a1.38 1.38 0 0 1-.01.137a2.853 2.853 0 0 1-.524 1.342C8.419 12.846 7.379 13.5 5.5 13.5c-1.878 0-2.918-.654-3.467-1.409a2.853 2.853 0 0 1-.523-1.342a1.906 1.906 0 0 1-.01-.137V10.5Zm1 .09v.007l.004.049a1.853 1.853 0 0 0 .338.857c.326.448 1.036.997 2.658.997c1.622 0 2.332-.549 2.658-.997a1.853 1.853 0 0 0 .338-.857a.912.912 0 0 0 .004-.05V10.5A.5.5 0 0 0 8 10H3a.5.5 0 0 0-.5.5v.09Zm9 1.91c-.588 0-1.07-.09-1.46-.238a3.85 3.85 0 0 0 .361-.932c.268.101.624.17 1.099.17c1.119 0 1.578-.382 1.78-.666a1.224 1.224 0 0 0 .218-.56l.002-.028a.25.25 0 0 0-.25-.246h-2.8A2.49 2.49 0 0 0 10 9h3.25c.69 0 1.25.56 1.25 1.25v.017a1.352 1.352 0 0 1-.008.109a2.225 2.225 0 0 1-.398 1.04c-.422.591-1.213 1.084-2.594 1.084Z" />
        </svg>
      ),
    },
    {
      id: 'servicios',
      name: 'Servicios',
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.75 28.4375H11.25C4.4625 28.4375 1.5625 25.5375 1.5625 18.75V11.25C1.5625 4.4625 4.4625 1.5625 11.25 1.5625H18.75C25.5375 1.5625 28.4375 4.4625 28.4375 11.25V18.75C28.4375 25.5375 25.5375 28.4375 18.75 28.4375ZM11.25 3.4375C5.4875 3.4375 3.4375 5.4875 3.4375 11.25V18.75C3.4375 24.5125 5.4875 26.5625 11.25 26.5625H18.75C24.5125 26.5625 26.5625 24.5125 26.5625 18.75V11.25C26.5625 5.4875 24.5125 3.4375 18.75 3.4375H11.25Z"
            fill="currentColor"
          />
          <path
            d="M15.0003 16.3496C14.8378 16.3496 14.6753 16.3121 14.5253 16.2246L7.90028 12.3996C7.45028 12.1371 7.30025 11.5621 7.56275 11.1246C7.82525 10.6746 8.40028 10.5246 8.83778 10.7871L14.9878 14.3496L21.1003 10.8121C21.5503 10.5496 22.1253 10.7121 22.3753 11.1496C22.6253 11.5871 22.4753 12.1746 22.0378 12.4246L15.4628 16.2246C15.3253 16.2996 15.1628 16.3496 15.0003 16.3496Z"
            fill="currentColor"
          />
          <path
            d="M15 23.1501C14.4875 23.1501 14.0625 22.7251 14.0625 22.2126V15.4126C14.0625 14.9001 14.4875 14.4751 15 14.4751C15.5125 14.4751 15.9375 14.9001 15.9375 15.4126V22.2126C15.9375 22.7251 15.5125 23.1501 15 23.1501Z"
            fill="currentColor"
          />
          <path
            d="M14.9998 23.4373C14.2748 23.4373 13.5624 23.2748 12.9874 22.9623L8.98733 20.7373C7.78733 20.0748 6.8623 18.4873 6.8623 17.1123V12.8748C6.8623 11.5123 7.79983 9.92476 8.98733 9.24976L12.9874 7.02476C14.1374 6.38726 15.8623 6.38726 17.0123 7.02476L21.0123 9.24976C22.2123 9.91226 23.1374 11.4998 23.1374 12.8748V17.1123C23.1374 18.4748 22.1998 20.0623 21.0123 20.7373L17.0123 22.9623C16.4373 23.2873 15.7248 23.4373 14.9998 23.4373ZM14.9998 8.43726C14.5873 8.43726 14.1873 8.51226 13.8998 8.67476L9.89984 10.8998C9.28734 11.2373 8.7373 12.1873 8.7373 12.8748V17.1123C8.7373 17.8123 9.28734 18.7498 9.89984 19.0873L13.8998 21.3123C14.4748 21.6373 15.5248 21.6373 16.0998 21.3123L20.0998 19.0873C20.7123 18.7498 21.2624 17.7998 21.2624 17.1123V12.8748C21.2624 12.1748 20.7123 11.2373 20.0998 10.8998L16.0998 8.67476C15.8123 8.51226 15.4123 8.43726 14.9998 8.43726Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      id: 'comentarios',
      name: 'Comentarios',
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'perfil':
        return <PerfilSection />;
      case 'clientes':
        return <ClientesSection />;
      case 'servicios':
        return <ServiciosSection />;
      case 'comentarios':
        return <ComentariosPrestadorSection />;
      default:
        return <PerfilSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={customMenuItems}
        showMobileNav={showMobileNav}
        setShowMobileNav={setShowMobileNav}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isMobile ? 'ml-16' : 'ml-0'}`}>
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <h1 className="text-base sm:text-lg font-semibold text-gray-800 capitalize">
                {activeSection === 'perfil'
                  ? 'Configuración de perfil'
                  : activeSection}
              </h1>
            </div>
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:bg-gray-50 hover:scale-105 transition-all duration-200 rounded-lg p-2 cursor-pointer group"
            >
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                className="w-8 h-8"
              />
              <h2 className="text-lg font-bold text-orange-500 group-hover:text-orange-600 transition-colors">Reformix</h2>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
