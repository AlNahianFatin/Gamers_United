import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import{ MailerModule } from '@nestjs-modules/mailer';
import { LoginEntity } from '../entities/login.entity';
import { AdminEntity } from '../entities/admin.entity';
import { PlayerEntity } from '../entities/player.entity';
import { DeveloperEntity } from '../entities/developer.entity';
import { CategoriesEntity } from '../entities/categories.entity';
import { GamesEntity } from '../entities/games.entity';
import { ConfigModule } from '@nestjs/config';
import { PurchasesEntity } from '../entities/purchases.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoginEntity]), TypeOrmModule.forFeature([AdminEntity]), TypeOrmModule.forFeature([DeveloperEntity]), TypeOrmModule.forFeature([PlayerEntity]),
            TypeOrmModule.forFeature([GamesEntity]), TypeOrmModule.forFeature([CategoriesEntity]), TypeOrmModule.forFeature([PurchasesEntity]),
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
              }
            })
          ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
