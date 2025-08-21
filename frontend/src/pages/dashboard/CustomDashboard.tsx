import { useState } from 'react';
import DashNav from '../../components/DashNav/DashNav';
import type { MenuItem } from '../../components/DashNav/DashNav';
import DashboardSection from '../../components/DashboardSection/DashboardSection';

function CustomDashboard() {
  const [activeSection, setActiveSection] = useState('analytics');

  const customMenuItems: MenuItem[] = [
    {
      id: 'analytics',
      name: 'Analytics',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: 'ventas',
      name: 'Ventas',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      id: 'inventario',
      name: 'Inventario',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      id: 'configuracion',
      name: 'Configuración',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'analytics':
        return (
          <DashboardSection title="Analytics">
            <p className="text-gray-600">Métricas y estadísticas del negocio</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800">Visitantes</h3>
                <p className="text-2xl font-bold text-blue-600">1,234</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800">Ventas</h3>
                <p className="text-2xl font-bold text-green-600">$45,678</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-purple-800">Conversión</h3>
                <p className="text-2xl font-bold text-purple-600">3.2%</p>
              </div>
            </div>
          </DashboardSection>
        );
      case 'ventas':
        return (
          <DashboardSection title="Ventas">
            <p className="text-gray-600">Gestión de ventas y facturación</p>
            <div className="mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Nueva Venta
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded">
                Ver Facturas
              </button>
            </div>
          </DashboardSection>
        );
      case 'inventario':
        return (
          <DashboardSection title="Inventario">
            <p className="text-gray-600">Control de stock y productos</p>
            <div className="mt-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800">
                  Productos con stock bajo
                </h3>
                <p className="text-sm text-yellow-600">
                  3 productos necesitan reposición
                </p>
              </div>
            </div>
          </DashboardSection>
        );
      case 'configuracion':
        return (
          <DashboardSection title="Configuración">
            <p className="text-gray-600">Ajustes del sistema</p>
            <div className="mt-4 space-y-4">
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium">Configuración General</h3>
                <p className="text-sm text-gray-600">
                  Nombre de empresa, logo, etc.
                </p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium">Usuarios y Permisos</h3>
                <p className="text-sm text-gray-600">Gestión de accesos</p>
              </div>
            </div>
          </DashboardSection>
        );
      default:
        return (
          <DashboardSection title="Analytics">
            <p className="text-gray-600">Sección por defecto</p>
          </DashboardSection>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={customMenuItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800 capitalize">
              {activeSection}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default CustomDashboard;
