import DashboardSection from '../DashboardSection/DashboardSection';

function ServiciosSection() {
  return (
    <DashboardSection title="Servicios">
      <p className="text-gray-600">Gestión de servicios</p>
      {/* Aquí puedes agregar más contenido específico de servicios */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Servicios Activos</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Plomería</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Activo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Electricidad</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Activo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Carpintería</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pendiente</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Estadísticas</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total servicios:</span>
                <span className="text-sm font-medium">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">En progreso:</span>
                <span className="text-sm font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completados:</span>
                <span className="text-sm font-medium">7</span>
              </div>
            </div>
          </div>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
          Crear Servicio
        </button>
      </div>
    </DashboardSection>
  );
}

export default ServiciosSection;
