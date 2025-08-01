import Navbar from '../../components/Navbar/Navbar.js';
import styles from './Servicios.module.css';
import BotonForm from '../../components/Botones/BotonForm.js';
import ServicioCard from '../../components/servicios.cards/ServicioCard.js';
import { useState } from 'react';
import { useEffect } from 'react';
import { apiServices } from '../../services/api.js';

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
  tiposOptions.push(<option value={''}> Seleccione un servicio</option>);
  if (tipoServicios && tipoServicios.length > 0) {
    tipoServicios.map((tipo, index) => {
      tiposOptions.push(
        <option key={index} value={tipo.nombreTipo}>
          {tipo.nombreTipo}
        </option>
      );
    });
  } else {
    tiposOptions.push(
      <option key={0} value="">
        No hay servicios disponibles
      </option>
    );
  }

  const zonasOptions = [];
  zonasOptions.push(<option value={''}> Seleccione una zona</option>);
  if (zonas && zonas.length > 0) {
    zonas.map((z, index) => {
      zonasOptions.push(
        <option key={index} value={z.descripcionZona}>
          {z.descripcionZona}
        </option>
      );
    });
  } else {
    zonasOptions.push(
      <option key={0} value="">
        No hay zonas disponibles
      </option>
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
          <label
            aria-label="Servicio"
            className={'font-medium text-base text-secondary text-center mr-2'}
            htmlFor="servicio"
          >
            Servicio:
          </label>
          <select
            name="servicio"
            value={filtrosForm.servicio}
            onChange={handleChange}
            required
            className={'text-secondary text-base font-medium bg-white'}
          >
            {tiposOptions}
          </select>
        </div>
        <div className="mb-4   ">
          <label
            aria-label="Zona"
            className={'font-medium text-base text-secondary text-center mr-2'}
            htmlFor="zona"
          >
            Zona:
          </label>
          <select
            name="zona"
            value={filtrosForm.zona}
            onChange={handleChange}
            required
            className={'text-secondary text-base font-medium bg-white'}
          >
            {zonasOptions}
          </select>
        </div>
        <div className="mb-4">
          <label
            aria-label="OrdenarPor"
            className={'font-medium text-base text-secondary text-center mr-2'}
            htmlFor="ordenarPor"
          >
            Ordenar por:
          </label>
          <select
            name="ordenarPor"
            value={filtrosForm.ordenarPor}
            onChange={handleChange}
            className={'text-secondary text-base font-medium bg-white'}
          >
            <option value="">Seleccionar orden</option>
            <option value="Precio">Precio</option>
            <option value="Valoracion">Valoración</option>
          </select>
        </div>
        <div>
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
