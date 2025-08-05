import { useEffect, useState } from 'react';
import BotonForm from '../../components/Botones/BotonForm.js';
import Navbar from '../../components/Navbar/Navbar.js';
import ServicioCard from '../../components/servicios.cards/ServicioCard.js';
import { apiServices } from '../../services/api.js';
import styles from './Servicios.module.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './../../components/Select/Select.js';

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
  zonas: Array<{ id: number; descripcionZona: string }>;

  // Add other properties your backend returns
};

type Filtros = {
  servicio: string;
  zona: string;
  ordenarPor: string;
};

type TipoServicio = {
  nombreTipo: string;
  descripcionTipo: string;
};
type Zona = {
  id: number;
  descripcionZona: string;
};
function FiltrosDeServicios() {
  const [filtrosForm, setFiltrosForm] = useState<Filtros>({
    servicio: '',
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
  // FIX 3: Separate function for fetching data
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await apiServices.tiposServicio.getAll();
        setTipoServicios(response.data.data);
      } catch (error) {
        console.error('Error fetching servicios:', error);
        return [];
      }
    };
    const fetchZonas = async () => {
      try {
        const response = await apiServices.zonas.getAll();
        setZonas(response.data.data);
      } catch (error) {
        console.error('Error fetching zonas:', error);
        return [];
      }
    };
    fetchServicios();
    fetchZonas();
  }, []);

  useEffect(() => {
    if (!submit) return;

    const fetchUsuarios = async (servicio: string, zona: string) => {
      console.log(servicio);
      if (servicio === '' || zona === '') {
        console.log('Missing servicio or zona');
        return;
      }

      try {
        setIsLoading(true);
        console.log(
          `Fetching usuarios for servicio: ${servicio}, zona: ${zona}`
        );
        const response = await apiServices.usuarios.getPrestatarios(
          servicio,
          zona
        );
        setUsuarios(response.data.data);
        console.log('Usuarios fetched:', response.data.data);
      } catch (err: any) {
        console.error('Error: ', err);
        setError('Error al cargar los prestadores de servicios');
        setUsuarios([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarios(filtrosForm.servicio, filtrosForm.zona);
  }, [submit, filtrosForm.servicio, filtrosForm.zona]);

  // FIX 6: Fixed form submission logic
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log('handling submit');
    event.preventDefault(); // Prevent page reload

    const formData = new FormData(event.currentTarget);
    const newFiltros = {
      servicio: formData.get('servicio') as string,
      zona: formData.get('zona') as string,
      ordenarPor: formData.get('ordenarPor') as string,
    };
    setFiltrosForm(newFiltros);
    setSubmit(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSubmit(false);
    setFiltrosForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const cards = [];
  if (usuarios && usuarios.length > 0) {
    usuarios.map((user, index) => {
      //Uno todos los nombres de los tipos de servicio
      const nombresRubros = user.tiposDeServicio
        .map((tipo) => tipo.nombreTipo)
        .join(', ');
      cards.push(
        <ServicioCard
          id={user.id}
          nombre={user.nombreFantasia}
          rubros={nombresRubros}
          puntuacion={4}
          key={index}
        />
      );
    });
  } else {
    const index = 0;
    cards.push(
      <p key={index} className={styles.noResults}>
        No se encontraron prestatarios
      </p>
    );
  }

  const tiposOptions = [];
  if (tipoServicios && tipoServicios.length > 0) {
    tipoServicios.map((tipo, index) => {
      tiposOptions.push(
        <SelectItem
          value={tipo.nombreTipo}
          className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
          key={index}
        >
          {tipo.nombreTipo}
        </SelectItem>
      );
    });
  } else {
    tiposOptions.push(
      <SelectItem key={0} value="vacio">
        No hay servicios disponibles
      </SelectItem>
    );
  }

  const zonasOptions = [];
  if (zonas && zonas.length > 0) {
    zonas.map((z, index) => {
      zonasOptions.push(
        <SelectItem
          key={index}
          value={z.descripcionZona}
          className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
        >
          {z.descripcionZona}
        </SelectItem>
      );
    });
  } else {
    zonasOptions.push(
      <SelectItem key={0} value="vacio">
        No hay zonas disponibles
      </SelectItem>
    );
  }
  return (
    <>
      <form
        className={
          //animaciones
          'hover:scale-105 transition ease-in-out duration-75 ' +
          //primero Los mobiles
          'bg-tinte-5 mx-auto my-2 flex gap-2 py-1 shadow-2xl flex-col max-w-4/5 justify-center items-center rounded-md ' +
          //después lo desktop
          'lg:rounded-full lg:flex-row lg:align-middle'
        }
        id="formServicios"
        onSubmit={handleSubmit}
      >
        <div className="mb-4  m ">
          <Select>
            <SelectTrigger className="w-[180px] text-secondary text-base font-medium bg-white">
              <SelectValue placeholder="Servicio" />
            </SelectTrigger>
            <SelectContent>{tiposOptions}</SelectContent>
          </Select>
        </div>
        <div className="mb-4   ">
          <Select>
            <SelectTrigger className="w-[180px] text-secondary text-base font-medium bg-white">
              <SelectValue placeholder="Zona" />
            </SelectTrigger>
            <SelectContent>{zonasOptions}</SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Select>
            <SelectTrigger className="w-[180px] text-secondary text-base font-medium bg-white">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="calificacion"
                className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
              >
                Calificación
              </SelectItem>
              <SelectItem
                value="nombre"
                className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
              >
                Nombre
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <BotonForm texto="Buscar" tipo="submit" />
        </div>
      </form>

      {/* Display loading state */}
      {isLoading && <p>Cargando...</p>}

      {/* Display error state */}
      {error && <p className={styles.error}>{error}</p>}

      {/* FIX 7: Proper rendering of results */}
      <div className={'flex flex-wrap flex-col xl:flex-row gap-5 mx-8'}>
        {cards}
      </div>
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
