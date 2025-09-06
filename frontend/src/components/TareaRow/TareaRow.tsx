import React from 'react';

type Tarea = {
  id: number;
  descripcion: string;
  tipoServicioId: number;
  seleccionada: boolean;
  precio: number;
  duracion?: number;
};

type TipoServicioData = {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
};

type TareaRowProps = {
  tarea: Tarea;
  tipoServicio: TipoServicioData | undefined;
  onTareaChange: (id: number, field: 'seleccionada' | 'precio', value: boolean | number) => void;
};

const TareaRow: React.FC<TareaRowProps> = ({ tarea, tipoServicio, onTareaChange }) => {
  return (
    <tr 
      key={tarea.id} 
      onClick={() => onTareaChange(tarea.id, 'seleccionada', !tarea.seleccionada)}
      className={`cursor-pointer transition-all duration-200 ${
        tarea.seleccionada 
          ? 'bg-orange-50 hover:bg-orange-100' 
          : 'hover:bg-gray-50 hover:shadow-sm'
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-start">
          <span className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={tarea.seleccionada}
              onChange={(e) => {
                e.stopPropagation(); // Evitar doble toggle
                onTareaChange(tarea.id, 'seleccionada', e.target.checked);
              }}
              className="peer h-5 w-5 rounded border border-gray-500 bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500"
            />
            <span className="absolute pointer-events-none inset-0 flex items-center justify-center">
              {tarea.seleccionada && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ display: 'block' }}
                >
                  <path
                    d="M5 10.5L9 14.5L15 7.5"
                    stroke="#fff"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-left">
        <div className="text-sm font-medium text-gray-900 text-left">{tarea.descripcion}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <div className="text-sm font-medium text-gray-900 text-left">
          {tipoServicio?.nombre}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">$</span>
          <input
            type="number"
            min="0"
            step="100"
            value={tarea.precio}
            onChange={(e) => {
              e.stopPropagation(); // Evitar toggle al escribir
              onTareaChange(tarea.id, 'precio', parseInt(e.target.value) || 0);
            }}
            onClick={(e) => e.stopPropagation()} // Evitar toggle al hacer focus
            disabled={!tarea.seleccionada}
            className={`w-24 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 ${
              tarea.seleccionada 
                ? 'border-gray-300 bg-white text-gray-900 hover:border-orange-300' 
                : 'border-gray-200 bg-gray-50 text-gray-400'
            } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>
      </td>
    </tr>
  );
};

export default TareaRow;
export type { Tarea, TipoServicioData, TareaRowProps };
