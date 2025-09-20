// src/seeders/UsuarioSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { Usuario } from '../usuario/usuario.entity.js';
import { Zona } from '../zona/zona.entity.js';
export class UsuarioSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando UsuarioSeeder........................................................................................................'
    );
    const zonas = await em.find(Zona, {}); // para forzar carga de usuarios y evitar error de clave foránea
    // Clientes
    for (let i = 0; i < 50; i++) {
      em.create(Usuario, {
        mail: faker.internet.email(),
        contrasena:
          '$2b$10$0E9iYMk1AvFZNbpfu0yroOGq2/X8NzjWQjQv4cGAiS0dJsaRCh9oG',
        tipoDoc: 'DNI',
        numeroDoc: faker.number
          .int({ min: 10000000, max: 50000000 })
          .toString(),
        foto: 'https://backend-patient-morning-1303.fly.dev/uploads/profiles/default-avatar.webp',
        telefono: faker.phone.number(),
        nombre: faker.person.firstName(),
        apellido: faker.person.lastName(),
        direccion: faker.location.streetAddress(),
        estado: 'activo',
      });
    }

    em.create(Usuario, {
      mail: 'juan.perez@email.com',
      contrasena:
        '$2b$10$0E9iYMk1AvFZNbpfu0yroOGq2/X8NzjWQjQv4cGAiS0dJsaRCh9oG',
      tipoDoc: 'DNI',
      numeroDoc: faker.number.int({ min: 10000000, max: 50000000 }).toString(),
      foto: 'https://backend-patient-morning-1303.fly.dev/uploads/profiles/default-avatar.webp',
      telefono: '+1' + faker.phone.number(),
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      direccion: faker.location.streetAddress(),
      estado: 'activo',
    });
    em.create(Usuario, {
      mail: 'plomero.herrera@email.com',
      contrasena:
        '$2b$10$0E9iYMk1AvFZNbpfu0yroOGq2/X8NzjWQjQv4cGAiS0dJsaRCh9oG',
      tipoDoc: 'DNI',
      numeroDoc: faker.number.int({ min: 10000000, max: 50000000 }).toString(),
      foto: 'https://backend-patient-morning-1303.fly.dev/uploads/profiles/default-avatar.webp',
      telefono: faker.phone.number(),
      nombre: 'Carlos',
      apellido: 'Herrera',
      direccion: faker.location.streetAddress(),
      nombreFantasia: 'Plomería Herrera',
      descripcion: 'Lo que quieras, lo hacemos',
      estado: 'activo',
      stripeAccountId: 'acct_1N8qgYCuyV9w7dLC',
      zonas: faker.helpers.arrayElements(zonas, 3),
    });

    for (let i = 0; i < 25; i++) {
      // Prestatarios activos
      em.create(Usuario, {
        nombre: faker.person.firstName(),
        apellido: faker.person.lastName(),
        mail: faker.internet.email(),
        telefono: faker.phone.number(),
        contrasena:
          '$2b$10$0E9iYMk1AvFZNbpfu0yroOGq2/X8NzjWQjQv4cGAiS0dJsaRCh9oG',
        tipoDoc: 'CUIT',
        direccion: faker.location.streetAddress(),
        stripeAccountId: 'acct_1S6XGYCuyV9w7dLC' + i,

        numeroDoc: faker.number
          .int({ min: 20000000000, max: 30000000000 })
          .toString(),
        foto: 'https://backend-patient-morning-1303.fly.dev/uploads/profiles/default-avatar.webp',
        nombreFantasia: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        estado: 'activo',
        zonas: faker.helpers.arrayElements(zonas, 3),
      });
    }

    // Prestatarios inactivos
    for (let i = 0; i < 10; i++) {
      em.create(Usuario, {
        nombre: faker.person.firstName(),
        apellido: faker.person.lastName(),
        mail: faker.internet.email(),
        telefono: faker.phone.number(),
        contrasena:
          '$2b$10$0E9iYMk1AvFZNbpfu0yroOGq2/X8NzjWQjQv4cGAiS0dJsaRCh9oG',
        tipoDoc: 'CUIT',
        direccion: faker.location.streetAddress(),
        numeroDoc: faker.number
          .int({ min: 20000000000, max: 30000000000 })
          .toString(),
        foto: 'https://backend-patient-morning-1303.fly.dev/uploads/profiles/default-avatar.webp',
        nombreFantasia: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        estado: 'inactivo',
        zonas: faker.helpers.arrayElements(zonas, 3),
      });
    }

    console.log('🔍 UsuarioSeeder: Antes de flush()');
    await em.flush();
    console.log('✅ UsuarioSeeder: Datos persistidos correctamente');
  }
}
