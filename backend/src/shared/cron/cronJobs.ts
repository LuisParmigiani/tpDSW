import cron from 'node-cron';
import { orm } from '../db/orm.js';
import { Turno } from '../../turno/turno.entity.js';
import { CRON_CONFIG } from './cronConfig.js';

export class CronJobs {
  /**
   * Opciones globales para todos los cron jobs
   */
  private static getCronOptions() {
    return {
      timezone: CRON_CONFIG.timezone,
    };
  }

  /**
   * Inicializa todos los cron jobs
   */
  static initializeCronJobs(): void {
    console.log('🕐 Inicializando cron jobs...');

    // Cambiar estado de turnos no confirmados (diariamente a medianoche)
    this.changestate();

    console.log(
      `✅ Cron jobs inicializados correctamente (Timezone: ${CRON_CONFIG.timezone})`
    );
  }

  /**
   * Cron job de prueba que se ejecuta cada minuto
   * Usar solo para testing, comentar en producción
   */
  private static testCronJob(): void {
    cron.schedule(
      '* * * * *',
      () => {
        console.log(
          '🔄 Test cron job ejecutándose cada minuto:',
          new Date().toISOString()
        );
      },
      this.getCronOptions()
    );
  }

  /**
   * Detiene todos los cron jobs activos
   */
  static destroyAllCronJobs(): void {
    cron.getTasks().forEach((task) => {
      task.destroy();
    });
    console.log('🛑 Todos los cron jobs han sido detenidos');
  }

  /**
   * Cambia el estado de turnos no confirmados a "cancelado" cada día a medianoche
   */
  static changestate(): void {
    cron.schedule(
      '0 0 * * *', // Real pasa cada media noche
      //'* * * * *', // Para probar se ejecuta todos los minutos.
      async () => {
        console.log('🔄 Cambiando estado de turnos no confirmados:');

        try {
          const em = orm.em.fork(); // Crear una instancia del EntityManager

          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999);

          const turnosVencidos = await em.find(Turno, {
            fechaHora: { $gte: todayStart, $lte: todayEnd },
            estado: 'pendiente',
          });

          //  Actualizar estado
          for (const turno of turnosVencidos) {
            turno.estado = 'cancelado';
          }

          //  Guardar cambios
          await em.flush();

          console.log(
            `✅ ${turnosVencidos.length} turnos marcados como cancelados`
          );
        } catch (error) {
          console.error('❌ Error en changestate:', error);
        }
      },
      this.getCronOptions()
    );
  }
}
