import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`Application running on port ${port} in ${env} mode`);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
