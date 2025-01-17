import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  //Iniciamos la aplicacion
  const app = await NestFactory.create(AppModule);

  //Habilitamos CORS
  app.enableCors();

  //Obtenemos la configuracion del servidor
  //ConfigService sirve para las variables de entorno
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 8080;

  //prefijo "api"
  app.setGlobalPrefix('api');

  //Habilitamos el validador de datos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Iniciamos el servidor
  await app.listen(port);
  console.log(`Servidor corriendo en el puerto ${port}`);
}
bootstrap();
