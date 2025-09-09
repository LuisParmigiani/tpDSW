import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Cargar .env solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, './../../../../.env') });
}

console.log('process.env.LOCAL:', process.env.LOCAL);
const local = process.env.LOCAL === 'true';

const DB_URL = local
  ? 'mysql://root:root@localhost:3306/homeservice'
  : 'mysql://u797556926_reformix:LUISluis123!@srv2023.hstgr.io:3306/u797556926_homeService';

console.log('DB_URL:', DB_URL);
const DEBUG = local ? true : process.env.DEBUG_SQL === '1';

const orm = await MikroORM.init({
  driver: MySqlDriver,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: DB_URL,
  highlighter: new SqlHighlighter(),
  debug: DEBUG,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  //  await generator.dropSchema();

  // await generator.createSchema();
  // await generator.updateSchema(); // Desactivado para producción: evita cambios automáticos en el esquema

  //Lineas para borrar y crear la base de datos
  //await generator.dropSchema();
  //await generator.createSchema();

  // await generator.updateSchema();
};

export { orm };
