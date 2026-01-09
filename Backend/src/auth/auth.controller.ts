import { Controller, Post, Body, UseGuards, Get, Req, UsePipes, ValidationPipe, Res, Session, UseInterceptors, UploadedFile, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from '../dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SessionGuard } from 'src/session.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import path from 'path';
import { plainToInstance } from 'class-transformer';
import { PlayerDTO } from 'src/dto/player.dto';
import { PlayerEntity } from 'src/entities/player.entity';
import { validateOrReject, ValidationError } from 'class-validator';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Session() session, @Body(new ValidationPipe({ transform: true, whitelist: true })) Login: LoginDTO): Promise<Object> {
    try {
      return await this.authService.login(session, Login);
    }
    catch (error) { console.error("LOGIN ERROR:", error.response || error.message || error); throw error };
  }

  @Post('logout')
  async logout(@Session() session, @Req() req, @Res() res): Promise<any> {
    const authHeader = req.headers?.authorization ?? '';
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    try { return await res.json(await this.authService.logout(session, token, res)); }
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
      if (image.originalname.match(/^.*\.(jpg|webp|png|jpeg|png)$/))
        cb(null, true);
      else
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    },
    limits: { fileSize: 2097152 },
    storage: diskStorage({
      destination: 'uploads/users/player',
      filename: function (req, image, cb) {
        cb(null, Date.now() + path.extname(image.originalname));
      },
    })
  }))
  @UsePipes(new ValidationPipe())
  async signup(@UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe({ transform: true })) body: any): Promise<PlayerEntity> {
    const playerDto = plainToInstance(PlayerDTO, {
      username: body.username,
      email: body.email,
      phone: body.phone,
      NID: body.NID
    });

    const salt = await bcrypt.genSalt();
    const hashedpass = await bcrypt.hash(body.password, salt);

    const loginDto = plainToInstance(LoginDTO, {
      username: body.username,
      password: hashedpass,
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
      throw new BadRequestException(formattedErrors);
    }

    if (file)
      playerDto.image = file.filename;
    try { return await this.authService.signup(playerDto, loginDto); }
    catch (error) {
      if (error instanceof MulterError)
        throw new BadRequestException([{ field: 'image', messages: [error.message] }]);
      throw error;
    }
  }
}
