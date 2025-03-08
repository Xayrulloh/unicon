import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GLOBAL_PREFIX } from './utils/constants';
import SwaggerBuilder from './config/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 8080;

  app.setGlobalPrefix(GLOBAL_PREFIX);

  // class-validator
  app.useGlobalPipes(new ValidationPipe());

  // swagger
  SwaggerBuilder.make(app);

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`,
  );
}

void bootstrap();
