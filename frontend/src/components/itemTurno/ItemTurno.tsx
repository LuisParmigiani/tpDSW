import React from 'react';

type ItemTurnoProps = {
  turno: {
    paciente: string;
    fecha: string;
    hora: string;
    estado: string;
    tarea: string;
    avatar: string;
    monto?: number;
  };
  idx: number;
  selected: boolean;
  onSelect: (idx: number) => void;
};

const ItemTurno: React.FC<ItemTurnoProps> = ({ turno, idx, selected, onSelect }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 text-center">
        <span className="relative flex items-center justify-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(idx)}
            className="peer h-5 w-5 rounded border border-gray-500 bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500"
          />
          <span className="absolute pointer-events-none inset-0 flex items-center justify-center">
            {selected && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'block' }}>
                <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </span>
      </td>
      <td className="py-3 px-4 flex items-center gap-2 text-left">
        <img src={turno.avatar} alt={turno.paciente} className="w-8 h-8 rounded-full object-cover" />
        <span className="font-medium text-gray-900">{turno.paciente}</span>
      </td>
      <td className="py-3 px-4 text-gray-900 font-medium text-left">{turno.fecha}</td>
      <td className="py-3 px-4 text-gray-900 font-medium text-left">{turno.hora}</td>
      <td className="py-3 px-4 text-gray-900 font-medium text-left min-w-[220px]">{turno.tarea}</td>
      <td className="py-3 px-4 text-gray-900 font-medium text-left">{turno.monto ? `$${turno.monto}` : '-'}</td>
      <td className="py-3 px-4 text-left">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold
            ${turno.estado.toLowerCase() === 'pendiente' ? 'bg-yellow-100 text-yellow-800'
              : turno.estado.toLowerCase() === 'confirmado' ? 'bg-blue-100 text-blue-800'
              : turno.estado.toLowerCase() === 'cancelado' ? 'bg-red-100 text-red-800'
              : turno.estado.toLowerCase() === 'completado' ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-700'}
          `}
        >
          {turno.estado}
        </span>
      </td>
    </tr>
  );
};

export default ItemTurno;
