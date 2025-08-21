import DashboardSection from '../DashboardSection/DashboardSection';
import { useState, useEffect } from 'react';
import SelectionBar from '../SelectionBar/SelectionBar';

const mockTurnos = [
  {
  paciente: 'Jane Cooper',
    fecha: '30 June 2024',
    hora: '04:30 PM',
  estado: 'Pendiente',
  tarea: 'Destapar cañerias',
  avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  monto: 1200,
  },
  {
  paciente: 'Esther Howard',
    fecha: '29 June 2024',
    hora: '04:45 PM',
  estado: 'Confirmado',
  tarea: 'Instalación de aire acondicionado',
  avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  monto: 3500,
  },
  {
  paciente: 'Guy Hawkins',
    fecha: '28 June 2024',
    hora: '10:30 AM',
  estado: 'Cancelado',
  tarea: 'Reparación de calefón',
  avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  monto: 1800,
  },
  {
  paciente: 'Robert Fox',
    fecha: '27 June 2024',
    hora: '10:45 AM',
  estado: 'Completado',
  tarea: 'Limpieza de tanque de agua',
  avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  monto: 900,
  },
  {
  paciente: 'Albert Flores',
    fecha: '26 June 2024',
    hora: '09:00 AM',
  estado: 'Pendiente',
  tarea: 'Cambio de grifería',
  avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
  monto: 700,
  },
  {
  paciente: 'Annette Black',
    fecha: '25 June 2024',
    hora: '11:15 AM',
  estado: 'Confirmado',
  tarea: 'Pintura de interiores',
  avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
  monto: 2500,
  },
  {
  paciente: 'Jacob Jones',
    fecha: '24 June 2024',
    hora: '02:00 PM',
  estado: 'Cancelado',
  tarea: 'Colocación de cerámicos',
  avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
  monto: 4000,
  },
  {
  paciente: 'Kristin Watson',
    fecha: '23 June 2024',
    hora: '03:30 PM',
  estado: 'Completado',
  tarea: 'Revisión eléctrica',
  avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
  monto: 1500,
  },
];

function ClientesSection() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setShowBar(true);
      setFadeOut(false);
    } else if (showBar) {
      setFadeOut(true);
      setTimeout(() => setShowBar(false), 300);
    }
  }, [selectedRows]);
  // Eliminada declaración duplicada

  const handleSelectRow = (idx: number) => {
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === mockTurnos.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockTurnos.map((_, idx) => idx));
    }
  };
  return (
    <DashboardSection>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Turnos</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option value="" className="text-gray-700 bg-white">Ordenar por</option>
            <option value="fecha" className="text-gray-700 bg-white">Fecha</option>
            <option value="estado" className="text-gray-700 bg-white">Estado</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow relative">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-center">
                <span className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === mockTurnos.length}
                    onChange={handleSelectAll}
                    className="peer h-5 w-5 rounded border border-gray-500 bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="absolute pointer-events-none inset-0 flex items-center justify-center">
                    {selectedRows.length === mockTurnos.length && (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'block' }}>
                        <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </span>
              </th>
              <th className="py-3 px-4 text-left">Cliente</th>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-left">Hora</th>
              <th className="py-3 px-4 text-left">Tarea</th>
              <th className="py-3 px-4 text-left">Monto</th>
              <th className="py-3 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {mockTurnos.map((turno, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-center">
                  <span className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(idx)}
                      onChange={() => handleSelectRow(idx)}
                      className="peer h-5 w-5 rounded border border-gray-500 bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500"
                    />
                    <span className="absolute pointer-events-none inset-0 flex items-center justify-center">
                      {selectedRows.includes(idx) && (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'block' }}>
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </span>
                </td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <img src={turno.avatar} alt={turno.paciente} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-medium text-gray-900">{turno.paciente}</span>
                </td>
                <td className="py-3 px-4 text-gray-900 font-medium">{turno.fecha}</td>
                <td className="py-3 px-4 text-gray-900 font-medium">{turno.hora}</td>
                <td className="py-3 px-4 text-gray-900 font-medium">{turno.tarea}</td>
                <td className="py-3 px-4 text-gray-900 font-medium">{turno.monto ? `$${turno.monto}` : '-'}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${turno.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700'
                        : turno.estado === 'Confirmado' ? 'bg-blue-100 text-blue-700'
                        : turno.estado === 'Cancelado' ? 'bg-red-100 text-red-700'
                        : turno.estado === 'Completado' ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'}
                    `}
                  >
                    {turno.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <style>{`
          .fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInBox 0.3s forwards;
          }
          .fade-out {
            opacity: 1;
            transform: translateY(0);
            animation: fadeOutBox 0.3s forwards;
          }
          @keyframes fadeInBox {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeOutBox {
            to {
              opacity: 0;
              transform: translateY(20px);
            }
          }
        `}</style>
        {showBar && (
          <SelectionBar
            selectedCount={selectedRows.length}
            onDeselectAll={() => {
              setFadeOut(true);
              setTimeout(() => setSelectedRows([]), 300);
            }}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            fadeOut={fadeOut}
          />
        )}
      </div>
    </DashboardSection>
  );
}

export default ClientesSection;
