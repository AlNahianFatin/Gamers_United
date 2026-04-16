import { Controller, Post, Body, UseGuards, Get, Req, UsePipes, ValidationPipe, Request, Res, Session, UseInterceptors, UploadedFile, HttpException, HttpStatus, BadRequestException, Param, Patch, UseFilters, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from '../dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import path from 'path';
import { plainToInstance } from 'class-transformer';
import { PlayerDTO } from '../dto/player.dto';
import { PlayerEntity } from '../entities/player.entity';
import { validateOrReject, ValidationError } from 'class-validator';
import { LoginRequestDTO } from '../dto/loginRequest.dto';
import * as fs from 'fs';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Session() session, @Body() Login: LoginRequestDTO, @Res({ passthrough: true }) res): Promise<Object> {
    try { return await this.authService.login(session, Login, res); }
    catch (error) { throw error };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Session() session, @Req() req, @Res({ passthrough: true }) res): Promise<any> {
    try { return await this.authService.logout(session, res); }
    catch (error) { throw error; }
  }

  @Post('forgotpass')
  async forgotpass(@Body() body: { email: string }): Promise<any> {
    try { return await this.authService.forgotpass(body.email); }
    catch (error) { throw error; }
  }

  @Post('verifyotp')
  async verifyOtp(@Body() body: { email: string; otp: string }): Promise<any> {
    try { return this.authService.verifyOtp(body.email, body.otp); }
    catch (error) { throw error; }
  }

  @Patch('resetpass')
  async resetPass(@Body() body: { email: string; newPass: string, oldPass: string }): Promise<any> {
    const salt = await bcrypt.genSalt();
    const hashedNewPass = await bcrypt.hash(body.newPass, salt);
    const hashedOldPass = await bcrypt.hash(body.oldPass, salt);

    if (hashedNewPass !== hashedOldPass)
      throw new HttpException({ message: [{ field: 'rPassword', messages: [`Passwords do not match! Recheck your password`] }] }, HttpStatus.NOT_FOUND);
    try { return this.authService.resetPass(body.email, hashedNewPass); }
    catch (error) { throw error; }
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Req() req) {
  //   return req.user; 
  // }

  @Post('signup')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, image, cb) => {
      if (image.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
        cb(null, true);
      else
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
    storage: diskStorage({
      destination: 'uploads/users/player',
      filename: function (req, image, cb) {
        cb(null, Date.now() + path.extname(image.originalname));
      },
    })
  }))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async signup(@UploadedFile() file: Express.Multer.File, @Body() body: any): Promise<PlayerEntity> {
    const playerDto = plainToInstance(PlayerDTO, {
      username: body.username,
      phone: body.phone,
      NID: body.NID
    });

    const salt = await bcrypt.genSalt();
    const hashedpass = await bcrypt.hash(body.password, salt);

    const loginDto = plainToInstance(LoginDTO, {
      username: body.username,
      password: hashedpass,
      email: body.email,
      role: body.role,
      activation: body.activation,
      ban: body.ban
    });

    try {
      await validateOrReject(playerDto, { whitelist: true });
      await validateOrReject(loginDto, { whitelist: true });
    }
    catch (errors) {
      const formattedErrors = (errors as ValidationError[]).map(err => ({
        field: err.property,
        messages: Object.values(err.constraints ?? {}),
      }));
      throw new BadRequestException({ message: formattedErrors });
    }

    if (file)
      playerDto.image = file.filename;
    try { return await this.authService.signup(playerDto, loginDto); }
    catch (error) {
      throw error;
    }
  }


  @Get('getGames')
  async getGames() {
    try { return await this.authService.getGames(); }
    catch (error) { throw error; }
  }

  @Get('getFiveBestsellerGames')
  async getFiveBestsellerGames() {
    try { return await this.authService.getFiveBestsellerGames(); }
    catch (error) { throw error; }
  }

  // @Get('getBestsellerGames')
  // async getBestsellerGames() {
  //   try { return await this.authService.getBestsellerGames(); }
  //   catch (error) { throw error; }
  // }

  @Get('getBestsellerGames')
  async getBestsellerGames(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.authService.getBestsellerGames(page, limit);
  }

  @Get('getFullGameByID/:gameID')
  async getFullGameByID(@Param('gameID') gameID: number) {
    try { return await this.authService.getFullGameByID(gameID); }
    catch (error) { throw error; }
  }

  @Get('getGamePicByID/:gameID')
  async getGamePicByID(@Param('gameID') gameID: number, @Res() res) {
    try { return await this.authService.getGamePicByID(gameID, res); }
    catch (error) { throw error; }
  }

  @Get('getGameTrailerByID/:gameID')
  async getGameTrailerByID(@Param('gameID') gameID: number, @Res() res) {
    try { return await this.authService.getGameTrailerByID(gameID, res); }
    catch (error) { throw error; }
  }
}