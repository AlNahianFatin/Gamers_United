import { Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, Req, Request, Res, Session, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { SessionGuard } from 'src/session.guard';
import { AdminService } from './admin.service';
import { GamesDTO } from '../dto/games.dto';
import { PurchasesDTO } from '../dto/purchases.dto';
import { ViewsDTO } from '../dto/views.dto';
import { PlaysDTO } from '../dto/plays.dto';
import { CategoriesDTO } from '../dto/categories.dto';
import { AdminDTO } from '../dto/admin.dto';
import { PlayerDTO } from '../dto/player.dto';
import { DeveloperDTO } from '../dto/developer.dto';
import path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '../entities/admin.entity';
import { PlayerEntity } from '../entities/player.entity';
import { DeveloperEntity } from '../entities/developer.entity';
import { LoginDTO } from '../dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { GamesEntity } from '../entities/games.entity';
import { CategoriesEntity } from '../entities/categories.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,
    @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
    @InjectRepository(PlayerEntity) private playerRepository: Repository<PlayerEntity>,
    @InjectRepository(DeveloperEntity) private developerRepository: Repository<DeveloperEntity>) { }

  // @UseGuards(JwtAuthGuard)
  // @Get('dashboard')
  // dashboard() {
  //   return "Admin dashboard protected by JWT";
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SessionGuard)
  @Get('getAdmins')
  async getAdmins() {
    try { return await this.adminService.getAdmins(); }
    catch (error) { throw error };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(SessionGuard)
  @Get('getAdminByID/:adminID')
  async getAdminByID(@Param('adminID') adminID: number, @Req() req) {
    const sessionUser = req.session.user;

    if (sessionUser.role !== "admin")
      throw new ForbiddenException();

    if (sessionUser.id !== Number(adminID))
      throw new ForbiddenException("Access denied");

    try { return this.adminService.getAdminByID(adminID); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getAdminPicByID/:adminID')
  async getAdminPicByID(@Param('adminID') adminID: number, @Res() res, @Req() req) {
    const sessionUser = req.session.user;

    if (sessionUser.role !== "admin")
      throw new ForbiddenException();

    if (sessionUser.id !== Number(adminID))
      throw new ForbiddenException("Access denied");

    try { return await this.adminService.getAdminPicByID(adminID, res); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getAdminsByNullName')
  async getAdminsByNullName(): Promise<object | AdminEntity[] | null> {
    try { return await this.adminService.getAdminsByNullName(); }
    catch (error) { throw error; }
  }

  @Post('addAdmin')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, image, cb) => {
      if (image.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
        cb(null, true);
      else
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
    storage: diskStorage({
      destination: 'uploads/users/admin',
      filename: function (req, image, cb) {
        cb(null, Date.now() + path.extname(image.originalname));
      },
    })
  }))
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async addAdmin(@Session() session, @UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe({ transform: true })) body: any): Promise<AdminEntity> {
    const adminDto = plainToInstance(AdminDTO, {
      username: body.username,
      phone: body.phone,
      NID: body.NID
    });
    await validateOrReject(adminDto);

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
    await validateOrReject(loginDto);

    if (file)
      adminDto.image = file.filename;
    try { return await this.adminService.addAdmin(adminDto, loginDto); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Patch('updateAdminPhoneByID/:id')
  async updateAdminPhoneById(@Param('id') id: string, @Query('newPhone') newPhone: string) {
    try { return await this.adminService.updateAdminPhoneById(id, newPhone); }
    catch (error) { throw error; }
  }

  @Put('updateFullAdmin/:id')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, image, cb) => {
      if (image.originalname.match(/^.*\.(jpg|webp|png|jpeg|png)$/))
        cb(null, true);
      else
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
    storage: diskStorage({
      destination: 'uploads/users/admin',
      filename: function (req, image, cb) {
        cb(null, Date.now() + path.extname(image.originalname));
      },
    })
  }))
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async updateFullAdmin(@UploadedFile() file: Express.Multer.File, @Param('id') id: number, @Body(new ValidationPipe({ transform: true })) body: any) {
    const adminDto = plainToInstance(AdminDTO, {
      username: body.username,
      phone: body.phone,
      NID: body.NID
    });
    await validateOrReject(adminDto);

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
    await validateOrReject(loginDto);

    if (file)
      adminDto.image = file.filename;
    return this.adminService.updateFullAdmin(id, adminDto, loginDto);
  }

  @UseGuards(SessionGuard)
  @Delete('removeAdmin')
  async removeAdmin(@Query('id') id: number): Promise<object> {
    try { return await this.adminService.removeAdmin(id); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Delete('removeAdminByEmail')
  async removeAdminByEmail(@Query('email') email: string): Promise<object> {
    try { return await this.adminService.removeAdminByEmail(email); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('searchAdmin/:key')
  async searchAdmin(@Param('key') key: any): Promise<object> {
    try { return await this.adminService.searchAdmin(key); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortAdminByIDAsc')
  async sortAdminByIDAsc(): Promise<object> {
    try { return await this.adminService.sortAdminByIDAsc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortAdminByIDDesc')
  async sortAdminByIDDesc(): Promise<object> {
    try { return await this.adminService.sortAdminByIDDesc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortAdminByNameAsc')
  async sortAdminByNameAsc(): Promise<object> {
    try { return await this.adminService.sortAdminByNameAsc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortAdminByNameDesc')
  async sortAdminByNameDesc(): Promise<object> {
    try { return await this.adminService.sortAdminByNameDesc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getPlayers')
  async getPlayers() {
    try { return await this.adminService.getPlayers(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getPlayerByID/:playerID')
  async getPlayerByID(@Param('playerID') playerID: number) {
    try { return await this.adminService.getPlayerByID(playerID); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getPlayerPicByID/:playerID')
  async getPlayerPicByID(@Param('playerID') playerID: number, @Res() res) {
    try { return await this.adminService.getPlayerPicByID(playerID, res); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getPlayersByNullName')
  async getPlayersByNullName(): Promise<object | PlayerEntity[] | null> {
    try { return await this.adminService.getPlayersByNullName(); }
    catch (error) { throw error; }
  }

  @Post('addPlayer')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, image, cb) => {
      if (image.originalname.match(/^.*\.(jpg|webp|png|jpeg|png)$/))
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
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async addPlayer(@UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe({ transform: true })) body: any): Promise<PlayerEntity> {
    const playerDto = plainToInstance(PlayerDTO, {
      username: body.username,
      phone: body.phone,
      NID: body.NID
    });
    await validateOrReject(playerDto);

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
    await validateOrReject(loginDto);

    if (file)
      playerDto.image = file.filename;
    try { return await this.adminService.addPlayer(playerDto, loginDto); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Patch('updatePlayerPhoneByID/:id')
  async updatePlayerPhoneByID(@Param('id') id: string, @Query('newPhone') newPhone: string) {
    try { return await this.adminService.updatePlayerPhoneByID(id, newPhone); }
    catch (error) { throw error; }
  }

  @Put('updateFullPlayer/:id')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, image, cb) => {
      if (image.originalname.match(/^.*\.(jpg|webp|png|jpeg|png)$/))
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
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async updateFullPlayer(@UploadedFile() file: Express.Multer.File, @Param('id') id: number, @Body(new ValidationPipe({ transform: true })) body: any) {
    const playerDto = plainToInstance(PlayerDTO, {
      username: body.username,
      phone: body.phone,
      NID: body.NID
    });
    await validateOrReject(playerDto);

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
    await validateOrReject(loginDto);

    if (file)
      playerDto.image = file.filename;
    try { return await this.adminService.updateFullPlayer(id, playerDto, loginDto); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Delete('removePlayer')
  async removePlayer(@Query('id') id: number): Promise<object> {
    try { return await this.adminService.removePlayer(id); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Delete('removePlayerByEmail')
  async removePlayerByEmail(@Query('email') email: string): Promise<object> {
    try { return await this.adminService.removePlayerByEmail(email); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('searchPlayer/:key')
  async searchPlayer(@Param('key') key: any): Promise<object> {
    try { return await this.adminService.searchPlayer(key); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortPlayerByIDAsc')
  async sortPlayerByIDAsc(): Promise<object> {
    try { return await this.adminService.sortPlayerByIDAsc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortPlayerByIDDesc')
  async sortPlayerByIDDesc(): Promise<object> {
    try { return await this.adminService.sortPlayerByIDDesc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortPlayerByNameAsc')
  async sortPlayerByNameAsc(): Promise<object> {
    try { return await this.adminService.sortPlayerByNameAsc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortPlayerByNameDesc')
  async sortPlayerByNameDesc(): Promise<object> {
    try { return await this.adminService.sortPlayerByNameDesc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getDevelopers')
  async getDevelopers() {
    try { return await this.adminService.getDevelopers(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getDeveloperByID/:developerID')
  async getDeveloperByID(@Param('developerID') developerID: number) {
    try { return await this.adminService.getDeveloperByID(developerID); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getDeveloperPicByID/:developerID')
  async getDeveloperPicByID(@Param('developerID') developerID: number, @Res() res) {
    try { return await this.adminService.getDeveloperPicByID(developerID, res); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getDevelopersByNullName')
  async getDevelopersByNullName(): Promise<object | DeveloperEntity[] | null> {
    try { return await this.adminService.getDevelopersByNullName(); }
    catch (error) { throw error; }
  }

  @Post('addDeveloper')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, image, cb) => {
      if (image.originalname.match(/^.*\.(jpg|webp|png|jpeg|png)$/))
        cb(null, true);
      else
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
    storage: diskStorage({
      destination: 'uploads/users/developer',
      filename: function (req, image, cb) {
        cb(null, Date.now() + path.extname(image.originalname));
      },
    })
  }))
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async addDeveloper(@UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe({ transform: true })) body: any): Promise<DeveloperEntity> {
    const developerDto = plainToInstance(DeveloperDTO, {
      username: body.username,
      phone: body.phone,
      NID: body.NID
    });
    await validateOrReject(developerDto);

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
    await validateOrReject(loginDto);

    if (file)
      developerDto.image = file.filename;
    try { return await this.adminService.addDeveloper(developerDto, loginDto); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Patch('updateDeveloperPhoneByID/:id')
  async updateDeveloperPhoneByID(@Param('id') id: string, @Query('newPhone') newPhone: string) {
    try { return await this.adminService.updateDeveloperPhoneByID(id, newPhone); }
    catch (error) { throw error; }
  }

  @Put('updateFullDeveloper/:id')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, image, cb) => {
      if (image.originalname.match(/^.*\.(jpg|webp|png|jpeg|png)$/))
        cb(null, true);
      else
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
    storage: diskStorage({
      destination: 'uploads/users/developer',
      filename: function (req, image, cb) {
        cb(null, Date.now() + path.extname(image.originalname));
      },
    })
  }))
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async updateFullDeveloper(@UploadedFile() file: Express.Multer.File, @Param('id') id: number, @Body(new ValidationPipe({ transform: true })) body: any) {
    const developerDto = plainToInstance(DeveloperDTO, {
      username: body.username,
      phone: body.phone,
      NID: body.NID
    });
    await validateOrReject(developerDto);

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
    await validateOrReject(loginDto);

    if (file)
      developerDto.image = file.filename;
    try { return await this.adminService.updateFullDeveloper(id, developerDto, loginDto); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Delete('removeDeveloper')
  async removeDeveloper(@Query('id') id: number): Promise<object> {
    try { return await this.adminService.removeDeveloper(id); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Delete('removeDeveloperByEmail')
  async removeDeveloperByEmail(@Query('email') email: string): Promise<object> {
    try { return await this.adminService.removeDeveloperByEmail(email); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('searchDeveloper/:key')
  async searchDeveloper(@Param('key') key: any): Promise<object> {
    try { return await this.adminService.searchDeveloper(key); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortDeveloperByIDAsc')
  async sortDeveloperByIDAsc(): Promise<object> {
    try { return await this.adminService.sortDeveloperByIDAsc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortDeveloperByIDDesc')
  async sortDeveloperByIDDesc(): Promise<object> {
    try { return await this.adminService.sortDeveloperByIDDesc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortDeveloperByNameAsc')
  async sortDeveloperByNameAsc(): Promise<object> {
    try { return await this.adminService.sortDeveloperByNameAsc(); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('sortDeveloperByNameDesc')
  async sortDeveloperByNameDesc(): Promise<object> {
    try { return await this.adminService.sortDeveloperByNameDesc(); }
    catch (error) { throw error; }
  }


  @UseGuards(SessionGuard)
  @Get('getGames')
  async getGames() {
    try { return await this.adminService.getGames(); }
    catch (error) { throw error; }
  }
  
  @UseGuards(SessionGuard)
  @Get('getFiveBestsellerGames')
  async getFiveBestsellerGames() {
    try { return await this.adminService.getFiveBestsellerGames(); }
    catch (error) { throw error; }
  }
  
  @UseGuards(SessionGuard)
  @Get('getBestsellerGames')
  async getBestsellerGames() {
    try { return await this.adminService.getBestsellerGames(); }
    catch (error) { throw error; }
  }
  
  @UseGuards(SessionGuard)
  @Get('getFullGameByID/:gameID')
  async getFullGameByID(@Param('gameID') gameID: number) {
    try { return await this.adminService.getFullGameByID(gameID); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getGamePicByID/:gameID')
  async getGamePicByID(@Param('gameID') gameID: number, @Res() res) {
    try { return await this.adminService.getGamePicByID(gameID, res); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getGameTrailerByID/:gameID')
  async getGameTrailerByID(@Param('gameID') gameID: number, @Res() res) {
    try { return await this.adminService.getGameTrailerByID(gameID, res); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getGameByID/:gameID')
  async getGameByID(@Param('gameID') gameID: number, @Res() res) {
    try { return await this.adminService.getGameByID(gameID, res); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Get('getGamesByDeveloperID/:developerId')
  async getGamesByDeveloperID(@Param('developerId') developerId: number): Promise<GamesEntity[]> {
    try { return await this.adminService.getGamesByDeveloperID(developerId); }
    catch (error) { throw error; }
  }

  @Post('addGame')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }, { name: 'trailer', maxCount: 1 }, { name: 'game', maxCount: 1 }], {
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (file.fieldname === 'image')
          cb(null, 'uploads/games/images');
        else if (file.fieldname === 'trailer')
          cb(null, 'uploads/games/trailers');
        else if (file.fieldname === 'game')
          cb(null, 'uploads/games/game');
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'image') {
        if (file.originalname.match(/\.(jpg|jpeg|png|webp)$/))
          cb(null, true);
        else
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
      else if (file.fieldname === 'trailer') {
        if (file.originalname.match(/\.(mp4|mkv)$/))
          cb(null, true);
        else
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'trailer'), false);
      }
      else if (file.fieldname === 'game') {
        if (file.originalname.match(/\.(pdf)$/))
          cb(null, true);
        else
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'game'), false);
      }
    },
    limits: { fileSize: 30 * 1024 * 1024 }
  }))
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async addGame(@UploadedFiles() files: { image: Express.Multer.File[], trailer: Express.Multer.File[], game: Express.Multer.File[] }, @Body(new ValidationPipe({ transform: true })) body: any): Promise<GamesEntity> {
    const gameDto = plainToInstance(GamesDTO, {
      title: body.title,
      developed_by: body.developed_by,
      description: body.description,
      price: body.price,
      view_count: body.view_count,
      play_count: body.play_count,
      purchase_count: body.purchase_count,
    });
    await validateOrReject(gameDto);

    if (files.image && files.image.length > 0)
      gameDto.image = files.image[0].filename;
    if (files.trailer && files.trailer.length > 0)
      gameDto.trailer = files.trailer[0].filename;
    if (files.game && files.game.length > 0)
      gameDto.game = files.game[0].filename;
    try { return await this.adminService.addGame(gameDto); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Post('addCategoryToGame')
  async addCategoryToGame(@Query('gameTitle') gameTitle: string, @Query('categoryName') categoryName: string) {
    try { return await this.adminService.addCategoryToGame(gameTitle, categoryName); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Delete('removeCategoryFromGame')
  async removeCategoryFromGame(@Query('gameTitle') gameTitle: string, @Query('categoryName') categoryName: string) {
    try { return await this.adminService.removeCategoryFromGame(gameTitle, categoryName); }
    catch (error) { throw error; }
  }

  // // @Patch('games/update/:newTitle')
  // // updateGame(@Param('newTitle') newTitle: string, @Body() game: GamesDTO): string {
  // //   return this.adminService.updateGame(game, game.title, newTitle);
  // // }

  // // @Put('games/update/:id')
  // // updateFullGame(@Param('id') id: number, @Body() game: GamesDTO): string {
  // //   return this.adminService.updateFullGame(game, id);
  // // }

  // // @Delete('games/remove')
  // // removeGame(@Query('id') id: number): string {
  // //   return this.adminService.removeGame(id);
  // // }


  @Get('getCategories')
  getCategories() {
    return this.adminService.getCategories()
  }

  @UseGuards(SessionGuard)
  @Post('addCategory')
  async addCategory(@Body() category: CategoriesDTO): Promise<CategoriesEntity> {
    const categoryDto = plainToInstance(CategoriesDTO, {
      name: category.name,
      description: category.description
    });
    await validateOrReject(categoryDto);
    try { return await this.adminService.addCategory(categoryDto); }
    catch (error) { throw error; }
  }

  // // @Patch('categories/update/:id')
  // // updateCategory(@Param('id') id: number, @Body() category: CategoriesDTO): string {
  // //   return this.adminService.updateCategory(category, id);
  // // }

  // // @Put('categories/update/:id')
  // // updateFullCategory(@Param('id') id: number, @Body() category: CategoriesDTO): string {
  // //   return this.adminService.updateFullCategory(category, id);
  // // }

  @UseGuards(SessionGuard)
  @Delete('removeCategory')
  async removeCategory(@Query('id') id: number): Promise<object> {
    try { return await this.adminService.removeCategory(id); }
    catch (error) { throw error; }
  }

  // @Get('purchases')
  // getPurchases(): object {
  //   return this.adminService.getPurchases();
  // }

  // @Post('purchases/add')
  // addPurchase(@Body() purchase: PurchasesDTO): string {
  //   return this.adminService.addPurchase(purchase);
  // }

  // @Patch('purchases/update/:id')
  // updatePurchase(@Param('id') id: number, @Body() purchase: PurchasesDTO): string {
  //   return this.adminService.updatePurchase(purchase, id);
  // }

  // @Put('purchases/update/:id')
  // updateFullPurchase(@Param('id') id: number, @Body() purchase: PurchasesDTO): string {
  //   return this.adminService.updateFullPurchase(purchase, id);
  // }

  // @Delete('purchases/remove')
  // deletePurchase(@Query('id') id: number): string {
  //   return this.adminService.deletePurchase(id);
  // }

  // @Get('views')
  // getViews(): object {
  //   return this.adminService.getViews();
  // }

  // @Post('views/add')
  // addView(@Body() view: ViewsDTO): string {
  //   return this.adminService.addView(view);
  // }

  // @Patch('views/update/:id')
  // updateView(@Param('id') id: number, @Body() view: ViewsDTO): string {
  //   return this.adminService.updateView(view, id);
  // }

  // @Put('views/update/:id')
  // updateFullView(@Param('id') id: number, @Body() view: ViewsDTO): string {
  //   return this.adminService.updateFullView(view, id);
  // }

  // @Delete('views/remove')
  // deleteView(@Query('id') id: number): string {
  //   return this.adminService.deleteView(id);
  // }

  // @Get('plays')
  // getPlays(): object {
  //   return this.adminService.getPlays();
  // }

  // @Post('plays/add')
  // addPlay(@Body() play: PlaysDTO): string {
  //   return this.adminService.addPlay(play);
  // }

  // @Patch('plays/update/:id')
  // updatePlay(@Param('id') id: number, @Body() play: PlaysDTO): string {
  //   return this.adminService.updatePlay(play, id);
  // }

  // @Put('plays/update/:id')
  // updateFullPlay(@Param('id') id: number, @Body() play: PlaysDTO): string {
  //   return this.adminService.updateFullPlay(play, id);
  // }

  // @Delete('plays/remove')
  // deletePlay(@Query('id') id: number): string {
  //   return this.adminService.deletePlay(id);
  // }

  @UseGuards(SessionGuard)
  @Patch('userActivation/:id')
  async userActivation(@Param('id') id: string, @Query('activation') activation: boolean) {
    try { return await this.adminService.userActivation(id, activation); }
    catch (error) { throw error; }
  }

  @UseGuards(SessionGuard)
  @Patch('userBan/:id')
  async userBan(@Param('id') id: string, @Query('ban') ban: boolean) {
    try { return await this.adminService.userBan(id, ban); }
    catch (error) { throw error; }
  }
}