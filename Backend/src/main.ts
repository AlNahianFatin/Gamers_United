import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'jjgeAb43#@nFGDmvrhj?WR/frs++=V,G/.>$',
      resave: false,
      saveUninitialized: false,
      cookie:{
        maxAge: 300000,
        httpOnly: true,
        secure: false
      }
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
