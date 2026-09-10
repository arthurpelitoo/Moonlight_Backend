import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Moonlight_Backend_API',
    description: 'Documentação automática de todas as rotas',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routesFiles = ['./src/servers/server.ts'];

// Instancia e executa a função
swaggerAutogen()(outputFile, routesFiles, doc);
