import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const DB_URL =
  process.env.DATABASE_URL || 'mysql://root:root@localhost:3306/homeService';
const DEBUG = process.env.DEBUG_SQL === '1';

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
  // await generator.updateSchema(); // Desactivado para producción: evita cambios automáticos en el esquema
};

export { orm };
