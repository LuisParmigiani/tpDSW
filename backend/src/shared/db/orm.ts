import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const local = false;
const DB_URL = local
  ? 'mysql://root:root@localhost:3306/homeService'
  : 'mysql://u797556926_reformix:LUISluis123!@srv2023.hstgr.io:3306/u797556926_homeService';
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
  // await generator.updateSchema(); // Desactivado para producción: evita cambios automáticos en el esquema
};

export { orm };
