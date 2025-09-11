import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import fs from 'fs/promises';
import path from 'path';
//* SE importan los registros de los endpoints
import { usuarioRegistry } from './usuario/usuario.registry.js';
import { zonaRegistry } from './zona/zona.registry.js';

async function generateOpenApiDocument() {
  const registry = new OpenAPIRegistry();

  //* Se registran los sistemas de seguridad que se van a usar
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  //* Coleccion final donde van a ir los registros de cada api para que se combinen en uno solo y se documenten
  const allDefinitions = [
    ...registry.definitions, // Esquemas de seguridad
    ...usuarioRegistry.definitions, // Esquemas y definiciones del usuario
    ...zonaRegistry.definitions,
    // ,...servicioRegistry.definitions, // Esquemas y definiciones del servicio
    // ...reservaRegistry.definitions,
  ];

  //Generador con todas las definiciones
  const generator = new OpenApiGeneratorV3(allDefinitions);

  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'HomeService API',
      description: 'Complete API documentation for HomeService platform',
      contact: {
        name: 'API Support',
        email: 'support@homeservice.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',

        description: 'Development server',
      },
      {
        url: 'https://backend-patient-morning-1303.fly.dev/api',
        description: 'Production server',
      },
    ],
    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: 'Usuarios',
        description: 'Operaciones para el manejo de Usuarios',
      },
      {
        name: 'Servicios',
        description: 'Operaciones para el manejo de Servicios',
      },
      {
        name: 'Zonas',
        description: 'Operaciones para el manejo de Zonas',
      },
      {
        name: 'Reservas',
        description: 'Operaciones para el manejo de Reservas',
      },
      {
        name: 'Autenticación',
        description:
          'Operaciones relacionadas con la autenticación y autorización de usuarios',
      },
    ],
  });

  const docsDir = path.join(process.cwd(), 'docs');
  await fs.mkdir(docsDir, { recursive: true });

  // Generate JSON documentation
  await fs.writeFile(
    path.join(docsDir, 'api-documentation.json'),
    JSON.stringify(document, null, 2)
  );

  // Generate YAML documentation
  const yaml = await import('yaml');
  await fs.writeFile(
    path.join(docsDir, 'api-documentation.yaml'),
    yaml.stringify(document)
  );

  console.log('✅ API Documentation generated successfully!');
  console.log('📁 Files created:');
  console.log('   - docs/api-documentation.json');
  console.log('   - docs/api-documentation.yaml');

  return document;
}

// Permite ejecutar la generación del documento si se corre este archivo directamente con Node.js
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOpenApiDocument();
}
export { generateOpenApiDocument };
