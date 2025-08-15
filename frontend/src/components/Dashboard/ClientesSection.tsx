import DashboardSection from '../DashboardSection/DashboardSection';

function ClientesSection() {
  return (
    <DashboardSection title="Clientes">
      <p className="text-gray-600">Gestión de clientes</p>
      <div className="mt-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-gray-800 mb-2">Lista de Clientes</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="text-sm">Juan Pérez</span>
              <span className="text-xs text-gray-500">Activo</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="text-sm">María García</span>
              <span className="text-xs text-gray-500">Activo</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="text-sm">Carlos López</span>
              <span className="text-xs text-gray-500">Pendiente</span>
            </div>
          </div>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
          Agregar Cliente
        </button>
      </div>
    </DashboardSection>
  );
}

export default ClientesSection;
