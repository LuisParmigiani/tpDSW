import Navbar from '../../components/navBar/Navbar.js';
import styles from './Servicios.module.css';
import React from 'react';
import BotonForm from '../../components/Botones/BotonForm.js';
import ServicioCard from '../../components/servicios.cards/ServicioCard';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../services/api.js';

type Servicio = {
  id: number;
  nombre: string;
  rubros: string[];
  puntuacion: number;
};

type Filtros = {
  servicio: string;
  zona: string;
  ordenarPor: string;
};

function FiltrosDeServicios() {
  const [filtrosForm, setFiltrosForm] = useState<Filtros>({
    servicio: '', // You can set default values here, e.g., 'Electricista'
    zona: '',
    ordenarPor: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    
    console.log('Submitting filters:', filtrosForm);
    // Here you can add logic to filter services based on filtrosForm
    // For example: call an API or filter a local array
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltrosForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <form className={styles.filtros} onSubmit={handleSubmit}>
        <label aria-label="Servicio">
          Servicio:
          <select 
            name="servicio" 
            value={filtrosForm.servicio}
            onChange={handleChange}
          >
            <option value="">Todos los servicios</option>
            <option value="Electricista">Electricista</option>
            <option value="Plomero">Plomero</option>
            <option value="Carpintero">Carpintero</option>
            <option value="Pintor">Pintor</option>
            <option value="Jardinero">Jardinero</option>
            <option value="Cerrajero">Cerrajero</option>
            <option value="Gasista">Gasista</option>
            <option value="Otros">Otros</option>
          </select>
        </label>
        <label aria-label="Zona">
          Zona:
          <select 
            name="zona" 
            value={filtrosForm.zona}
            onChange={handleChange}
          >
            <option value="">Todas las zonas</option>
            <option value="Norte">Norte</option>
            <option value="Sur">Sur</option>
            <option value="Este">Este</option>
            <option value="Oeste">Oeste</option>
          </select>
        </label>
        <label aria-label="Ordenar Por">
          Ordenar por:
          <select 
            name="ordenarPor" 
            value={filtrosForm.ordenarPor}
            onChange={handleChange}
          >
            <option value="">Sin orden específico</option>
            <option value="Precio">Precio</option>
            <option value="Valoracion">Valoración</option>
          </select>
        </label>
        <BotonForm texto="Buscar" tipo="submit" />
      </form>
    </>
  );
}

export default function Servicios() {
  const id_user = 4; // Example user ID

  return (
    <>
      <Navbar id={id_user} />
      <FiltrosDeServicios />
    </>
  );
}
