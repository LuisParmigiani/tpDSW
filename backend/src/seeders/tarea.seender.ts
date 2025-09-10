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
      console.log(`Tarea ya tiene ${existingCount} registros. Omitiendo seeder.`);
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
          case 'Limpieza Industrial':
            nombreTarea = faker.helpers.arrayElement([
              'Limpieza de ventanas',
              'Limpieza de pisos',
              'Limpieza de baños',
              'Limpieza de cocina',
              'Organización de habitaciones',
            ]);
            break;
          case 'Plomería':
            nombreTarea = faker.helpers.arrayElement([
              'Reparación de cañerías',
              'Instalación de grifería',
              'Desagüe de lavamanos',
              'Revisión de fugas',
              'Instalación de sanitarios',
            ]);
            break;
          case 'Electricidad':
            nombreTarea = faker.helpers.arrayElement([
              'Instalación de enchufes',
              'Reparación de cortocircuitos',
              'Cambio de iluminación',
              'Instalación de cables',
              'Mantenimiento de panel eléctrico',
            ]);
            break;
          case 'Jardinería':
            nombreTarea = faker.helpers.arrayElement([
              'Corte de césped',
              'Poda de árboles',
              'Plantación de flores',
              'Riego de jardines',
              'Limpieza de hojas',
            ]);
            break;
          default:
            nombreTarea = `${tipo.nombreTipo} tarea ${i}`;
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
