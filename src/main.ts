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
    origin: true, // Barcha origin'lar uchun ochiq (development uchun ideal)
    credentials: true, // Cookie'lar uchun majburiy
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // OPTIONS qo'shdim, preflight so'rovlar uchun
    allowedHeaders: "Content-Type, Authorization, Cookie", // Cookie header'ini qo'shdim, agar kerak bo'lsa
  });

  const config = new DocumentBuilder()
    .setTitle("REstourant API hizmatlari")
    .setDescription("restoram analizi uchun api lar jamlanmasi")
    .setVersion("1.0")
    .addCookieAuth("token", {
      type: "apiKey",
      in: "cookie",
      name: "token",
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document); // URL: /api/docs

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
