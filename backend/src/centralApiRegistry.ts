import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import fs from 'fs/promises';
import path from 'path';

// Import all your individual registries
import { usuarioRegistry } from './usuario/usuario.registry.js';
//import { servicioRegistry } from './servicio/servicio.registry.js'; // example
//import { reservaRegistry } from './reserva/reserva.registry.js'; // example
// ... import other registries

async function generateOpenApiDocument() {
  // Create main registry
  const registry = new OpenAPIRegistry();

  // Register security schemes
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  // Get definitions from all registries and register them in the main registry
  const allRegistries = [
    usuarioRegistry,
    // servicioRegistry,
    // reservaRegistry,
    // ... other registries
  ];

  // Combine all definitions from individual registries
  allRegistries.forEach((individualRegistry) => {
    // Get all definitions from the individual registry
    const definitions = individualRegistry.definitions;

    // Add each definition to the main registry's definitions array
    definitions.forEach((definition) => {
      registry.definitions.push(definition);
    });
  });

  const generator = new OpenApiGeneratorV3(usuarioRegistry.definitions);

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
        name: 'Reservas',
        description: 'Operaciones para el manejo re Reservas',
      },
      {
        name: 'Autenticación',
        description: 'Operaciones relacionadas autenticación y autorización',
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

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOpenApiDocument();
}
export { generateOpenApiDocument };
