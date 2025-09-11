import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Turno } from '../turno/turno.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { faker } from '@faker-js/faker';

export class TurnoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando TurnoSeeder........................................................................................................'
    );
    const clientes = await em.find(Usuario, { nombreFantasia: null }); // usuarios cliente
    const servicios = await em.find(Servicio, { estado: 'activo' }); // servicios activos

    const estadosFuturos = ['pendiente', 'confirmado'];
    const estadosPasados = [
      'completado',
      'cancelado',
      'completado',
      'completado',
      'completado',
    ];
    // Crear 100 turnos con fechas entre -20 y +20 días desde hoy
    for (let i = 0; i < 300; i++) {
      // Fecha aleatoria entre -20 y +20 días desde hoy
      const fechaHora = faker.date.between({
        from: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      });

      // Determinar el estado según la fecha
      let estado: string;
      if (fechaHora < new Date()) {
        estado = faker.helpers.arrayElement(estadosPasados);
      } else {
        estado = faker.helpers.arrayElement(estadosFuturos);
      }

      // Usuario cliente aleatorio
      const cliente = faker.helpers.arrayElement(clientes);

      // Servicio aleatorio
      const servicio = faker.helpers.arrayElement(servicios);

      // Calificación y comentario solo si completado y fecha futura
      let calificacion: number | undefined;
      let comentario: string | undefined;
      if (estado === 'completado') {
        if (i < 20) {
          // mitad con comentario/calificación
          calificacion = faker.number.int({ min: 1, max: 5 });
          comentario = faker.lorem.sentence();
        }
      }

      const montoFinal = Math.round(servicio.precio * 1.05); // precio + 5%

      em.create(Turno, {
        fechaHora,
        estado,
        usuario: cliente,
        servicio,
        calificacion,
        comentario,
        montoFinal,
      });
    }

    await em.flush();
  }
}
