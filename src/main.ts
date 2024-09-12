import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger api document settings
  const builder = new DocumentBuilder()
    .setTitle('TODO API')
    .setDescription('Futtler Todo app API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      // DTO 등에 기본값 설정을 가능하게 해주는 옵션
      transform: true,
      // DTO에 적용되지 않은 인자는 모두 제거 하는 옵션
      whitelist: true,
      transformOptions: {
        // transform이 이루어 질때 validator 설정된 값에 맞춰서 변경 할 수 있도록 설정
        // validator에 IsString 외의 형식을 (IsNumber, IsBoolean 등으로 설정 후) querystring, body 등으로 전달되는 값을
        // 자동으로 해당 type으로 변경 해준다.
        enableImplicitConversion: true,
      },
      // forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();
