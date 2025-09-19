// src/seeders/TareaSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { Tarea } from '../tarea/tarea.entity.js';
import { TipoServicio } from '../tipoServicio/tipoServ.entity.js';

export class TareaSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando TareaSeeder........................................................................................................'
    );

    // Verificar si ya existen tareas
    const existingCount = await em.count(Tarea);
    if (existingCount > 0) {
      console.log(
        `Tarea ya tiene ${existingCount} registros. Omitiendo seeder.`
      );
      return;
    }

    // Traemos todos los tipos de servicio ya creados
    const tipos = await em.find(TipoServicio, {});
    let insertadas = 0;

    for (const tipo of tipos) {
      // Creamos 5 tareas por tipo de servicio
      for (let i = 1; i <= 5; i++) {
        // Creamos nombres y descripciones coherentes
        let nombreTarea = '';
        switch (tipo.nombreTipo) {
          case 'Limpieza Residencial':
            nombreTarea = faker.helpers.arrayElement([
              'Limpieza de cocina',
              'Limpieza de baño',
              'Limpieza de habitaciones',
              'Limpieza de sala',
              'Limpieza de ventanas',
              'Limpieza profunda',
              'Limpieza de fachada',
            ]);
            break;
          case 'Limpieza Industrial':
            nombreTarea = faker.helpers.arrayElement([
              'Limpieza de musgo',
              'Limpieza de ventanas en edificios',
              'Limpieza profunda de cocinas',
              'Limpieza de vereda',
              'Puesta a tono de exteriores',
            ]);
            break;
          case 'Plomería':
            nombreTarea = faker.helpers.arrayElement([
              'Reparación de cañerías',
              'Instalación de grifería',
              'Destape de pileta',
              'Revisión de fugas',
              'Instalación de sanitarios',
              'Mantenimiento de bombas',
            ]);
            break;
          case 'Electricidad':
            nombreTarea = faker.helpers.arrayElement([
              'Instalación de enchufes',
              'Reparación de cortocircuitos',
              'Cambio de iluminación',
              'Instalación de cables',
              'Mantenimiento de panel eléctrico',
              'Revisión de tableros',
            ]);
            break;
          case 'Jardinería':
            nombreTarea = faker.helpers.arrayElement([
              'Corte de césped',
              'Poda de árboles',
              'Plantación de flores',
              'Riego de jardines',
              'Limpieza de hojas',
              'Diseño paisajístico',
            ]);
            break;
          case 'Pintura':
            nombreTarea = faker.helpers.arrayElement([
              'Pintura de paredes interiores',
              'Pintura de fachadas',
              'Pintura de techos',
              'Aplicación de barniz',
              'Preparación de superficies',
              'Pintura decorativa',
            ]);
            break;
          case 'Carpintería':
            nombreTarea = faker.helpers.arrayElement([
              'Fabricación de muebles',
              'Reparación de puertas',
              'Instalación de estanterías',
              'Reparación de ventanas',
              'Trabajo con madera',
              'Barnizado de muebles',
            ]);
            break;
          case 'Construcción':
            nombreTarea = faker.helpers.arrayElement([
              'Levantamiento de paredes',
              'Colocación de pisos',
              'Construcción de techos',
              'Trabajos de albañilería',
              'Reparación estructural',
              'Ampliaciones',
            ]);
            break;
          case 'Cerrajería':
            nombreTarea = faker.helpers.arrayElement([
              'Cambio de cerraduras',
              'Instalación de rejas',
              'Reparación de llaves',
              'Apertura de puertas',
              'Instalación de sistemas de seguridad',
              'Duplicado de llaves',
            ]);
            break;
          case 'Climatización':
            nombreTarea = faker.helpers.arrayElement([
              'Instalación de aire acondicionado',
              'Mantenimiento de split',
              'Reparación de ventiladores',
              'Limpieza de filtros',
              'Carga de gas refrigerante',
              'Revisión de ductos',
            ]);
            break;
          case 'Reparaciones Generales':
            nombreTarea = faker.helpers.arrayElement([
              'Reparación de goteras',
              'Arreglo de grietas',
              'Reparación de azulejos',
              'Mantenimiento preventivo',
              'Reparaciones menores',
              'Solución de problemas diversos',
            ]);
            break;
          case 'Servicios Técnicos':
            nombreTarea = faker.helpers.arrayElement([
              'Diagnóstico técnico',
              'Instalación de equipos',
              'Mantenimiento especializado',
              'Calibración de instrumentos',
              'Soporte técnico',
              'Análisis de sistemas',
            ]);
            break;
          case 'Servicios del Hogar':
            nombreTarea = faker.helpers.arrayElement([
              'Organización de espacios',
              'Limpieza de electrodomésticos',
              'Mantenimiento doméstico',
              'Cuidado de plantas',
              'Servicios de lavandería',
              'Gestión del hogar',
            ]);
            break;
          case 'Servicios Integrales':
            nombreTarea = faker.helpers.arrayElement([
              'Mantenimiento completo',
              'Renovación integral',
              'Servicios combinados',
              'Gestión total',
              'Soluciones integrales',
              'Administración de servicios',
            ]);
            break;
          case 'Hogar y Jardín':
            nombreTarea = faker.helpers.arrayElement([
              'Mantenimiento de patios',
              'Cuidado de jardines',
              'Limpieza de exteriores',
              'Decoración de espacios verdes',
              'Mantenimiento de terrazas',
              'Servicios combinados hogar-jardín',
            ]);
            break;
          case 'Control de Plagas':
            nombreTarea = faker.helpers.arrayElement([
              'Fumigación de hormigas',
              'Control de cucarachas',
              'Eliminación de roedores',
              'Desinsectación',
              'Tratamiento de termitas',
              'Prevención de plagas',
            ]);
            break;
          case 'Mantenimiento Integral':
            nombreTarea = faker.helpers.arrayElement([
              'Mantenimiento de edificios',
              'Revisión de instalaciones',
              'Mantenimiento preventivo',
              'Gestión de mantenimiento',
              'Servicios de conserje',
              'Mantenimiento correctivo',
            ]);
            break;
          case 'Servicios de Piscinas':
            nombreTarea = faker.helpers.arrayElement([
              'Limpieza de piscinas',
              'Mantenimiento de filtros',
              'Control de químicos',
              'Reparación de bombas',
              'Limpieza de fondo',
              'Mantenimiento estacional',
            ]);
            break;
          case 'Decoración Interior':
            nombreTarea = faker.helpers.arrayElement([
              'Diseño de ambientes',
              'Selección de colores',
              'Decoración de salas',
              'Ambientación de espacios',
              'Asesoramiento decorativo',
              'Renovación de interiores',
            ]);
            break;
          case 'Refrigeración':
            nombreTarea = faker.helpers.arrayElement([
              'Reparación de heladeras',
              'Mantenimiento de freezers',
              'Instalación de cámaras frías',
              'Reparación de sistemas de frío',
              'Carga de gas refrigerante',
              'Diagnóstico de equipos',
            ]);
            break;
          case 'Tecnología y Automatización':
            nombreTarea = faker.helpers.arrayElement([
              'Instalación de domótica',
              'Configuración de sistemas inteligentes',
              'Automatización de luces',
              'Instalación de sensores',
              'Programación de sistemas',
              'Mantenimiento tecnológico',
            ]);
            break;
          default:
            nombreTarea = `${tipo.nombreTipo} - Tarea ${i}`;
        }

        // Verificar si ya existe una tarea con este nombre
        const existing = await em.findOne(Tarea, { nombreTarea });
        if (!existing) {
          const descripcionTarea = faker.lorem.sentence(); // descripción fake
          // Duración aleatoria en minutos entre 30 y 180
          const duracionTarea = faker.number.int({ min: 30, max: 180 });

          // Creamos la tarea asociada al tipo de servicio
          em.create(Tarea, {
            nombreTarea,
            descripcionTarea,
            duracionTarea,
            tipoServicio: tipo, // asignamos el tipo de servicio
          });
          insertadas++;
        }
      }
    }

    if (insertadas > 0) {
      await em.flush();
      console.log(`Insertadas ${insertadas} nuevas tareas.`);
    } else {
      console.log('Todas las tareas ya existen en la base de datos.');
    }
  }
}
