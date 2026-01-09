import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LoginEntity } from '../entities/login.entity';
import { PlayerEntity } from 'src/entities/player.entity';
import { AdminEntity } from 'src/entities/admin.entity';
import { DeveloperEntity } from 'src/entities/developer.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: String(process.env.JWT_SECRET),  
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([LoginEntity]),
    TypeOrmModule.forFeature([AdminEntity]),
    TypeOrmModule.forFeature([DeveloperEntity]),
    TypeOrmModule.forFeature([PlayerEntity]),
    ConfigModule.forRoot({
        isGlobal: true,
      }),
    MailerModule.forRoot({
                  transport: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    ignoreTLS: true,
                    secure: true,
                    auth: { 
                      user: process.env.ADMIN_Email,
                      pass: process.env.ADMIN_Email_Pass
                    }
    }})
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}