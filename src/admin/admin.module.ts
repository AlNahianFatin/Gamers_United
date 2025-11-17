import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginEntity } from './Entity/login.entity';
import { AdminEntity } from './Entity/admin.entity';
import { PlayerEntity } from './Entity/player.entity';
import { DeveloperEntity } from './Entity/developer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), TypeOrmModule.forFeature([LoginEntity]), TypeOrmModule.forFeature([PlayerEntity]), TypeOrmModule.forFeature([DeveloperEntity])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
