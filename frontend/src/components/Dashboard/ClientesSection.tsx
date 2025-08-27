import DashboardSection from '../DashboardSection/DashboardSection';
import { useState, useEffect, useCallback } from 'react';
import SelectionBar from '../SelectionBar/SelectionBar';
import ItemTurno from '../itemTurno/ItemTurno';
import PaginationControls from '../../components/Pagination/PaginationControler';
import { turnosApi } from '../../services/turnosApi';


const PRESTADOR_ID_FIXED = '46';

interface TurnoDisplay {
	id: number;
	paciente: string;
	fecha: string;
	hora: string;
	estado: string;
	tarea: string;
	avatar: string;
	monto: number;
}

function ClientesSection() {
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [showMenu, setShowMenu] = useState(false);
	const [showBar, setShowBar] = useState(false);
	const [fadeOut, setFadeOut] = useState(false);
	const [turnos, setTurnos] = useState<TurnoDisplay[]>([]);
	const [pendingAction, setPendingAction] = useState<null | 'Confirmado' | 'Cancelado'>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const itemsPerPage = 6;

	
	const convertirTurnoADisplay = (turno: unknown): TurnoDisplay => {
		const turnoObj = turno as {
			id: number;
			fechaHora: string;
			estado: string;
			montoFinal: number;
			usuario?: { nombre?: string; apellido?: string; mail?: string };
			servicio?: { tarea?: { descripcionTarea?: string } };
		};
		
		const fechaHora = new Date(turnoObj.fechaHora);
		
		return {
			id: turnoObj.id,
			paciente: turnoObj.usuario?.nombre && turnoObj.usuario?.apellido 
				? `${turnoObj.usuario.nombre} ${turnoObj.usuario.apellido}`
				: turnoObj.usuario?.mail || 'Usuario desconocido',
			fecha: fechaHora.toLocaleDateString('es-AR', { 
				day: 'numeric', 
				month: 'long', 
				year: 'numeric' 
			}),
			hora: fechaHora.toLocaleTimeString('es-AR', { 
				hour: '2-digit', 
				minute: '2-digit', 
				hour12: true 
			}),
			estado: turnoObj.estado,
			tarea: turnoObj.servicio?.tarea?.descripcionTarea || 'Tarea no especificada',
			avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(turnoObj.usuario?.nombre || turnoObj.usuario?.mail || 'Usuario')}&background=f97316&color=ffffff`,
			monto: turnoObj.montoFinal || 0
		};
	};

	
		const cargarTurnos = useCallback(async (page = 1) => {
		try {
			setLoading(true);
			setError(null);
			
			const response = await turnosApi.getByPrestadorId(
				PRESTADOR_ID_FIXED,
				itemsPerPage.toString(),
				page.toString()
			);
			
			if (!response.data.data || response.data.data.length === 0) {
				console.log('⚠️ No hay turnos para el prestador ID:', PRESTADOR_ID_FIXED);
			}
			
			const turnosDisplay = response.data.data.map(convertirTurnoADisplay);
			console.log('Turnos cargados:', turnosDisplay.length);
			
			setTurnos(turnosDisplay);
			setTotalPages(response.data.pagination.totalPages);
			
		} catch (err: unknown) {
			console.error('Error cargando turnos:', err);
			console.error('Error completo:', JSON.stringify(err, null, 2));
			setError(`Error al cargar los turnos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		} finally {
			setLoading(false);
		}
	}, [itemsPerPage]);

	// Cargar turnos al montar el componente y cuando cambie la página
	useEffect(() => {
		cargarTurnos(currentPage);
	}, [currentPage, cargarTurnos]);

	// Los turnos actuales son todos los que se muestran (ya vienen paginados del API)
	const currentTurnos = turnos;
	
	// Helper para determinar si todos los elementos de la página actual están seleccionados
	const currentPageIndices = currentTurnos.map((_, idx) => idx);
	const allCurrentPageSelected = currentPageIndices.length > 0 && currentPageIndices.every(idx => selectedRows.includes(idx));

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
		if (allCurrentPageSelected) {
			// Deseleccionar todos los de la página actual
			setSelectedRows([]);
		} else {
			// Seleccionar todos los de la página actual
			setSelectedRows(currentPageIndices);
		}
	};

	
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Limpiar selecciones al cambiar de página (porque son datos diferentes)
		setSelectedRows([]);
	};

	// Handler para actualizar estado de los seleccionados
	const handleUpdateEstado = (nuevoEstado: 'Confirmado' | 'Cancelado') => {
		setPendingAction(nuevoEstado);
	};

	const handleConfirmAction = async () => {
		if (pendingAction && selectedRows.length > 0) {
			try {
				// Obtener IDs de los turnos seleccionados que se pueden modificar
				const turnosValidos = selectedRows
					.map(idx => turnos[idx])
					.filter(t => t && (t.estado === 'Pendiente' || t.estado === 'Confirmado'))
					.map(t => t.id);

				if (turnosValidos.length > 0) {
					await turnosApi.updateMultipleEstados(turnosValidos, pendingAction);
					// Recargar los datos después de la actualización
					await cargarTurnos(currentPage);
				}
				
				setShowMenu(false);
				setSelectedRows([]);
				setPendingAction(null);
			} catch (error) {
				console.error('Error actualizando turnos:', error);
				setError('Error al actualizar los turnos. Por favor, intenta nuevamente.');
			}
		}
	};

	const handleCancelAction = () => {
		setPendingAction(null);
	};

	const getValidSelectedCount = () =>
		selectedRows.filter(idx => turnos[idx] && (turnos[idx].estado === 'Pendiente' || turnos[idx].estado === 'Confirmado')).length;
	const getInvalidSelectedCount = () =>
		selectedRows.filter(idx => turnos[idx] && (turnos[idx].estado === 'Cancelado' || turnos[idx].estado === 'Completado')).length;

	// Mostrar loading
	if (loading) {
		return (
			<DashboardSection>
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
						<p className="text-gray-600">Cargando turnos...</p>
					</div>
				</div>
			</DashboardSection>
		);
	}

	// Mostrar error
	if (error) {
		return (
			<DashboardSection>
				<div className="text-center py-8">
					<div className="text-red-500 mb-4">{error}</div>
					<button 
						onClick={() => cargarTurnos(currentPage)}
						className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
					>
						Reintentar
					</button>
				</div>
			</DashboardSection>
		);
	}

	return (
		<DashboardSection>
			<div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
				<h2 className="text-xl font-semibold text-gray-900">Turnos</h2>
				<div className="text-sm text-gray-600">
					Prestador ID: {PRESTADOR_ID_FIXED}
				</div>
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
										checked={allCurrentPageSelected}
										onChange={handleSelectAll}
										className="peer h-5 w-5 rounded border border-gray-500 bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500"
									/>
									<span className="absolute pointer-events-none inset-0 flex items-center justify-center">
										{allCurrentPageSelected && (
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
								key={turno.id}
								turno={turno}
								idx={idx}
								selected={selectedRows.includes(idx)}
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
