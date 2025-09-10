// src/seeders/DatabaseSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { UsuarioSeeder } from './Usuario.seender.js';
import { ZonaSeeder } from './zona.seender.js';
import { TipoServicioSeeder } from './tipoServicio.seender.js';
import { TareaSeeder } from './tarea.seender.js';
import { ServicioSeeder } from './servicio.seender.js';
import { TurnoSeeder } from './turno.seender.js';
import { HorarioSeeder } from './horario.seender.js';
import { PagoSeeder } from './pago.seender.js';

export class DatabaseSeeder extends Seeder {
  async run(em: any): Promise<void> {
    console.log(
      'Iniciando seeders.....................................................................................................'
    );
    await this.call(em, [
      UsuarioSeeder,
      ZonaSeeder,
      TipoServicioSeeder,
      TareaSeeder,
      ServicioSeeder,
      TurnoSeeder,
      HorarioSeeder,
      PagoSeeder,
    ]);
  }
}
