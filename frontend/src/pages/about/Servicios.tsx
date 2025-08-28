import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.tsx';
import ServicioCard from '../../components/servicios.cards/ServicioCard';
import { tiposServicioApi } from '../../services/tipoSericiosApi';
import { zonasApi } from '../../services/zonasApi';
import { usuariosApi } from '../../services/usuariosApi';
import { ServiciosForm } from '../../components/Forms/FormServicios';
import PaginationControls from '../../components/Pagination/PaginationControler';

// FIX 1: Complete Usuario type to match ServicioCard props
type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  nombreFantasia: string;
  tiposDeServicio: Array<{
    id: number;
    nombreTipo: string;
    descripcionTipo: string;
  }>;
  tareas: Array<{ nombreTarea: string }>;
  zonas: Array<{ id: number; descripcionZona: string }>;
  calificacion: number;

  // Add other properties your backend returns
};
type Filtros = {
  servicio: string;
  tarea?: string;
  zona: string;
  ordenarPor: string;
};
type TipoServicioResponse = {
  id: number;
  nombreTipo: string;
  descripcionTipo: string;
  tareas: Array<{
    id: number;
    nombreTarea: string;
    descripcionTarea: string;
    duracionTarea: number;
    tipoServicio: number;
  }>;
};

type TipoServicio = {
  nombreTipo: string;
  descripcionTipo: string;
  tareas: Array<{ id: number; nombreTarea: string }>;
};
type Zona = {
  id: number;
  descripcionZona: string;
};

type FormValues = {
  servicio: string;
  tarea?: string;
  zona: string;
  ordenarPor: string;
};
function FiltrosDeServicios() {
  // Get URL parameters
  const [searchParams] = useSearchParams();
  const servicioParam = searchParams.get('tipoServicio') || '';
  const tareaParam = searchParams.get('tarea') || '';
  const zonaParam = searchParams.get('zona') || '';
  const orderByParam = searchParams.get('orderBy') || '';

  const [filtrosForm, setFiltrosForm] = useState<Filtros>({
    servicio: '',
    tarea: '',
    zona: '',
    ordenarPor: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submit, setSubmit] = useState(false);
  // FIX 2: Correct type for usuarios array
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [tipoServicios, setTipoServicios] = useState<TipoServicio[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const cantPrestPorPagina = '6';

  // Initialize form with URL parameters when component mounts

  // FIX 3: Separate function for fetching data
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await tiposServicioApi.getAllWithTareas();
        const tipoServs = response.data.data;
        const tareasDelTipo: Array<{ id: number; nombreTarea: string }> = [];
        tipoServs.forEach((element: TipoServicioResponse) => {
          element.tareas.forEach(
            (tarea: { id: number; nombreTarea: string }) => {
              const tareaResponse = {
                id: tarea.id,
                nombreTarea: tarea.nombreTarea,
              };
              tareasDelTipo.push(tareaResponse);
            }
          );
        });
        tipoServs.push({
          nombreTipo: 'Todos',
          descripcionTipo: 'Todos los servicios',
          tareas: tareasDelTipo,
        });
        setTipoServicios(tipoServs); // Use the modified array
      } catch (error) {
        console.error('Error fetching servicios:', error);
        return [];
      }
    };
    const fetchZonas = async () => {
      try {
        const response = await zonasApi.getAll();
        const zons = response.data.data;
        zons.push({
          id: 999, // Add an ID for the "Todas" option
          descripcionZona: 'Todas',
        });
        setZonas(zons); // Use the modified array
      } catch (error) {
        console.error('Error fetching zonas:', error);
        return [];
      }
    };
    //!Todo esto se hace apenas carga la página, ya que el useEffect está vacío
    fetchServicios();
    fetchZonas();
    // Hago que es muestren todos de manera default:

    if (servicioParam && tareaParam && zonaParam && orderByParam) {
      setFiltrosForm({
        servicio: servicioParam,
        tarea: tareaParam,
        zona: zonaParam,
        ordenarPor: orderByParam,
      });
    } else {
      setFiltrosForm((prev) => ({
        ...prev,
        servicio: 'Todos',
        zona: 'Todas',
        ordenarPor: 'calificacion',
      }));
    }
    setSubmit(true); // Trigger the search after fetching
  }, [orderByParam, servicioParam, tareaParam, zonaParam]);

  useEffect(() => {
    if (!submit) return;

    const fetchUsuarios = async (
      servicio: string,
      tarea: string | undefined,
      zona: string,
      ordenarPor: string,
      cantPrestPorPagina: string,
      currentPage: number
    ) => {
      if (servicio === '' || zona === '' || ordenarPor === '') {
        console.log('Missing servicio or zona');
        return;
      }

      try {
        setIsLoading(true);
        console.log(
          `Fetching usuarios for servicio: ${servicio},tarea: ${tarea}, zona: ${zona} and ordered by: ${ordenarPor}`
        );
        console.log(cantPrestPorPagina, currentPage);
        const response = await usuariosApi.getPrestatariosByTipoServicioAndZona(
          servicio,
          tarea || '',
          zona,
          ordenarPor,
          cantPrestPorPagina,
          currentPage.toString()
        );
        setUsuarios(response.data.data);
        setTotalPages(response.data.pagination.totalPages);

        console.log('Usuarios fetched:', response.data.data);
        console.log(response.data.pagination);
      } catch (err: unknown) {
        console.error('Error: ', err);
        setError('Error al cargar los prestadores de servicios');
        setUsuarios([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarios(
      filtrosForm.servicio,
      filtrosForm.tarea,
      filtrosForm.zona,
      filtrosForm.ordenarPor,
      cantPrestPorPagina,
      currentPage
    );
  }, [
    submit,
    filtrosForm.servicio,
    filtrosForm.tarea,
    filtrosForm.zona,
    filtrosForm.ordenarPor,
    currentPage,
  ]);

  // FIX 6: Fixed form submission logic
  const handleFormSubmit = (values: FormValues) => {
    console.log('handling form submit with values:', values);
    setFiltrosForm(values);
    setSubmit(true);
    setError(null); // Clear previous errors when submitting
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      <p className="ml-4 text-secondary text-lg font-medium">
        Cargando prestadores de servicios...
      </p>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="mx-auto my-8 max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar los datos
            </h3>
            <p className="mt-1 text-sm text-red-700">{message}</p>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              setError(null);
              setSubmit(true); // Retry the request
            }}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="mx-auto my-12 max-w-md text-center">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 shadow-lg">
        <div className="flex justify-center mb-4">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No se encontraron prestadores
        </h3>
        <p className="text-gray-600 mb-4">
          No hay prestadores disponibles para los filtros seleccionados.
        </p>
        <p className="text-sm text-gray-500">
          Intenta modificar tus criterios de búsqueda.
        </p>
      </div>
    </div>
  );

  // Render cards or states
  const renderContent = () => {
    // Show error if there's an error
    if (error) {
      return <ErrorMessage message={error} />;
    }

    // Show loading if loading
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // Show results or empty state
    if (usuarios && usuarios.length > 0) {
      const cards = usuarios.map((user) => {
        const nombresRubros = user.tiposDeServicio
          .map((tipo) => tipo.nombreTipo)
          .join(', ');

        return (
          <ServicioCard
            id={user.id}
            nombre={user.nombreFantasia}
            rubros={nombresRubros}
            puntuacion={user.calificacion}
            key={user.id} // Better to use user.id instead of index
          />
        );
      });

      return (
        <>
          <div className="flex flex-wrap flex-col xl:flex-row gap-5 mx-8 mt-8 align-middle justify-items-center">
            {cards}
          </div>
          <div className="flex justify-center mt-8">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      );
    }

    // Show empty state only if we've submitted the form (to avoid showing it initially)
    if (submit) {
      return <EmptyState />;
    }

    // Initial state - show nothing or a welcome message
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          Selecciona un servicio y zona para ver los prestadores disponibles
        </p>
      </div>
    );
  };

  return (
    <>
      <ServiciosForm
        tipoServicios={tipoServicios}
        zonas={zonas}
        onSubmit={handleFormSubmit}
        filtrosForm={filtrosForm}
      />
      {renderContent()}
    </>
  );
}

export default function Servicios() {
  return (
    <>
      <Navbar />
      <FiltrosDeServicios />
    </>
  );
}
