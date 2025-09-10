import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import path from 'node:path';
import dotenv from 'dotenv';

// cargar .env
dotenv.config();

const BASE_DIR = __dirname; // Ya estamos en dist/

const config: Options<MySqlDriver> = {
  dbName:
    process.env.LOCAL === 'true' ? 'homeservice' : 'u797556926_homeService',
  clientUrl:
    process.env.LOCAL === 'true'
      ? 'mysql://root:root@localhost:3306/homeservice'
      : 'mysql://u797556926_reformix:LUISluis123!@srv2023.hstgr.io:3306/u797556926_homeService',
  entities: [path.join(BASE_DIR, '**/*.entity.js')],
  entitiesTs: [path.join(__dirname, '../src/**/*.entity.ts')], // Para desarrollo
  debug: process.env.LOCAL === 'true',
  seeder: {
    path: path.join(BASE_DIR, 'seeders'), // Buscará en dist/seeders
    pathTs: path.join(__dirname, '../src/seeders'), // Para desarrollo en TypeScript
    defaultSeeder: 'DatabaseSeeder',
  },
};

export default config;
