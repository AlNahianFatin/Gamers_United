import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { MulterExceptionFilter } from './MulterExceptionFilter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: String(process.env.SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false
      }
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new MulterExceptionFilter());

  app.use(cookieParser());

  //   app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     exceptionFactory: (errors) => {
  //       return new BadRequestException(
  //         errors.map(err => ({
  //           field: err.property,
  //           messages: Object.values(err.constraints ?? {}),
  //         })),
  //       );
  //     },
  //   }),
  // );

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();