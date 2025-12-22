import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from '../dto/login.dto';
import { Repository } from 'typeorm';
import { LoginEntity } from 'src/entities/login.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerDTO } from 'src/dto/player.dto';
import { PlayerEntity } from 'src/entities/player.entity';
import { AdminEntity } from 'src/entities/admin.entity';
import { DeveloperEntity } from 'src/entities/developer.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
              private mailerService: MailerService,
              @InjectRepository(LoginEntity) private loginRepository: Repository<LoginEntity>,
              @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
              @InjectRepository(DeveloperEntity) private developerRepository: Repository<DeveloperEntity>,
              @InjectRepository(PlayerEntity) private playerRepository: Repository<PlayerEntity>) {}

  private revokedTokens = new Set<string>();

  async login(session, login: LoginDTO): Promise<object> {
    const userExists = await this.loginRepository.findOne({where: { username: login.username }});
    if(!userExists)
      throw new HttpException(`User '${login.username}' does not exist! Please check your username again`, HttpStatus.NOT_FOUND);
    
    const isMatch = await bcrypt.compare(login.password, userExists.password);
    if(!isMatch)
      throw new HttpException('Password does not match! Please check your password again', HttpStatus.BAD_REQUEST);

    if(!userExists.activation){
      const id = userExists.id;
      await this.loginRepository.update({ id }, { activation: true });
    }
    if(userExists.ban)
      throw new HttpException('Your account is currently banned! Contact with authority for further details', HttpStatus.UNAUTHORIZED);

    session.user = { id: userExists.id, role: userExists.role };

    const payload = { id: userExists.id, role: userExists.role };

    var email;
    if(userExists.role === "admin") {
      const admin = await this.adminRepository.findOne({where: { id: userExists.id }});
      email = admin?.email;
    }
    if(userExists.role === "developer") {
      const developer = await this.developerRepository.findOne({where: { id: userExists.id }});
      email = developer?.email;
    }
    if(userExists.role === "player") {
      const player = await this.playerRepository.findOne({where: { id: userExists.id }});
      email = player?.email;
    }

    const mailed = await this.mailerService.sendMail({
      to: email,
      subject: 'Account logged in',
      text: `Your account '${userExists.username}' has been logged into Gamers United. If this wasn't you, try resetting your password or contact admin_gamersunited@gmail.com`
    });
    if(!mailed)
      throw new HttpException('Email could not be verified. Please recheck your email', HttpStatus.BAD_REQUEST);

    return { message: "Login Successful!", accessToken: this.jwtService.sign(payload), userExists };
  }
  
  isTokenRevoked(token?: string): boolean {
    if (!token) 
      return false;
    return this.revokedTokens.has(token);
  }

  async logout(session?, token?: string, res?): Promise<object> {
    if (!session?.user) 
      throw new HttpException('You are not currently logged in', HttpStatus.BAD_REQUEST);

    if (!token) 
      throw new HttpException('JWT Token missing', HttpStatus.BAD_REQUEST);

    if (this.isTokenRevoked(token)) 
      throw new HttpException('JWT Token already revoked', HttpStatus.BAD_REQUEST);
    
    const isDestroyed: Boolean = await res.clearCookie('connect.sid');
    if(!isDestroyed)
      throw new HttpException('Cookie deletion failed. Please try again later', HttpStatus.INTERNAL_SERVER_ERROR);
    await session.destroy((err) => {
      if (err) 
        throw new HttpException('Session deletion failed. Please try again later', HttpStatus.INTERNAL_SERVER_ERROR);
    });
  
    if(!this.revokedTokens.add(token))
      throw new HttpException('JWT token deletion failed. Please try again later', HttpStatus.INTERNAL_SERVER_ERROR);

    return { message: 'Logged out successfully' };
  }

  async signup(playerDto: PlayerDTO, loginDto: LoginDTO): Promise<PlayerEntity> {
    const playerExists = await this.playerRepository.findOneBy({ username: playerDto.username });
    const loginExists = await this.loginRepository.findOneBy({ username: loginDto.username });
    if (playerExists || loginExists) 
      throw new HttpException(`User with username '${playerDto.username}' already exists`, HttpStatus.NOT_ACCEPTABLE);
    loginDto.role = "player";
    const login = this.loginRepository.create(loginDto);
    const savedLogin = await this.loginRepository.save(login);

    try{ await this.mailerService.sendMail({
        to: playerDto.email,
        subject: 'Sign up complete',
        text: `You have successfully signed up for Gamers United with account '${playerDto.username}'. Welcome to the community.`
      });
    }
    catch(error){throw new HttpException('Email could not be verified. Please recheck your email', HttpStatus.BAD_REQUEST);}
      
    const player = this.playerRepository.create({...playerDto,
      login: savedLogin,
      id: savedLogin.id      
    });
    const savedPlayer = await this.playerRepository.save(player);
    return savedPlayer;
  }
}