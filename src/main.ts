import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("REstourant API hizmatlari") // sarlavha
    .setDescription("restoram analizi uchun api lar jamlanmasi") // tavsif
    .setVersion("1.0") // versiya
    .addBearerAuth() // JWT uchun authentication qo‘shish
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document); // URL: /api/docs

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
