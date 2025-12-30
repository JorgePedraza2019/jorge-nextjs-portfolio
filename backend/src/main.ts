import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InternalAuthGuard } from './guards/internal-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.BACKEND_PORT) || 0;

  // 🔐 Guard global (Bearer interno)
  app.useGlobalGuards(new InternalAuthGuard());

  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server or same-origin requests (e.g. Docker network)
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:4000',
        'http://127.0.0.1:4000',
        'https://127.0.0.1:4000',
        'http://127.0.0.1:443',
        'https://127.0.0.1:443',
        'https://dev.jorgeportfolio.local',
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'https://qa.jorgeportfolio.local',
        'http://localhost:443',
        'https://jorgeportfolio.local',
        'https://dev.jorgeportfolio.com',
        'https://qa.jorgeportfolio.com',
        'https://jorgeportfolio.com',
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Jorge Portfolio API')
    .setDescription('API para el portafolio de Jorge')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
