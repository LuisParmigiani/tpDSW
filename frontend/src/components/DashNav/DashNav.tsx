import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../cookie/useAuth';
import LogoutButton from '../LogoutButton/LogoutButton.tsx';

export interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface DashNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  showMobileNav?: boolean;
  setShowMobileNav?: (show: boolean) => void;
}

function DashNav({ activeSection, setActiveSection, showMobileNav, setShowMobileNav, menuItems }: DashNavProps & { menuItems: MenuItem[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  // Hook para detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay oscuro para móvil cuando se despliega */}
      {isMobile && (
        <div 
          className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
            showMobileNav ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setShowMobileNav?.(false)}
        />
      )}
      
      {/* Sidebar principal - siempre visible */}
      <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isMobile 
          ? 'w-16 fixed inset-y-0 left-0 z-30' // En móvil: siempre colapsado
          : `${isCollapsed ? 'w-16' : 'w-64'} relative` // En desktop: normal
      }`}>
        
        <div className="p-4 border-b border-gray-200 h-16 flex items-center">
        {!(isMobile || isCollapsed) ? (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-gray-700 px-3">Dashboard</h2>
            {/* Solo mostrar botón de colapsar en desktop */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer"
                style={{ outline: 'none', border: 'none' }}
              >
                <svg 
                  className={`w-5 h-5 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center h-full items-center">
            {/* Botón hamburguesa para móvil */}
            {isMobile && (
              <button
                onClick={() => setShowMobileNav?.(true)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer"
                style={{ outline: 'none', border: 'none' }}
              >
                <svg 
                  className="w-5 h-5 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            {/* Solo mostrar botón de expandir en desktop */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer"
                style={{ outline: 'none', border: 'none' }}
              >
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile && setShowMobileNav) {
                  setShowMobileNav(false);
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 rounded-lg ${isCollapsed ? 'text-center' : 'text-left'} transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer group ${
                activeSection === item.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
              }`}
              style={{ outline: 'none', border: 'none' }}
            >
              <span className={`transition-colors ${activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>

    {/* Botón de Logout */}
        <div className="p-4">
          <LogoutButton onLogout={handleLogout} isCollapsed={isMobile || isCollapsed} />
        </div>

        {/* Información del Usuario */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${(isMobile || isCollapsed) ? 'justify-center' : 'space-x-3'}`}>
            <img 
              src={usuario?.foto || usuario?.urlFoto || "/images/fotoUserId.png"} 
              alt="User" 
              className="w-8 h-8 rounded-full object-cover"
            />
            {!(isMobile || isCollapsed) && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 text-left">
                  {usuario?.nombre || usuario?.apellido 
                    ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim()
                    : usuario?.mail }
                </p>
                <p className="text-xs text-gray-500 text-left">
                  { usuario?.mail }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar expandida para móvil (overlay) */}
      {isMobile && (
        <div className={`bg-white shadow-lg border-r border-gray-200 w-64 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-out ${
          showMobileNav ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 border-b border-gray-200 h-16 flex items-center">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-semibold text-gray-700 px-3">Dashboard</h2>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      if (isMobile && setShowMobileNav) {
                        setShowMobileNav(false);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer group ${
                      activeSection === item.id
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                    }`}
                    style={{ outline: 'none', border: 'none' }}
                  >
                    <span className={`transition-colors ${activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4">
            <LogoutButton onLogout={handleLogout} isCollapsed={false} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <img 
                src={usuario?.foto || usuario?.urlFoto || "/images/fotoUserId.png"} 
                alt="User" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 text-left">
                  {usuario?.nombre || usuario?.apellido 
                    ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim()
                    : usuario?.mail }
                </p>
                <p className="text-xs text-gray-500 text-left">
                  { usuario?.mail }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashNav;