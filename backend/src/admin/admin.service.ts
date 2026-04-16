import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { IsNull, Like, MoreThanOrEqual, MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import * as bcrypt from 'bcrypt';
import { promises } from 'fs';
import { LoginDTO } from '../dto/login.dto';
import { CreateAdminDTO } from '../dto/createAdmin.dto';
import { UpdateAdminDTO } from '../dto/updateAdmin.dto';
import { DeveloperDTO } from '../dto/developer.dto';
import { PlayerDTO } from '../dto/player.dto';
import { GamesDTO } from '../dto/games.dto';
import { CategoriesDTO } from '../dto/categories.dto';
import { PurchasesDTO } from '../dto/purchases.dto';
import { ViewsDTO } from '../dto/views.dto';
import { PlaysDTO } from '../dto/plays.dto';
import { LoginEntity } from '../entities/login.entity';
import { AdminEntity } from '../entities/admin.entity';
import { DeveloperEntity } from '../entities/developer.entity';
import { PlayerEntity } from '../entities/player.entity';
import { GamesEntity } from '../entities/games.entity';
import { CategoriesEntity } from '../entities/categories.entity';
import { PurchasesEntity } from '../entities/purchases.entity';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(LoginEntity) private loginRepository: Repository<LoginEntity>,
    @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
    @InjectRepository(DeveloperEntity) private developerRepository: Repository<DeveloperEntity>,
    @InjectRepository(PlayerEntity) private playerRepository: Repository<PlayerEntity>,
    @InjectRepository(GamesEntity) private gamesRepository: Repository<GamesEntity>,
    @InjectRepository(CategoriesEntity) private categoriesRepository: Repository<CategoriesEntity>,
    @InjectRepository(PurchasesEntity) private purchasesRepository: Repository<PurchasesEntity>) { }

  async getAdmins(): Promise<AdminEntity[]> {
    const admins = await this.adminRepository.find({ relations: ['login'] });
    if (!admins || admins.length === 0)
      throw new HttpException('No admin found', HttpStatus.NOT_FOUND);
    return admins;
  }

  async getAdminByID(adminID: number): Promise<AdminEntity> {
    const exists = await this.adminRepository.findOne({ where: { id: adminID }, relations: ['login'] });
    if (!exists)
      throw new HttpException({ message: [{ field: 'id', messages: [`Admin with id ${adminID} does not exist`] }] }, HttpStatus.NOT_FOUND);
    else
      return exists;
  }

  async getAdminPicByID(adminID: number, @Res() res): Promise<any> {
    const admin = await this.adminRepository.findOne({ where: { id: adminID }, select: { image: true } });
    if (!admin || !admin.image)
      throw new HttpException({ message: [{ field: 'image', messages: [`Admin image not found`] }] }, HttpStatus.NOT_FOUND);
    return res.sendFile(admin.image, { root: './uploads/users/admin' })
  }

  async getAdminsByNullName(): Promise<object | AdminEntity[]> {
    const admins = await this.adminRepository.find({ where: [{ username: IsNull() }, { username: "" }, { username: " " }], relations: ['login'] });
    if (admins.length === 0)
      throw new HttpException({ message: [{ field: 'username', messages: [`No admin with null username has been found`] }] }, HttpStatus.NOT_FOUND);
    return admins;
  }

  async addAdmin(adminDto: CreateAdminDTO, loginDto: LoginDTO): Promise<AdminEntity> {
    const adminExists = await this.adminRepository.findOneBy({ username: adminDto.username });
    const emailExists = await this.loginRepository.findOneBy({ email: loginDto.email });
    const loginExists = await this.loginRepository.findOneBy({ username: loginDto.username });
    if (adminExists || loginExists)
      throw new HttpException({ message: [{ field: 'username', messages: [`User with username ${adminDto.username} already exists`] }] }, HttpStatus.NOT_ACCEPTABLE);
    else if (emailExists)
      throw new HttpException({ message: [{ field: 'email', messages: [`User with email ${loginDto.email} already exists`] }] }, HttpStatus.NOT_ACCEPTABLE);
    else {
      loginDto.role = "admin";
      const login = this.loginRepository.create(loginDto);
      const savedLogin = await this.loginRepository.save(login);

      const admin = this.adminRepository.create({
        ...adminDto,
        login: savedLogin,
        id: savedLogin.id,
      });
      const savedAdmin = await this.adminRepository.save(admin);
      return savedAdmin;
    }
  }

  async updateAdminPhoneById(id: any, newPhone: any): Promise<AdminEntity | null> {
    if (!Number(id))
      throw new HttpException({ message: [{ field: 'id', messages: [`Please enter a valid ID number`] }] }, HttpStatus.NOT_ACCEPTABLE);
    id = Number(id)

    const exists = await this.adminRepository.findOneBy({ id });
    if (!exists)
      throw new HttpException({ message: [{ field: 'id', messages: [`Admin with id ${id} not found!`] }] }, HttpStatus.NOT_FOUND);
    else {
      if (!Number(newPhone))
        throw new HttpException({ message: [{ field: 'phone', messages: [`Please enter a valid Phone No.`] }] }, HttpStatus.NOT_ACCEPTABLE);
      if (newPhone.length !== 11)
        throw new HttpException({ message: [{ field: 'phone', messages: [`Phone No. must be a valid format of 11 digits`] }] }, HttpStatus.NOT_ACCEPTABLE);
      await this.adminRepository.update({ id }, { phone: newPhone });
      return await this.adminRepository.findOneBy({ id: id });
    }
  }

  async updateFullAdmin(id: number, password: string, adminDto: UpdateAdminDTO, loginDto: LoginDTO): Promise<AdminEntity | null> {
    const exists = await this.adminRepository.findOne({ where: { id }, relations: ['login'] });
    if (!exists)
      throw new HttpException({ message: [{ field: 'id', messages: [`Admin with id ${id} not found!`] }] }, HttpStatus.NOT_FOUND);
    else {
      const adminExists = await this.adminRepository.findOne({ where: { username: adminDto.username, id: Not(id) } });
      const loginExists = await this.loginRepository.findOne({ where: { username: loginDto.username, id: Not(exists.login.id) } });
      if (adminExists || loginExists)
        throw new HttpException({ message: [{ field: 'username', messages: [`User with username '${adminDto.username}' already exists`] }] }, HttpStatus.NOT_ACCEPTABLE);
      else {
        if (!password)
          throw new HttpException({ message: [{ field: 'password', messages: ['Password is required'] }] }, HttpStatus.BAD_REQUEST);

        const isMatch = await bcrypt.compare(password, exists.login.password);
        if (!isMatch)
          throw new HttpException({ message: [{ field: 'password', messages: [`Incorrect password`] }] }, HttpStatus.BAD_REQUEST);

        await this.adminRepository.update({ id }, {
          username: adminDto.username ?? exists.username,
          image: adminDto.image ?? exists.image,
          phone: adminDto.phone ?? exists.phone,
          NID: adminDto.NID ?? exists.NID
        });

        loginDto.ban = String(loginDto.ban) === "true";
        loginDto.activation = String(loginDto.activation) === "true";
        if (loginDto.ban)
          loginDto.activation = false;
        if (loginDto.activation)
          loginDto.ban = false;
        loginDto.role = "admin";
        await this.loginRepository.update({ id: exists.login.id }, {
          username: loginDto.username ?? exists.login.username,
          // password: loginDto.password || exists.login.password,
          email: loginDto.email ?? exists.login.email,
          role: loginDto.role ?? exists.login.role,
          activation: loginDto.activation ?? exists.login.activation,
          ban: loginDto.ban ?? exists.login.ban
        });
        const updatedAdmin = await this.adminRepository.findOne({ where: { id }, relations: ['login'] });
        return updatedAdmin;
      }
    }
  }

  async removeAdmin(id: number): Promise<object> {
    const admin = await this.adminRepository.findOneBy({ id: id });
    if (!admin)
      throw new HttpException({ message: [{ field: 'id', messages: [`Admin with id ${id} not found!`] }] }, HttpStatus.NOT_FOUND);
    else {
      if (admin.image) {
        const filePath = path.join('uploads/users/admin', admin.image);
        try {
          await promises.access(filePath);
          await promises.unlink(filePath);
        }
        catch (err) {
          throw new HttpException({ message: [{ field: 'image', messages: [`Profile image file not found or already deleted: ${filePath}`] }] }, HttpStatus.NOT_FOUND);
        }
      }
      await this.loginRepository.delete(id);
      return { message: `Admin with id ${id} has been deleted` };
    }
  }

  //lab performance
  async removeAdminByEmail(email: string): Promise<object> {
    const login = await this.loginRepository.find({ where: { email }, relations: ['login'] });
    if (!login || login.length < 1)
      throw new HttpException({ message: [{ field: 'email', messages: [`No admins found with email ${email}!`] }] }, HttpStatus.NOT_FOUND);
    for (const admin of login) {
      if (admin.admin.image) {
        const filePath = path.join('uploads/users/admin', admin.admin.image);
        try {
          await promises.access(filePath);
          await promises.unlink(filePath);
        }
        catch (err) {
          throw new HttpException({ message: [{ field: 'image', messages: [`Profile image not found or already deleted: ${filePath}`] }] }, HttpStatus.NOT_FOUND);
        }
      }
    }
    const loginIds = login.filter(admin => admin.admin).map(admin => admin.admin.id);
    if (loginIds.length > 0)
      await this.loginRepository.delete(loginIds);
    return { message: `Admin with email ${email} has been deleted` };
  }

  async searchAdmin(key: any): Promise<object> {
    let admins: object[] = [];
    if (!isNaN(Number(key)))
      // admins = await this.adminRepository.find({ where: { id: Number(key) }, relations: ['login'] })
      admins = await this.adminRepository.createQueryBuilder('admin').leftJoinAndSelect('admin.login', 'login').where('admin.id LIKE :key', { key: `%${key}%` })
        .orWhere('admin.phone LIKE :key', { key: `%${key}%` }).getMany();
    if (admins.length === 0) {
      // admins = await this.adminRepository.find({ where: [{ username: Like(`%${key}%`) }, { NID: Like(`%${key}%`) }, { phone: Like(`%${key}%`) }] });
      // admins.push(await this.loginRepository.find({ where: [{ email: Like(`%${key}%`) }] }));
      admins = await this.adminRepository.createQueryBuilder('admin').leftJoinAndSelect('admin.login', 'login').where('admin.username LIKE :key', { key: `%${key}%` })
        .orWhere('admin.NID LIKE :key', { key: `%${key}%` })
        .orWhere('login.email LIKE :key', { key: `%${key}%` })
        .getMany();
    }

    if (admins.length === 0)
      throw new HttpException({ message: [{ field: 'id', messages: [`No admin found! Try searching with another key`] }] }, HttpStatus.NOT_FOUND);
    return admins;
  }

  async sortAdminByIDAsc(): Promise<object> {
    const admins = await this.adminRepository.find({ order: { id: 'ASC' } });
    if (!admins || admins.length < 0)
      throw new HttpException({ message: [{ field: 'id', messages: [`No admin found!`] }] }, HttpStatus.NOT_FOUND);
    return admins;
  }

  async sortAdminByIDDesc(): Promise<object> {
    const admins = await this.adminRepository.find({ order: { id: 'DESC' } });
    if (!admins || admins.length < 0)
      throw new HttpException({ message: [{ field: 'id', messages: [`No admin found!`] }] }, HttpStatus.NOT_FOUND);
    return admins;
  }

  async sortAdminByNameAsc(): Promise<object> {
    const admins = await this.adminRepository.find({ order: { username: 'ASC' } });
    if (!admins || admins.length < 0)
      throw new HttpException({ message: [{ field: 'username', messages: [`No admin found!`] }] }, HttpStatus.NOT_FOUND);
    return admins;
  }

  async sortAdminByNameDesc(): Promise<object> {
    const admins = await this.adminRepository.find({ order: { username: 'DESC' } });
    if (!admins || admins.length < 0)
      throw new HttpException({ message: [{ field: 'username', messages: [`No admin found!`] }] }, HttpStatus.NOT_FOUND);
    return admins;
  }


  async getPlayers(): Promise<PlayerEntity[]> {
    const players = await this.playerRepository.find({ relations: ['login'] });
    if (!players || players.length < 0)
      throw new HttpException(`No player found`, HttpStatus.NOT_FOUND);
    return players;
  }

  async getNoOfActivePlayers(): Promise<number> {
    const total = await this.loginRepository.count({ where: { role: "player", activation: true, ban: false } });
    return total;
  }

  async getPlayerByID(playerID: number): Promise<PlayerEntity> {
    const exists = await this.playerRepository.findOne({ where: { id: playerID } });
    if (!exists)
      throw new HttpException(`Player with id ${playerID} does not exist`, HttpStatus.NOT_FOUND);
    else
      return exists;
  }

  async getPlayerPicByID(playerID: number, @Res() res): Promise<any> {
    const player = await this.playerRepository.findOne({ where: { id: playerID }, select: { image: true } });
    if (!player || !player.image)
      throw new HttpException(`Player image not found`, HttpStatus.NOT_FOUND);
    return res.sendFile(player.image, { root: './uploads/users/player' })
  }

  async getPlayersByNullName(): Promise<object | PlayerEntity[]> {
    const players = await this.playerRepository.find({ where: [{ username: IsNull() }, { username: "" }, { username: " " }], relations: ['login'] });
    if (players.length === 0)
      throw new HttpException(`No player with null username has been found`, HttpStatus.NOT_FOUND);
    return players;
  }

  async addPlayer(playerDto: PlayerDTO, loginDto: LoginDTO): Promise<PlayerEntity> {
    const playerExists = await this.playerRepository.findOneBy({ username: playerDto.username });
    const loginExists = await this.loginRepository.findOneBy({ username: loginDto.username });
    if (playerExists || loginExists)
      throw new HttpException(`User with username ${playerDto.username} already exists`, HttpStatus.NOT_ACCEPTABLE);
    else {
      loginDto.role = "player";
      const login = this.loginRepository.create(loginDto);
      const savedLogin = await this.loginRepository.save(login);

      const player = this.playerRepository.create({
        ...playerDto,
        login: savedLogin,
        id: savedLogin.id
      });
      const savedPlayer = await this.playerRepository.save(player);
      return savedPlayer;
    }
  }

  async updatePlayerPhoneByID(id: any, newPhone: any): Promise<PlayerEntity | null> {
    if (!Number(id))
      throw new HttpException(`Please enter a valid ID number`, HttpStatus.NOT_ACCEPTABLE);
    id = Number(id)

    const exists = await this.playerRepository.findOneBy({ id });
    if (!exists)
      throw new HttpException(`Player with id ${id} not found!`, HttpStatus.NOT_FOUND);
    else {
      if (!Number(newPhone))
        throw new HttpException("Please enter a valid Phone No.", HttpStatus.NOT_ACCEPTABLE);
      if (newPhone.length !== 11)
        throw new HttpException('Phone No. must be a valid format of 11 digits', HttpStatus.NOT_ACCEPTABLE);

      await this.playerRepository.update({ id }, { phone: newPhone });
      return await this.playerRepository.findOneBy({ id: id });
    }
  }

  async updateFullPlayer(id: number, playerDto: PlayerDTO, loginDto: LoginDTO): Promise<PlayerEntity | null> {
    const exists = await this.playerRepository.findOne({ where: { id }, relations: ['login'] });
    if (!exists)
      throw new HttpException(`Player with id ${id} not found!`, HttpStatus.NOT_FOUND);
    else {
      const playerExists = await this.playerRepository.findOne({ where: { username: playerDto.username, id: Not(id) } });
      const loginExists = await this.loginRepository.findOne({ where: { username: loginDto.username, id: Not(id) } });
      if (playerExists || loginExists)
        throw new HttpException(`User with username ${playerDto.username} already exists`, HttpStatus.NOT_ACCEPTABLE);
      else {
        exists.username = playerDto.username?.trim() ? playerDto.username : exists.username;
        exists.image = playerDto.image || exists.image;
        exists.phone = playerDto.phone || exists.phone;
        exists.NID = playerDto.NID || exists.NID;

        const newGameIds = playerDto.game_ids ?? [];
        const oldGameIds = exists.game_ids ?? [];

        exists.game_ids = newGameIds;
        await this.playerRepository.save(exists);

        const removedGames = oldGameIds.filter(id => !newGameIds.includes(id));
        for (const gameId of removedGames) {
          const game = await this.gamesRepository.findOne({ where: { id: gameId } });
          if (!game)
            continue;
          await this.gamesRepository.save(game);
        }

        const addedGames = newGameIds.filter(id => !oldGameIds.includes(id));
        for (const gameId of addedGames) {
          const game = await this.gamesRepository.findOne({ where: { id: gameId } });
          if (!game)
            continue;
          await this.gamesRepository.save(game);
        }

        loginDto.ban = String(loginDto.ban) === "true";
        loginDto.activation = String(loginDto.activation) === "true";
        if (loginDto.ban)
          loginDto.activation = false;
        if (loginDto.activation)
          loginDto.ban = false;
        loginDto.role = "player";
        await this.loginRepository.update({ id }, {
          username: loginDto.username?.trim() ? loginDto.username : exists.login.username,
          password: loginDto.password || exists.login.password,
          email: loginDto.email || exists.login.email,
          role: loginDto.role || exists.login.role,
          activation: loginDto.activation ?? exists.login.activation,
          ban: loginDto.ban ?? exists.login.ban
        });
        const updatedPlayer = await this.playerRepository.findOne({ where: { id }, relations: ['login'] });
        return updatedPlayer;
      }
    }
  }

  async removePlayer(id: number): Promise<object> {
    const player = await this.playerRepository.findOneBy({ id: id });
    if (!player)
      throw new HttpException(`Player with id ${id} not found!`, HttpStatus.NOT_FOUND);
    else {
      if (player.image) {
        const filePath = path.join('uploads/users/player', player.image);
        try {
          await promises.access(filePath);
          await promises.unlink(filePath);
        }
        catch (err) {
          throw new HttpException(`Profile image file not found or already deleted: ${filePath}`, HttpStatus.NOT_FOUND);
        }
      }
      await this.loginRepository.delete(id);
      return { message: `Player with id ${id} has been deleted` };
    }
  }

  //lab performance
  async removePlayerByEmail(email: string): Promise<object> {
    const login = await this.loginRepository.find({ where: { email }, relations: ['login'] });
    if (!login || login.length < 1)
      throw new HttpException(`No player found with email ${email}!`, HttpStatus.NOT_FOUND);
    for (const player of login) {
      if (player.player.image) {
        const filePath = path.join('uploads/users/player', player.player.image);
        try {
          await promises.access(filePath);
          await promises.unlink(filePath);
        }
        catch (err) {
          throw new HttpException(`Profile image not found or already deleted: ${filePath}`, HttpStatus.NOT_FOUND);
        }
      }
    }
    const loginIds = login.filter(player => player.player).map(player => player.player.id);
    if (loginIds.length > 0)
      await this.loginRepository.delete(loginIds);
    return { message: `Player with email ${email} has been deleted` };
  }

  async searchPlayer(key: any): Promise<object> {
    let players: object[] = [];
    if (!isNaN(Number(key)))
      players = await this.playerRepository.find({ where: { id: Number(key) } })
    if (players.length === 0) {
      // players = await this.playerRepository.find({ where: [{ username: Like(`%${key}%`) }, { email: Like(`%${key}%`) }, { NID: Like(`%${key}%`) }, { phone: Like(`%${key}%`) }] });
      players = await this.playerRepository.createQueryBuilder('player').leftJoinAndSelect('player.login', 'login').where('player.username LIKE :key', { key: `%${key}%` })
        .orWhere('player.NID LIKE :key', { key: `%${key}%` })
        .orWhere('player.phone LIKE :key', { key: `%${key}%` })
        .orWhere('login.email LIKE :key', { key: `%${key}%` })
        .getMany();
    }

    if (players.length === 0)
      throw new HttpException(`No player found! Try searching with another key`, HttpStatus.NOT_FOUND);
    return players;
  }

  async sortPlayerByIDAsc(): Promise<object> {
    const players = await this.playerRepository.find({ order: { id: 'ASC' } });
    if (!players || players.length < 1)
      throw new HttpException(`No player found!`, HttpStatus.NOT_FOUND);
    return players;
  }

  async sortPlayerByIDDesc(): Promise<object> {
    const players = await this.playerRepository.find({ order: { id: 'DESC' } });
    if (!players || players.length < 1)
      throw new HttpException(`No player found!`, HttpStatus.NOT_FOUND);
    return players;
  }

  async sortPlayerByNameAsc(): Promise<object> {
    const players = await this.playerRepository.find({ order: { username: 'ASC' } });
    if (!players || players.length < 1)
      throw new HttpException(`No player found!`, HttpStatus.NOT_FOUND);
    return players;
  }

  async sortPlayerByNameDesc(): Promise<object> {
    const players = await this.playerRepository.find({ order: { username: 'DESC' } });
    if (!players || players.length < 1)
      throw new HttpException(`No player found!`, HttpStatus.NOT_FOUND);
    return players;
  }


  async getDevelopers(): Promise<DeveloperEntity[]> {
    const developers = await this.developerRepository.find({ relations: ['login', 'games'] });
    if (!developers || developers.length < 1)
      throw new HttpException(`No developer found!`, HttpStatus.NOT_FOUND);
    return developers;
  }

  async getDeveloperByID(developerID: number): Promise<DeveloperEntity> {
    const exists = await this.developerRepository.findOne({ where: { id: developerID } });
    if (!exists)
      throw new HttpException(`Developer with id ${developerID} does not exist`, HttpStatus.NOT_FOUND);
    else
      return exists;
  }

  async getDeveloperPicByID(developerID: number, @Res() res): Promise<any> {
    const developer = await this.developerRepository.findOne({ where: { id: developerID }, select: { image: true } });
    if (!developer || !developer.image)
      throw new HttpException('Developer image not found', HttpStatus.NOT_FOUND);
    return res.sendFile(developer.image, { root: './uploads/users/developer' })
  }

  async getDevelopersByNullName(): Promise<object | DeveloperEntity[]> {
    const developers = await this.developerRepository.find({ where: [{ username: IsNull() }, { username: "" }, { username: " " }], relations: ['login'] });
    if (developers.length === 0)
      throw new HttpException(`No developer with null username has been found`, HttpStatus.NOT_FOUND);
    return developers;
  }

  async addDeveloper(developerDto: DeveloperDTO, loginDto: LoginDTO): Promise<DeveloperEntity> {
    const developerExists = await this.developerRepository.findOneBy({ username: developerDto.username });
    const loginExists = await this.loginRepository.findOneBy({ username: loginDto.username });
    if (developerExists || loginExists)
      throw new HttpException(`User with username ${developerDto.username} already exists`, HttpStatus.NOT_ACCEPTABLE);
    else {
      loginDto.role = "developer";
      // Create login entity (this will auto-generate ID)
      const login = this.loginRepository.create(loginDto);
      // Save login so @BeforeInsert runs
      const savedLogin = await this.loginRepository.save(login);

      // Create admin entity but DO NOT assign id
      const developer = this.developerRepository.create({
        ...developerDto,
        login: savedLogin,
        id: savedLogin.id       // share primary key
      });
      // Save admin
      const savedDeveloper = await this.developerRepository.save(developer);
      return savedDeveloper;
    }
  }

  async updateDeveloperPhoneByID(id: any, newPhone: any): Promise<DeveloperEntity | null> {
    if (!Number(id))
      throw new HttpException(`Please enter a valid ID number`, HttpStatus.NOT_ACCEPTABLE);
    id = Number(id)

    const exists = await this.developerRepository.findOneBy({ id });
    if (!exists)
      throw new HttpException(`Developer with id ${id} not found!`, HttpStatus.NOT_FOUND);
    else {
      if (!Number(newPhone))
        throw new HttpException("Please enter a valid Phone No.", HttpStatus.NOT_ACCEPTABLE);
      if (newPhone.length !== 11)
        throw new HttpException('Phone No. must be a valid format of 11 digits', HttpStatus.NOT_ACCEPTABLE);

      await this.developerRepository.update({ id }, { phone: newPhone });
      return await this.developerRepository.findOneBy({ id: id });
    }
  }

  async updateFullDeveloper(id: number, developerDto: DeveloperDTO, loginDto: LoginDTO): Promise<DeveloperEntity | null> {
    const exists = await this.developerRepository.findOne({ where: { id }, relations: ['login'] });
    if (!exists)
      throw new HttpException(`Developer with id ${id} not found!`, HttpStatus.NOT_FOUND);
    else {
      const developerExists = await this.developerRepository.findOne({ where: { username: developerDto.username, id: Not(id) } });
      const loginExists = await this.loginRepository.findOne({ where: { username: loginDto.username, id: Not(id) } });
      if (developerExists || loginExists)
        throw new HttpException(`User with username ${developerDto.username} already exists`, HttpStatus.NOT_ACCEPTABLE);
      else {
        await this.developerRepository.update({ id }, {
          username: developerDto.username || exists.username,
          image: developerDto.image || exists.image,
          phone: developerDto.phone || exists.phone,
          NID: developerDto.NID || exists.NID
        });

        loginDto.ban = String(loginDto.ban) === "true";
        loginDto.activation = String(loginDto.activation) === "true";
        if (loginDto.ban)
          loginDto.activation = false;
        if (loginDto.activation)
          loginDto.ban = false;
        loginDto.role = "developer";
        await this.loginRepository.update({ id }, {
          username: loginDto.username || exists.login.username,
          password: loginDto.password || exists.login.password,
          email: loginDto.email || exists.login.email,
          role: loginDto.role || exists.login.role,
          activation: loginDto.activation ?? exists.login.activation,
          ban: loginDto.ban ?? exists.login.ban
        });
        const updatedDeveloper = await this.developerRepository.findOne({ where: { id }, relations: ['login'] });
        return updatedDeveloper;
      }
    }
  }

  async removeDeveloper(id: number): Promise<object> {
    const developer = await this.developerRepository.findOne({ where: { id: id }, relations: ['login', 'games', 'games.categories'], });
    if (!developer)
      throw new HttpException(`Developer with id ${id} not found!`, HttpStatus.NOT_FOUND);
    else {
      if (developer.image) {
        const filePath = path.join('uploads/users/developer', developer.image);
        try {
          await promises.access(filePath);
          await promises.unlink(filePath);

          for (const game of developer.games) {
            game.categories = [];
            await this.gamesRepository.save(game);
          }

          await this.loginRepository.remove(developer.login);
        }
        catch (err) {
          throw new HttpException(`Profile image file not found or already deleted: ${filePath}`, HttpStatus.NOT_FOUND);
        }
      }
      return { message: `Developer with id ${id} has been deleted` };
    }
  }

  //lab performance
  async removeDeveloperByEmail(email: string): Promise<object> {
    const login = await this.loginRepository.find({ where: { email }, relations: ['login'] });
    if (!login || login.length < 1)
      throw new HttpException(`No developers found with email ${email}!`, HttpStatus.NOT_FOUND);
    for (const developer of login) {
      if (developer.developer.image) {
        const filePath = path.join('uploads/users/developer', developer.developer.image);
        try {
          await promises.access(filePath);
          await promises.unlink(filePath);
        }
        catch (err) {
          throw new HttpException(`Profile image not found or already deleted: ${filePath}`, HttpStatus.NOT_FOUND);
        }
      }
    }
    const loginIds = login.filter(developer => developer.developer).map(developer => developer.developer.id);
    if (loginIds.length > 0)
      await this.loginRepository.delete(loginIds);
    return { message: `Developer with email ${email} has been deleted` };
  }

  async searchDeveloper(key: any): Promise<object> {
    var developers: object[] = [];
    if (!isNaN(Number(key)))
      developers = await this.developerRepository.find({ where: { id: Number(key) } })
    if (developers.length === 0) {
      // developers = await this.developerRepository.find({ where: [{ username: Like(`%${key}%`) }, { email: Like(`%${key}%`) }, { NID: Like(`%${key}%`) }, { phone: Like(`%${key}%`) }] });
      developers = await this.developerRepository.createQueryBuilder('developer').leftJoinAndSelect('developer.login', 'login').where('developer.username LIKE :key', { key: `%${key}%` })
        .orWhere('developer.NID LIKE :key', { key: `%${key}%` })
        .orWhere('developer.phone LIKE :key', { key: `%${key}%` })
        .orWhere('login.email LIKE :key', { key: `%${key}%` })
        .getMany();
    }

    if (developers.length === 0)
      throw new HttpException(`No developer found! Try searching with another key`, HttpStatus.NOT_FOUND);
    return developers;
  }

  async sortDeveloperByIDAsc(): Promise<object> {
    const developers = await this.developerRepository.find({ order: { id: 'ASC' } });
    if (!developers || developers.length < 1)
      throw new HttpException(`No developer found!`, HttpStatus.NOT_FOUND);
    return developers;
  }

  async sortDeveloperByIDDesc(): Promise<object> {
    const developers = await this.developerRepository.find({ order: { id: 'DESC' } });
    if (!developers || developers.length < 1)
      throw new HttpException(`No developer found!`, HttpStatus.NOT_FOUND);
    return developers;
  }

  async sortDeveloperByNameAsc(): Promise<object> {
    const developers = await this.developerRepository.find({ order: { username: 'ASC' } });
    if (!developers || developers.length < 1)
      throw new HttpException(`No developer found!`, HttpStatus.NOT_FOUND);
    return developers;
  }

  async sortDeveloperByNameDesc(): Promise<object> {
    const developers = await this.developerRepository.find({ order: { username: 'DESC' } });
    if (!developers || developers.length < 1)
      throw new HttpException(`No developer found!`, HttpStatus.NOT_FOUND);
    return developers;
  }


  async getGames(): Promise<GamesEntity[] | object> {
    const games = await this.gamesRepository.find({ relations: ['categories', 'developer'] });
    if (!games || games.length === 0)
      throw new HttpException(`No game found!`, HttpStatus.NOT_FOUND);
    return games;
  }

  async getFiveBestsellerGames(): Promise<GamesEntity[] | object> {
    const games = await this.gamesRepository.find({ order: { purchase_count: 'DESC' }, relations: ['categories', 'developer'], take: 5 });
    if (!games || games.length === 0)
      throw new HttpException(`No game found!`, HttpStatus.NOT_FOUND);
    return games;
  }

  async getBestsellerGames(): Promise<GamesEntity[] | object> {
    const games = await this.gamesRepository.find({ order: { purchase_count: 'DESC' }, relations: ['categories', 'developer'], take: 10 });
    if (!games || games.length === 0)
      throw new HttpException(`No game found!`, HttpStatus.NOT_FOUND);
    return games;
  }

  async getTotalNoOfGames(): Promise<Number> {
    const total = await this.gamesRepository.count();
    return Number(total);
  }

  async getFullGameByID(gameID: number): Promise<GamesEntity> {
    const exists = await this.gamesRepository.findOne({ where: { id: gameID }, relations: ['categories', 'developer'] });
    if (!exists)
      throw new HttpException(`Game with id ${gameID} does not exist`, HttpStatus.NOT_FOUND);
    else
      return exists;
  }

  async getGamePicByID(gameID: number, @Res() res): Promise<any> {
    const game = await this.gamesRepository.findOne({ where: { id: gameID }, select: { image: true } });
    if (!game || !game.image)
      throw new HttpException(`Game image not found`, HttpStatus.NOT_FOUND);
    return res.sendFile(game.image, { root: './uploads/games/images' })
  }

  async getGameTrailerByID(gameID: number, @Res() res): Promise<any> {
    const game = await this.gamesRepository.findOne({ where: { id: gameID }, select: { trailer: true } });
    if (!game || !game.trailer)
      throw new HttpException(`Game trailer not found`, HttpStatus.NOT_FOUND);
    return res.sendFile(game.trailer, { root: './uploads/games/trailers' })
  }

  async getGameByID(gameID: number, @Res() res): Promise<any> {
    const game = await this.gamesRepository.findOne({ where: { id: gameID }, select: { game: true } });
    if (!game || !game.game)
      throw new HttpException(`Game not found`, HttpStatus.NOT_FOUND);
    return res.sendFile(game.game, { root: './uploads/games/game' })
  }

  //mid project defence
  async getGamesByDeveloperID(developerId: number): Promise<GamesEntity[]> {
    if (isNaN(Number(developerId)))
      throw new HttpException(`Please enter a valid developer ID`, HttpStatus.NOT_ACCEPTABLE);

    developerId = Number(developerId);
    const games = await this.gamesRepository.find({ where: { developer: { id: developerId } }, relations: ['categories', 'developer'] });
    if (!games || games.length === 0)
      throw new HttpException(`No games found for developer with id ${developerId}`, HttpStatus.NOT_FOUND);

    return games;
  }

  async addGame(gameDto: GamesDTO): Promise<GamesEntity> {
    const gameExists = await this.gamesRepository.findOneBy({ title: gameDto.title });
    if (gameExists)
      throw new HttpException(`Game with title ${gameDto.title} already exists`, HttpStatus.NOT_ACCEPTABLE);

    const developer = await this.developerRepository.findOne({ where: { username: gameDto.developed_by } })
    if (!developer)
      throw new HttpException(`Developer '${gameDto.developed_by}' not found`, HttpStatus.NOT_FOUND);
    let game = this.gamesRepository.create({
      title: gameDto.title,
      description: gameDto.description,
      price: gameDto.price,
      image: gameDto.image,
      trailer: gameDto.trailer,
      game: gameDto.game,
      developer
    });
    return await this.gamesRepository.save(game);
  }

  async addCategoryToGame(gameTitle: string, categoryName: string): Promise<GamesEntity> {
    const game = await this.gamesRepository.findOne({ where: { title: gameTitle }, relations: ['categories', 'developer'] });
    if (!game)
      throw new HttpException(`Game ${gameTitle} not found`, HttpStatus.NOT_FOUND);

    const category = await this.categoriesRepository.findOne({ where: { name: categoryName } });
    if (!category)
      throw new HttpException(`Category ${categoryName} not found`, HttpStatus.NOT_FOUND);

    game.categories = [...game.categories, category];
    return await this.gamesRepository.save(game);
  }

  async removeCategoryFromGame(gameTitle: string, categoryName: string): Promise<GamesEntity> {
    const game = await this.gamesRepository.findOne({ where: { title: gameTitle }, relations: ['categories', 'developer'] });
    if (!game)
      throw new HttpException(`Game ${gameTitle} not found`, HttpStatus.NOT_FOUND);

    const category = await this.categoriesRepository.findOne({ where: { name: categoryName } });
    if (!category)
      throw new HttpException(`Category ${categoryName} not found`, HttpStatus.NOT_FOUND);

    game.categories = game.categories.filter((c) => c.id !== category.id);
    return await this.gamesRepository.save(game);
  }

  // //   updateGame(game: GamesDTO, oldTitle: string, newTitle: string): string {
  // //     return `${game.id} has been updated from '${oldTitle}' to '${newTitle}' successfully`;
  // //   }

  // //   updateFullGame(game: GamesDTO, id: number): string {
  // //     return `${id} has been updated successfully`;
  // //   }

  //   async removeGame(id: number): Promise<object> {
  //     const game = await this.gamesRepository.findOne({ where: { id } });
  //     if (!game) 
  //       throw new Error("Game not found");

  //     const categories = await this.categoriesRepository.find();
  //     for (const category of categories) {
  //       if (category.game_ids?.includes(id)) {
  //         category.game_ids = category.game_ids.filter(x => x !== id);
  //         await this.categoriesRepository.save(category);
  //       }
  //     }
  //     await this.gamesRepository.delete(id);
  //     return { message: `Game ${game.title} deleted successfully` };
  //   }

  async getCategories(): Promise<CategoriesEntity[] | object> {
    const categories = await this.categoriesRepository.find({ relations: ['games', 'games.developer'] });
    if (!categories || categories.length === 0)
      throw new HttpException(`No category found!`, HttpStatus.NOT_FOUND);
    return categories;
  }

  async addCategory(categoryDto: CategoriesDTO): Promise<CategoriesEntity> {
    const categoryExists = await this.categoriesRepository.findOneBy({ name: categoryDto.name });
    if (categoryExists)
      throw new HttpException(`Category '${categoryExists.name}' already exists`, HttpStatus.NOT_ACCEPTABLE);

    const category = this.categoriesRepository.create({
      name: categoryDto.name,
      description: categoryDto.description,
    });
    const savedCategory = await this.categoriesRepository.save(category);
    return savedCategory;
  }

  async addGameToCategory(catName: string, gameId: number): Promise<void> {
    const category = await this.categoriesRepository.findOne({ where: { name: catName } });
    const game = await this.gamesRepository.findOne({ where: { id: gameId } });
    if (!category)
      throw new HttpException(`Category ${catName} not found`, HttpStatus.NOT_FOUND);
    if (game && category) {
      category.games = [...category.games, game];
      await this.categoriesRepository.save(game);
    }
  }

  // //   updateCategory(category: CategoriesDTO, id: number): string {
  // //     return `${id} has been updated successfully`;
  // //   }

  // //   updateFullCategory(category: CategoriesDTO, id: number): string {
  // //     return `${id} has been updated successfully`;
  // //   }

  async removeCategory(id: number): Promise<object> {
    const category = await this.categoriesRepository.findOneBy({ id: id });
    if (!category)
      throw new HttpException(`Category with id ${id} not found!`, HttpStatus.NOT_FOUND);
    await this.categoriesRepository.delete(id);
    return { message: `Category with id ${id} has been deleted` };
  }


  async getPurchases(): Promise<PurchasesEntity[] | object> {
    const purchases = await this.purchasesRepository.find({ relations: ['player', 'game'] });
    if (!purchases || purchases.length === 0)
      return { message: `No purchase record found!` };
    return purchases;
  }

  async getRecentTopPurchases(): Promise<PurchasesEntity[] | object> {
    const purchases = await this.purchasesRepository.find({ order: { amount: 'DESC' }, relations: ['player'], take: 10 });
    if (!purchases || purchases.length === 0)
      return { message: `No purchase record found!` };
    return purchases;
  }

  async getLastWeekTotalPurchases(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const total = await this.purchasesRepository.sum('amount', { purchase_date: MoreThanOrEqual(sevenDaysAgo), });
    return Number(total) || 0;
  }

  async getLastWeekPurchases(): Promise<{ date: string; total: number }[]> {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const purchases = await this.purchasesRepository.find({ where: { purchase_date: MoreThan(sevenDaysAgo) } });

    const salesMap: { [date: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const key = date.toISOString().split("T")[0];
      salesMap[key] = 0;
    }

    purchases.forEach(p => {
      const key = p.purchase_date.toISOString().split("T")[0];
      salesMap[key] = (salesMap[key] || 0) + Number(p.amount || 0);
    });

    return Object.keys(salesMap).sort().map(date => ({ date, total: salesMap[date] }));
  }

  //   addPurchase(purchase: PurchasesDTO): string {
  //     return purchase.id + " has been added successfully";
  //   }

  //   updatePurchase(purchase: PurchasesDTO, id: number): string {
  //     return `${id} has been updated successfully`;
  //   }

  //   updateFullPurchase(purchase: PurchasesDTO, id: number): string {
  //     return `${id} has been updated successfully`;
  //   }

  async removePurchase(id: number): Promise<object> {
    const purchase = await this.purchasesRepository.findOneBy({ id: id });
    if (!purchase)
      throw new HttpException(`Purchase record with id ${id} not found!`, HttpStatus.NOT_FOUND);
    await this.purchasesRepository.delete(id);
    return { message: `Category with id ${id} has been deleted` };
  }


  //   getViews(): object {
  //     let view1: Object = {
  //       id: 132,
  //       user_id: 14,
  //       game_id: 5436,
  //       view_count: 12
  //     };
  //     return view1;
  //   }

  //   addView(view: ViewsDTO): string {
  //     return view.id + " has been added successfully";
  //   }

  //   updateView(view: ViewsDTO, id: number): string {
  //     return `${id} has been updated successfully`;
  //   }

  //   updateFullView(view: ViewsDTO, id: number): string {
  //     return `${id} has been updated successfully`;
  //   }

  //   deleteView(id: number): string {
  //     return `View record with ID ${id} has been deleted successfully`;
  //   }

  //   getPlays(): object {
  //     let play1: Object = {
  //       id: 132,
  //       user_id: 14,
  //       game_id: 5436,
  //       duration: 12
  //     };
  //     return play1;
  //   }

  //   addPlay(play: PlaysDTO): string {
  //     return play.id + " has been added successfully";
  //   }

  //   updatePlay(play: PlaysDTO, id: number): string {
  //     return `${id} has been updated successfully`;
  //   }

  //   updateFullPlay(play: PlaysDTO, id: number): string {
  //     return `${id} has been updated successfully`;
  //   }

  //   deletePlay(id: number): string {
  //     return `Play record with ID ${id} has been deleted successfully`;
  //   }

  async userActivation(id: any, activation: boolean): Promise<LoginEntity | null> {
    if (isNaN(Number(id)))
      throw new HttpException(`Please enter a valid ID number`, HttpStatus.NOT_ACCEPTABLE);

    id = Number(id)
    const exists = await this.loginRepository.findOneBy({ id });
    if (!exists)
      throw new HttpException(`Admin with id ${id} not found!`, HttpStatus.NOT_FOUND);
    else {
      activation = String(activation).toLowerCase() === "true" || Number(activation) === 1;
      if (activation === exists.activation) {
        if (activation === true)
          throw new HttpException(`User '${exists.username}' account is already active`, HttpStatus.NOT_ACCEPTABLE);
        if (activation === false)
          throw new HttpException(`User '${exists.username}' account is already deactive`, HttpStatus.NOT_ACCEPTABLE);
      }
      if (activation)
        await this.loginRepository.update({ id }, { activation: activation, ban: false });
      else
        await this.loginRepository.update({ id }, { activation: activation });
      return await this.loginRepository.findOneBy({ id: id });
    }
  }

  async userBan(id: any, ban: boolean): Promise<LoginEntity | null> {
    if (isNaN(Number(id)))
      throw new HttpException(`Please enter a valid ID number`, HttpStatus.NOT_ACCEPTABLE);

    id = Number(id)
    const exists = await this.loginRepository.findOneBy({ id });
    if (!exists)
      throw new HttpException(`Admin with id ${id} not found!`, HttpStatus.NOT_FOUND);
    else {
      ban = String(ban).toLowerCase() === "true" || Number(ban) === 1;
      if (ban === exists.ban) {
        if (ban === true)
          throw new HttpException(`User '${exists.username}' account is already banned`, HttpStatus.NOT_ACCEPTABLE);
        if (ban === false)
          throw new HttpException(`User '${exists.username}' account is already unbanned`, HttpStatus.NOT_ACCEPTABLE);
      }
      if (ban)
        await this.loginRepository.update({ id }, { ban: ban, activation: false });
      if (!ban)
        await this.loginRepository.update({ id }, { ban: ban, activation: true });
      return await this.loginRepository.findOneBy({ id: id });
    }
  }
}