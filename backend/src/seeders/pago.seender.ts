// src/seeders/PagoSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Pago } from '../pago/pago.entity.js';
import { Turno } from '../turno/turno.entity.js';
import { faker } from '@faker-js/faker';

export class PagoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando PagoSeeder........................................................................................................'
    );
    // Turnos completados con comentario
    const turnos = await em.find(Turno, {
      estado: 'completado',
      comentario: { $ne: null },
    });

    for (const turno of turnos) {
      // Estado del pago: mayoría succeeded, algunos processing
      const estado = faker.helpers.arrayElement([
        'succeeded',
        'succeeded',
        'succeeded',
        'succeeded',
        'processing',
      ]);

      const amount = turno.montoFinal * 100; // monto en centavos
      const amountReceived = Math.round(turno.montoFinal * 0.95 * 100); // 95% en centavos

      em.create(Pago, {
        paymentIntentId: `pi_${faker.string.alphanumeric(24)}`,
        amount,
        currency: 'usd',
        estado,
        sellerStripeId: `acct_${faker.string.alphanumeric(16)}`,
        amountReceived,
        turno,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await em.flush();
  }
}
