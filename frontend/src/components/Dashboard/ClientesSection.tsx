import DashboardSection from '../DashboardSection/DashboardSection';
import { useState, useEffect, useCallback, useRef } from 'react';
import SelectionBar from '../SelectionBar/SelectionBar';
import ItemTurno from '../itemTurno/ItemTurno';
import PaginationControls from '../../components/Pagination/PaginationControler';
import { turnosApi } from '../../services/turnosApi';
import TurnoDetailsModal from '../Modal/TurnoDetailsModal';
import ConfirmationModal from '../Modal/ConfirmationModal';


const PRESTADOR_ID_FIXED = '47';

// Función auxiliar para capitalizar la primera letra
const capitalizeFirstLetter = (string: string) => {
	if (!string) return string;
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Función para convertir datos del API al formato que usa el componente
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
		cliente: turnoObj.usuario?.nombre && turnoObj.usuario?.apellido 
			? `${turnoObj.usuario.nombre} ${turnoObj.usuario.apellido}`
			: turnoObj.usuario?.mail || 'Usuario desconocido',
		fecha: fechaHora.toLocaleDateString('es-AR', { 
			day: '2-digit', 
			month: '2-digit', 
			year: '2-digit' 
		}),
		hora: fechaHora.toLocaleTimeString('es-AR', { 
			hour: '2-digit', 
			minute: '2-digit', 
			hour12: true 
		}),
		estado: capitalizeFirstLetter(turnoObj.estado),
		tarea: turnoObj.servicio?.tarea?.descripcionTarea || 'Tarea no especificada',
		avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(turnoObj.usuario?.nombre || turnoObj.usuario?.mail || 'Usuario')}&background=f97316&color=ffffff`,
		monto: Number(turnoObj.montoFinal) || 0
	};
};

interface TurnoDisplay {
	id: number;
	cliente: string;
	fecha: string;
	hora: string;
	estado: string;
	tarea: string;
	avatar: string;
	monto: number;
}

function ClientesSection() {
	const [selectedTurnoIds, setSelectedTurnoIds] = useState<number[]>([]); // Cambio: usar IDs en lugar de índices
	const [showMenu, setShowMenu] = useState(false);
	const [showBar, setShowBar] = useState(false);
	const [fadeOut, setFadeOut] = useState(false);
	const [turnos, setTurnos] = useState<TurnoDisplay[]>([]);
	const [pendingAction, setPendingAction] = useState<null | 'Confirmado' | 'Cancelado' | 'Completado'>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<string>('');
	const [estadoFilters, setEstadoFilters] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [activeSearchQuery, setActiveSearchQuery] = useState<string>(''); // La búsqueda actualmente aplicada
	const [showEstadoDropdown, setShowEstadoDropdown] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [selectedTurnoDetails, setSelectedTurnoDetails] = useState<TurnoDisplay | null>(null);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [isErrorAnimating, setIsErrorAnimating] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const dropdownRef = useRef<HTMLDivElement>(null);
	const itemsPerPage = 6;

	const cargarTurnos = useCallback(async (page = 1, ordenamiento = sortBy, filtrosEstado = estadoFilters, isPageChange = false, searchTerm = '') => {
		try {
			if (isPageChange) {
				setLoading(true); // Solo para cambios de página
			} else {
				setLoading(true); // Para carga inicial o cambios de filtros/ordenamiento
			}
			setError(null);
			
			// Mapear las opciones del frontend a los valores que espera el backend
			let backendOrderValue = '';
			switch (ordenamiento) {
				case 'fecha':
					backendOrderValue = 'fechaD'; // Fecha descendente (más reciente primero)
					break;
				case 'fechaAsc':
					backendOrderValue = 'fechaA'; // Fecha ascendente (más antigua primero)
					break;
				case 'monto':
					backendOrderValue = 'montoD'; // Monto descendente (mayor primero)
					break;
				case 'montoMenor':
					backendOrderValue = 'montoA'; // Monto ascendente (menor primero)
					break;
				default:
					backendOrderValue = ''; // Sin ordenamiento específico
			}
			
			// Determinar filtro de estado para el backend
			let backendFilterValue = '';
			if (filtrosEstado.length === 1) {
				// Si solo hay un filtro seleccionado, usar el filtro específico
				const estado = filtrosEstado[0].toLowerCase();
				if (estado === 'pendiente') backendFilterValue = 'pendientes';
				else if (estado === 'confirmado') backendFilterValue = 'confirmados';
				else if (estado === 'cancelado') backendFilterValue = 'cancelados';
				else if (estado === 'completado') backendFilterValue = 'completado';
			} else if (filtrosEstado.length > 1) {
				// Para múltiples filtros, enviamos los estados separados por coma
				backendFilterValue = 'multipleStates:' + filtrosEstado.map(e => e.toLowerCase()).join(',');
			}
			// Si no hay filtros, no aplicar filtro específico (mostrar todos)
			
			const response = await turnosApi.getByPrestadorId(
				PRESTADOR_ID_FIXED,
				itemsPerPage.toString(),
				page.toString(),
				backendFilterValue || 'all', // selectedValueShow - usar 'all' si está vacío
				backendOrderValue, // selectedValueOrder - nuestro ordenamiento
				searchTerm // searchQuery - parámetro de búsqueda
			);
			
			const turnosDisplay = response.data.data.map(convertirTurnoADisplay);
			
			setTurnos(turnosDisplay);
			setTotalPages(response.data.pagination.totalPages);
			
		} catch (err: unknown) {
			console.error('Error cargando turnos:', err);
			console.error('Error completo:', JSON.stringify(err, null, 2));
			setError(`Error al cargar los turnos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		} finally {
			setLoading(false);
		}
	}, [itemsPerPage, sortBy, estadoFilters]); // Remover searchQuery de las dependencias

	// Cargar turnos al montar el componente y cuando cambie la página
	useEffect(() => {
		if (currentPage === 1) {
			cargarTurnos(currentPage, sortBy, estadoFilters, false, activeSearchQuery); // Mantener búsqueda activa
		} else {
			cargarTurnos(currentPage, sortBy, estadoFilters, true, activeSearchQuery); // Mantener búsqueda activa
		}
	}, [currentPage, cargarTurnos, sortBy, estadoFilters, activeSearchQuery]);

	// Función para manejar la búsqueda al presionar Enter
	const handleSearch = () => {
		setCurrentPage(1); // Reset a página 1
		setActiveSearchQuery(searchQuery); // Guardar la búsqueda activa (puede ser vacía para limpiar)
		cargarTurnos(1, sortBy, estadoFilters, false, searchQuery); // Cargar con búsqueda
	};

	// Función para manejar el Enter en el input de búsqueda
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	// useEffect para limpiar la búsqueda automáticamente cuando el campo esté vacío
	useEffect(() => {
		if (searchQuery.trim() === '' && activeSearchQuery !== '') {
			// El usuario borró todo el texto, limpiar la búsqueda activa
			setActiveSearchQuery('');
			setCurrentPage(1);
			cargarTurnos(1, sortBy, estadoFilters, false, '');
		}
	}, [searchQuery, activeSearchQuery, sortBy, estadoFilters, cargarTurnos]);

	// Los turnos actuales son todos los que se muestran (ya vienen paginados del API)
	const currentTurnos = turnos;
	
	// Helper para determinar si todos los elementos de la página actual están seleccionados
	const currentPageTurnoIds = currentTurnos.map(turno => turno.id);
	const allCurrentPageSelected = currentPageTurnoIds.length > 0 && currentPageTurnoIds.every(id => selectedTurnoIds.includes(id));

	useEffect(() => {
		if (selectedTurnoIds.length > 0) {
			setShowBar(true);
			setFadeOut(false);
		} else if (showBar) {
			setFadeOut(true);
			setTimeout(() => setShowBar(false), 300);
		}
	}, [selectedTurnoIds, showBar]);

	useEffect(() => {
		if (pendingAction) {
			setModalVisible(true);
		} else if (modalVisible) {
			setTimeout(() => setModalVisible(false), 200);
		}
	}, [pendingAction, modalVisible]);

	// Cerrar dropdown cuando se hace clic fuera
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowEstadoDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleSelectRow = (idx: number) => {
		const turnoId = turnos[idx]?.id;
		if (turnoId) {
			setSelectedTurnoIds((prev) =>
				prev.includes(turnoId) ? prev.filter((id) => id !== turnoId) : [...prev, turnoId]
			);
		}
	};

	const handleSelectAll = () => {
		if (allCurrentPageSelected) {
			// Deseleccionar todos los de la página actual
			setSelectedTurnoIds(prev => prev.filter(id => !currentPageTurnoIds.includes(id)));
		} else {
			// Seleccionar todos los de la página actual
			setSelectedTurnoIds(prev => [...new Set([...prev, ...currentPageTurnoIds])]);
		}
	};
	
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// NO limpiar selecciones al cambiar de página - mantener los IDs seleccionados
	};

	// Handler para actualizar estado de los seleccionados
	const handleUpdateEstado = (nuevoEstado: 'Confirmado' | 'Cancelado' | 'Completado') => {
		setPendingAction(nuevoEstado);
		setModalVisible(true);
		// calculateSelectedCounts se ejecutará automáticamente por el useEffect
	};

	// Handler para mostrar detalles del turno seleccionado
	const handleShowDetails = async () => {
		if (selectedTurnoIds.length === 0) {
			showAnimatedError('No hay turnos seleccionados');
			return;
		}

		if (selectedTurnoIds.length > 1) {
			showAnimatedError('Solo puedes ver detalles de un turno a la vez');
			return;
		}

		try {
			// Buscar el turno en los datos locales primero
			const turnoId = selectedTurnoIds[0];
			const turnoLocal = turnos.find(t => t.id === turnoId);
			
			if (turnoLocal) {
				// Usar datos locales que ya tienen la descripción de la tarea
				setSelectedTurnoDetails(turnoLocal);
				setShowDetailsModal(true);
			} else {
				// Si no está en los datos locales, obtener del backend
				// (esto puede pasar con turnos de otras páginas)
				const response = await turnosApi.getById(turnoId.toString());
				const turnoData = response.data.data || response.data;
				
				if (turnoData) {
					const turnoDisplay = convertirTurnoADisplay(turnoData);
					setSelectedTurnoDetails(turnoDisplay);
					setShowDetailsModal(true);
				}
			}
		} catch (error) {
			console.error('Error obteniendo detalles del turno:', error);
			showAnimatedError('Error al obtener los detalles del turno');
		}
	};

	const handleConfirmAction = async () => {
		if (pendingAction && selectedTurnoIds.length > 0) {
			try {
				// Obtener todos los turnos seleccionados desde el backend para validar
				const turnosPromises = selectedTurnoIds.map(id => turnosApi.getById(id.toString()));
				const turnosResponses = await Promise.all(turnosPromises);
				
				const turnosValidos: number[] = [];
				
				turnosResponses.forEach(response => {
					const turno = response.data.data || response.data;
					if (!turno || !turno.estado) return;
					
					const estado = turno.estado.toLowerCase();
					
					// Verificar que no esté completado o cancelado
					if (estado === 'completado' || estado === 'cancelado') {
						return;
					}
					
					// Validar transiciones específicas
					let esValido = false;
					if (pendingAction === 'Confirmado' && estado === 'pendiente') {
						esValido = true;
					} else if (pendingAction === 'Cancelado' && (estado === 'pendiente' || estado === 'confirmado')) {
						esValido = true;
					} else if (pendingAction === 'Completado' && estado === 'confirmado') {
						esValido = true;
					}
					
					if (esValido) {
						turnosValidos.push(turno.id);
					}
				});
				
				// Actualizar solo los turnos válidos
				if (turnosValidos.length > 0) {
					await turnosApi.updateMultipleEstados(turnosValidos, pendingAction.toLowerCase());
				}
				
				// Recargar los datos después de la actualización
				await cargarTurnos(currentPage, sortBy, estadoFilters, false, activeSearchQuery);
				
				setShowMenu(false);
				setSelectedTurnoIds([]);
				setPendingAction(null);
				setModalVisible(false);
			} catch (error) {
				console.error('Error actualizando turnos:', error);
				setError('Error al actualizar los turnos. Por favor, intenta nuevamente.');
			}
		}
	};

	const handleCancelAction = () => {
		setPendingAction(null);
		setModalVisible(false);
	};

	// Estado para contar turnos válidos/inválidos cross-page
	const [validSelectedCount, setValidSelectedCount] = useState(0);
	const [invalidSelectedCount, setInvalidSelectedCount] = useState(0);

	// Función helper para mostrar mensajes de error con animación
	const showAnimatedError = (message: string) => {
		setErrorMessage(message);
		setShowErrorMessage(true);
		setTimeout(() => setIsErrorAnimating(true), 10);
		
		// Después de 3 segundos, iniciar animación de salida
		setTimeout(() => {
			setIsErrorAnimating(false);
			setTimeout(() => setShowErrorMessage(false), 200);
		}, 3000);
	};

	// Función para calcular turnos válidos/inválidos cross-page
	const calculateSelectedCounts = useCallback(async () => {
		if (selectedTurnoIds.length === 0 || !pendingAction) {
			setValidSelectedCount(0);
			setInvalidSelectedCount(0);
			return;
		}

		try {
			// Obtener todos los turnos seleccionados por ID
			const turnosPromises = selectedTurnoIds.map(id => turnosApi.getById(id.toString()));
			const turnosResponses = await Promise.all(turnosPromises);
			
			let validCount = 0;
			let invalidCount = 0;

			turnosResponses.forEach(response => {
				const turno = response.data.data || response.data;
				if (!turno || !turno.estado) {
					invalidCount++;
					return;
				}

				const estado = turno.estado.toLowerCase();
				
				// Verificar que no esté completado o cancelado (no se pueden alterar)
				if (estado === 'completado' || estado === 'cancelado') {
					invalidCount++;
					return;
				}
				
				// Validar transiciones específicas
				let esValido = false;
				if (pendingAction === 'Confirmado' && estado === 'pendiente') {
					esValido = true;
				} else if (pendingAction === 'Cancelado' && (estado === 'pendiente' || estado === 'confirmado')) {
					esValido = true;
				} else if (pendingAction === 'Completado' && estado === 'confirmado') {
					esValido = true;
				}
				
				if (esValido) {
					validCount++;
				} else {
					invalidCount++;
				}
			});

			setValidSelectedCount(validCount);
			setInvalidSelectedCount(invalidCount);
		} catch (error) {
			console.error('Error calculando turnos válidos/inválidos:', error);
			setValidSelectedCount(0);
			setInvalidSelectedCount(selectedTurnoIds.length);
		}
	}, [selectedTurnoIds, pendingAction]);

	// Ejecutar cálculo cuando cambia pendingAction o selectedTurnoIds
	useEffect(() => {
		if (pendingAction) {
			calculateSelectedCounts();
		}
	}, [pendingAction, calculateSelectedCounts]);

	// Función para manejar el cambio de ordenamiento
	const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newSortBy = event.target.value;
		setSortBy(newSortBy);
		
		// Recargar los datos con el nuevo ordenamiento desde la primera página
		setCurrentPage(1);
		cargarTurnos(1, newSortBy, estadoFilters, false, activeSearchQuery); // Mantener búsqueda activa
	};

	// Funciones para manejar los filtros de estado
	const handleEstadoFilterChange = (estado: string) => {
		const newFilters = estadoFilters.includes(estado)
			? estadoFilters.filter(f => f !== estado)
			: [...estadoFilters, estado];
			
		setEstadoFilters(newFilters);
		
		// Recargar los datos con los nuevos filtros desde la primera página
		setCurrentPage(1);
		cargarTurnos(1, sortBy, newFilters, false, activeSearchQuery); // Mantener búsqueda activa
	};

	const clearEstadoFilters = () => {
		setEstadoFilters([]);
		setCurrentPage(1);
		cargarTurnos(1, sortBy, [], false, activeSearchQuery); // Mantener búsqueda activa
	};

	const estadosDisponibles = ['Pendiente', 'Confirmado', 'Cancelado', 'Completado'];

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
						onClick={() => cargarTurnos(currentPage, sortBy, estadoFilters, false, activeSearchQuery)}  // Mantener búsqueda activa
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
				<div className="flex gap-2">
					<input
						type="text"
						placeholder="Buscar cliente..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
					/>
					<select 
						value={sortBy}
						onChange={handleSortChange}
						className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
					>
						<option value="" className="text-gray-700 bg-white">
							Ordenar por
						</option>
						<option value="fecha" className="text-gray-700 bg-white">
							Fecha (más reciente)
						</option>
						<option value="fechaAsc" className="text-gray-700 bg-white">
							Fecha (más antigua)
						</option>
						<option value="monto" className="text-gray-700 bg-white">
							Monto (mayor)
						</option>
						<option value="montoMenor" className="text-gray-700 bg-white">
							Monto (menor)
						</option>
					</select>
					
					{/* Dropdown de filtrar por estado */}
					<div className="relative" ref={dropdownRef}>
						<button
							onClick={() => setShowEstadoDropdown(!showEstadoDropdown)}
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex items-center gap-2"
						>
							<span>
								Filtrar por {estadoFilters.length > 0 && `(${estadoFilters.length})`}
							</span>
							<svg 
								className={`w-4 h-4 transition-transform ${showEstadoDropdown ? 'rotate-180' : ''}`} 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						
						{showEstadoDropdown && (
							<div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
								<div className="p-3">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium text-gray-700">Estados</span>
										{estadoFilters.length > 0 && (
											<button
												onClick={clearEstadoFilters}
												className="text-xs text-orange-600 hover:text-orange-700"
											>
												Limpiar
											</button>
										)}
									</div>
									{estadosDisponibles.map(estado => (
										<label key={estado} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-1">
											<input
												type="checkbox"
												checked={estadoFilters.includes(estado)}
												onChange={() => handleEstadoFilterChange(estado)}
												className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
											/>
											<span className="text-sm text-gray-700">{estado}</span>
										</label>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="overflow-x-auto bg-white rounded-lg shadow relative">
				<table className="min-w-full text-sm table-fixed">
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
						{currentTurnos.length > 0 ? (
							currentTurnos.map((turno, idx) => (
								<ItemTurno
									key={turno.id}
									turno={turno}
									idx={idx}
									selected={selectedTurnoIds.includes(turno.id)}
									onSelect={handleSelectRow}
								/>
							))
						) : (
							<tr>
								<td colSpan={7} className="py-4 text-center">
									<p className="text-gray-400 opacity-60 mt-8">
										{activeSearchQuery 
											? "No se encontraron turnos que coincidan con tu búsqueda."
											: "No hay turnos disponibles."
										}
									</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<div className={`mt-2 flex items-center justify-end ${currentTurnos.length > 0 ? 'min-h-[60px]' : 'min-h-[20px]'}`}>
					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
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
				{showErrorMessage && (
					<div className={`fixed left-1/2 bottom-24 transform -translate-x-1/2 z-50 bg-red-100 border border-red-200 text-red-800 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 ${
						isErrorAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
					}`}>
						{errorMessage}
					</div>
				)}
				{showBar && (
					<SelectionBar
						selectedCount={selectedTurnoIds.length}
						onDeselectAll={() => {
							setFadeOut(true);
							setTimeout(() => setSelectedTurnoIds([]), 300);
						}}
						showMenu={showMenu}
						setShowMenu={setShowMenu}
						fadeOut={fadeOut}
						onConfirm={() => handleUpdateEstado('Confirmado')}
						onCancel={() => handleUpdateEstado('Cancelado')}
						onComplete={() => handleUpdateEstado('Completado')}
						onShowDetails={handleShowDetails}
					/>
				)}
				
				{/* Modal de confirmación */}
				<ConfirmationModal
					isVisible={modalVisible}
					pendingAction={pendingAction}
					validSelectedCount={validSelectedCount}
					invalidSelectedCount={invalidSelectedCount}
					onConfirm={handleConfirmAction}
					onCancel={handleCancelAction}
				/>
				
				{/* Modal de detalles del turno */}
				<TurnoDetailsModal
					isVisible={showDetailsModal}
					turnoDetails={selectedTurnoDetails}
					onClose={() => setShowDetailsModal(false)}
				/>
			</div>
		</DashboardSection>
	);
}

export default ClientesSection;
