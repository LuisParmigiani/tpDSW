import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const orm = await MikroORM.init({
  driver: MySqlDriver, // <--- AGREGA ESTA LÍNEA
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'homeService',
  clientUrl: 'mysql://root:root@localhost:3306/homeService',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();

  //Lineas para borrar y crear la base de datos
  await generator.dropSchema();
  await generator.createSchema();

  //await generator.updateSchema();
};

export { orm };
