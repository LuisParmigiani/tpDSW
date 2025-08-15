import DashboardSection from '../DashboardSection/DashboardSection';

function PerfilSection() {
  return (
    <DashboardSection title="Dashboard">
      <p className="text-gray-600">Bienvenido al panel de control</p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800">Estadísticas</h3>
          <p className="text-sm text-gray-600 mt-2">Resumen de actividad</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800">Actividad Reciente</h3>
          <p className="text-sm text-gray-600 mt-2">Últimas acciones</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800">Configuración</h3>
          <p className="text-sm text-gray-600 mt-2">Ajustes del perfil</p>
        </div>
      </div>
    </DashboardSection>
  );
}

export default PerfilSection;
