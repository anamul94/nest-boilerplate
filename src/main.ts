import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1/');

  //swagger config start
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Boilerplate')
    .setDescription('Nest Boilerplate')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  //swagger config end

  const PORT = parseInt(process.env.PORT) || 8080;
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}
bootstrap();
