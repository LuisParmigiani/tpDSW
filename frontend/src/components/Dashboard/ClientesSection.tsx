import DashboardSection from '../DashboardSection/DashboardSection';
import { useState, useEffect } from 'react';
import SelectionBar from '../SelectionBar/SelectionBar';
import ItemTurno from '../itemTurno/ItemTurno';
import PaginationControls from '../../components/Pagination/PaginationControler';

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
	const [turnos, setTurnos] = useState(mockTurnos);
	const [pendingAction, setPendingAction] = useState<null | 'Confirmado' | 'Cancelado'>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentTurnos = turnos.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(turnos.length / itemsPerPage);

	useEffect(() => {
		if (selectedRows.length > 0) {
			setShowBar(true);
			setFadeOut(false);
		} else if (showBar) {
			setFadeOut(true);
			setTimeout(() => setShowBar(false), 300);
		}
	}, [selectedRows, showBar]);

	useEffect(() => {
		if (pendingAction) {
			setModalVisible(true);
		} else if (modalVisible) {
			setTimeout(() => setModalVisible(false), 200);
		}
	}, [pendingAction, modalVisible]);

	const handleSelectRow = (idx: number) => {
		setSelectedRows((prev) =>
			prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
		);
	};

	const handleSelectAll = () => {
		if (selectedRows.length === currentTurnos.length) {
			setSelectedRows([]);
		} else {
			setSelectedRows(currentTurnos.map((_, idx) => indexOfFirstItem + idx));
		}
	};

	
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setSelectedRows([]); 
	};

	// Handler para actualizar estado de los seleccionados
	const handleUpdateEstado = (nuevoEstado: 'Confirmado' | 'Cancelado') => {
		setPendingAction(nuevoEstado);
	};

	const handleConfirmAction = () => {
		if (pendingAction) {
			setTurnos((prev) =>
				prev.map((t, idx) =>
					selectedRows.includes(idx) && (t.estado === 'Pendiente' || t.estado === 'Confirmado')
						? { ...t, estado: pendingAction }
						: t
				)
			);
			setShowMenu(false);
			setSelectedRows([]);
			setPendingAction(null);
		}
	};

	const handleCancelAction = () => {
		setPendingAction(null);
	};

	const getValidSelectedCount = () =>
		selectedRows.filter(idx => turnos[idx].estado === 'Pendiente' || turnos[idx].estado === 'Confirmado').length;
	const getInvalidSelectedCount = () =>
		selectedRows.filter(idx => turnos[idx].estado === 'Cancelado' || turnos[idx].estado === 'Completado').length;

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
						<option value="" className="text-gray-700 bg-white">
							Ordenar por
						</option>
						<option value="fecha" className="text-gray-700 bg-white">
							Fecha
						</option>
						<option value="estado" className="text-gray-700 bg-white">
							Estado
						</option>
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
										checked={selectedRows.length === currentTurnos.length && currentTurnos.length > 0}
										onChange={handleSelectAll}
										className="peer h-5 w-5 rounded border border-gray-500 bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500"
									/>
									<span className="absolute pointer-events-none inset-0 flex items-center justify-center">
										{selectedRows.length === currentTurnos.length && currentTurnos.length > 0 && (
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
							</th>
							<th className="py-3 px-4 text-left">Cliente</th>
							<th className="py-3 px-4 text-left">Fecha</th>
							<th className="py-3 px-4 text-left">Hora</th>
							<th className="py-3 px-4 text-left min-w-[220px]">Tarea</th>
							<th className="py-3 px-4 text-left">Monto</th>
							<th className="py-3 px-4 text-left">Estado</th>
						</tr>
					</thead>
					<tbody>
						{currentTurnos.map((turno, idx) => (
							<ItemTurno
								key={indexOfFirstItem + idx}
								turno={turno}
								idx={indexOfFirstItem + idx}
								selected={selectedRows.includes(indexOfFirstItem + idx)}
								onSelect={handleSelectRow}
							/>
						))}
					</tbody>
				</table>
				<PaginationControls
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
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
						onConfirm={() => handleUpdateEstado('Confirmado')}
						onCancel={() => handleUpdateEstado('Cancelado')}
					/>
				)}
				{(pendingAction || modalVisible) && (
					<div className="fixed inset-0 z-50 flex items-center justify-center">
						<div className={`absolute inset-0 bg-black opacity-20 transition-opacity duration-200 ${pendingAction ? 'opacity-20' : 'opacity-0'}`}></div>
						<div className={`relative bg-white border border-gray-300 rounded-lg shadow-lg p-6 min-w-[300px] flex flex-col items-center ${pendingAction ? 'animate-fadeInModal' : 'animate-fadeOutModal'}` }>
							<span className="text-lg font-semibold mb-4 text-gray-900">¿Seguro que quieres {pendingAction === 'Confirmado' ? 'confirmar' : 'cancelar'} los turnos seleccionados?</span>
							<span className="text-sm text-gray-700 mb-2">{getValidSelectedCount()} turno(s) se pueden actualizar.</span>
							{getInvalidSelectedCount() > 0 && (
								<span className="text-sm text-red-500 mb-2">{getInvalidSelectedCount()} turno(s) no se pueden modificar por estar cancelados o completados.</span>
							)}
							<div className="flex gap-4">
								<button className="bg-orange-500 text-white px-4 py-2 rounded font-medium hover:bg-orange-600 cursor-pointer" onClick={handleConfirmAction}>Sí, {pendingAction === 'Confirmado' ? 'confirmar' : 'cancelar'}</button>
								<button className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300 cursor-pointer" onClick={handleCancelAction}>Cancelar</button>
							</div>
						</div>
						<style>{`
      @keyframes fadeInModal {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes fadeOutModal {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
      }
      .animate-fadeInModal {
        animation: fadeInModal 0.2s ease;
      }
      .animate-fadeOutModal {
        animation: fadeOutModal 0.2s ease;
      }
    `}</style>
					</div>
				)}
			</div>
		</DashboardSection>
	);
}

export default ClientesSection;
