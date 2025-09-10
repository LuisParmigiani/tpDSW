import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@mikro-orm/mysql';
import dotenv from 'dotenv';

// cargar .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = defineConfig({
  dbName:
    process.env.LOCAL === 'true' ? 'homeservice' : 'u797556926_homeService',
  clientUrl:
    process.env.LOCAL === 'true'
      ? 'mysql://root:root@localhost:3306/homeservice'
      : 'mysql://u797556926_reformix:LUISluis123!@srv2023.hstgr.io:3306/u797556926_homeService',
  entities: ['dist/**/*.entity.js'],
  debug: process.env.LOCAL === 'true',
  seeder: {
    path: 'dist/seenders',
    defaultSeeder: 'DatabaseSeeder',
  },
});

export default config;
