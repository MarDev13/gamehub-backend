import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('GameHub API')
    .setDescription('Documentación de la API del proyecto GameHub, incluyendo Auth, Users, Genres y Roles.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const env = process.env.NODE_ENV || 'development';
  const port = Number(process.env.PORT) || 3000;

  if (env === 'development') {
    app.enableCors();
    console.log('CORS enabled for all origins in development mode');
  } else {
    app.enableCors({
      origin: '',
      credentials: true,
    });
    console.log('CORS enabled for specific orgin in production mode');
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),

  );
  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new HttpExceptionFilter(),
  );
  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`Application running on port ${port} in ${env} mode`);

}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
