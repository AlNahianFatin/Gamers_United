import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { AdminService } from './admin.service';
import { GamesDTO } from './DTO/games.dto';
import { PurchasesDTO } from './DTO/purchases.dto';
import { ViewsDTO } from './DTO/views.dto';
import { PlaysDTO } from './DTO/plays.dto';
import { CategoriesDTO } from './DTO/categories.dto';
import { AdminDTO } from './DTO/admin.dto';
import { PlayerDTO } from './DTO/player.dto';
import { DeveloperDTO } from './DTO/developer.dto';
import path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './Entity/admin.entity';
import { Any, Repository } from 'typeorm';
import { PlayerEntity } from './Entity/player.entity';
import { DeveloperEntity } from './Entity/developer.entity';
import { LoginEntity } from './Entity/login.entity';
import { LoginDTO } from './DTO/login.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,
              @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
              @InjectRepository(PlayerEntity) private playerRepository: Repository<PlayerEntity>,
              @InjectRepository(DeveloperEntity) private developerRepository: Repository<DeveloperEntity>) { }

  @Get('getAdmins')
  getAdmins() {
    return this.adminService.getAdmins()
  }
  
  @Get('getAdminByID/:adminID')
  getAdminByID(@Param('adminID') adminID: number) {
    return this.adminService.getAdminByID(adminID);
  }
  
  @Get('getAdminPicByID/:adminID')
  getAdminPicByID(@Param('adminID') adminID: number, @Res() res) {
    return this.adminService.getAdminPicByID(adminID, res);
  }
  
  @Get('getAdminsByNullName')
  getAdminsByNullName(): Promise<object | AdminEntity[] | null> {
   return this.adminService.getAdminsByNullName();
  }

  @Post('addAdmin')
  @UseInterceptors(FileInterceptor('profile_image', {
    fileFilter: (req, profile_image, cb) => {
      if (profile_image.originalname.match(/^.*\.(jpg|webp|png|jpeg|png)$/))
        cb(null, true);
      else
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    },
    limits: { fileSize: 2097152 },
    storage: diskStorage({
      destination: 'uploads/users/admin',
      filename: function (req, profile_image, cb) {
        cb(null, Date.now() + path.extname(profile_image.originalname));
      },
    })
  }))
  @UsePipes(new ValidationPipe())
  async addAdmin(@UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe({ transform: true })) body: any): Promise<object> {
    const adminDto = plainToInstance(AdminDTO, {
      username: body.username,
      email: body.email,
      NID: body.NID,
      phone: body.phone,
      profile_image: file?.filename,
    });
    await validateOrReject(adminDto);

    const loginDto = plainToInstance(LoginDTO, {
      username: body.username,
      password_hash: body.password_hash,
      role: body.role
    });
    await validateOrReject(loginDto);

      if(file) 
        adminDto.profile_image = file.filename;
      return this.adminService.addAdmin(adminDto, loginDto);
    }

    @Patch('updateAdminPhoneByID/:id/:newPhone')
    updateAdminPhoneById(@Param('id') id: number, @Param('newPhone') newPhone: string) {
      return this.adminService.updateAdminPhoneById(id, newPhone);
  }

  // @Put('updateFullAdmin/:id')
  // updateFullAdmin(@Param('id') id: number, @Body() admin: AdminDTO): string {
  //   return this.adminService.updateFullAdmin(admin, id);
  // }

  @Delete('removeAdmin')
  removeAdmin(@Query('id') id: number): Promise<object> {
    return this.adminService.removeAdmin(id);
  }
  
  @Delete('removeAdminByEmail')
  removeAdminByEmail(@Query('email') email: string): Promise<object> {
    return this.adminService.removeAdminByEmail(email);
  }

  // @Get('searchAdmin')
  // searchAdmin(@Query('key') key: string): Promise<object> {
  //   return this.adminService.searchAdmin(key);
  // }

  // @Get('getPlayer/:name')
  // getPlayer(@Param('name') name: string, @Res() res) {
  //   res.sendFile(name, {root:'./uploads/users/player'})
  //  // return this.adminService.getAdmin(name, res);
  // }

  // @Post('addPlayer')
  // @UseInterceptors(FileInterceptor('profile_image', {
  //   fileFilter: (req, profile_image, cb) => {
  //     if (profile_image.originalname.match(/^.*\.(jpg|webp|png|jpeg|png)$/))
  //       cb(null, true);
  //     else
  //       cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  //   },
  //   limits: { fileSize: 2097152 },
  //   storage: diskStorage({
  //     destination: process.cwd() + '/uploads/users/player',
  //     filename: function (req, profile_image, cb) {
  //       cb(null, Date.now() + path.extname(profile_image.originalname));
  //     },
  //   })
  // }))
  // @UsePipes(new ValidationPipe())
  // addPlayer(@UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe({ transform: true })) player: PlayerDTO): object {
  //   console.log(file);
  //   return this.adminService.addPlayer(player);
  // }

  // @Patch('updatePlayer/:newUsername')
  // updatePlayer(@Param('newUsername') newUsername: string, @Body() player: PlayerDTO): string {
  //   return this.adminService.updatePlayer(player, player.username, newUsername);
  // }

  // @Put('updatePlayer/:id')
  // updateFullPlayer(@Param('id') id: number, @Body() player: PlayerDTO): string {
  //   return this.adminService.updateFullPlayer(player, id);
  // }

  // @Delete('removePlayer')
  // removePlayer(@Query('id') id: number): string {
  //   return this.adminService.removePlayer(id);
  // }
  
  // @Get('getDeveloper/:name')
  // getDeveloper(@Param('name') name: string, @Res() res) {
  //   res.sendFile(name, {root:'./uploads/users/developer'})
  //  // return this.adminService.getAdmin(name, res);
  // }

  // @Post('addDeveloper')
  // @UseInterceptors(FileInterceptor('profile_image', {
  //   fileFilter: (req, profile_image, cb) => {
  //     if (profile_image.originalname.match(/^.*\.(jpg|webp|png|jpeg|png)$/))
  //       cb(null, true);
  //     else
  //       cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  //   },
  //   limits: { fileSize: 2097152 },
  //   storage: diskStorage({
  //     destination: process.cwd() + '/uploads/users/developer',
  //     filename: function (req, profile_image, cb) {
  //       cb(null, Date.now() + path.extname(profile_image.originalname));
  //     },
  //   })
  // }))
  // @UsePipes(new ValidationPipe())
  // addDeveloper(@UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe({ transform: true })) developer: DeveloperDTO): object {
  //   console.log(file);
  //   return this.adminService.addDeveloper(developer);
  // }

  // @Patch('updateDeveloper/:newUsername')
  // updateDeveloper(@Param('newUsername') newUsername: string, @Body() developer: DeveloperDTO): string {
  //   return this.adminService.updateDeveloper(developer, developer.username, newUsername);
  // }

  // @Put('updateAdmin/:id')
  // updateFullDeveloper(@Param('id') id: number, @Body() developer: DeveloperDTO): string {
  //   return this.adminService.updateFullDeveloper(developer, id);
  // }

  // @Delete('removeAdmin')
  // removeDeveloper(@Query('id') id: number): string {
  //   return this.adminService.removeDeveloper(id);
  // }

  // @Get('games')
  // getGames(): object {
  //   return this.adminService.getGames();
  // }

  // @Post('games/add')
  // addGame(@Body() game: GamesDTO): string {
  //   return this.adminService.addGame(game);
  // }

  // @Patch('games/update/:newTitle')
  // updateGame(@Param('newTitle') newTitle: string, @Body() game: GamesDTO): string {
  //   return this.adminService.updateGame(game, game.title, newTitle);
  // }

  // @Put('games/update/:id')
  // updateFullGame(@Param('id') id: number, @Body() game: GamesDTO): string {
  //   return this.adminService.updateFullGame(game, id);
  // }

  // @Delete('games/remove')
  // removeGame(@Query('id') id: number): string {
  //   return this.adminService.removeGame(id);
  // }

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

  // @Get('categories')
  // getCategories(): object {
  //   return this.adminService.getCategories();
  // }

  // @Post('categories/add')
  // addCategory(@Body() category: CategoriesDTO): string {
  //   return this.adminService.addCategory(category);
  // }

  // @Patch('categories/update/:id')
  // updateCategory(@Param('id') id: number, @Body() category: CategoriesDTO): string {
  //   return this.adminService.updateCategory(category, id);
  // }

  // @Put('categories/update/:id')
  // updateFullCategory(@Param('id') id: number, @Body() category: CategoriesDTO): string {
  //   return this.adminService.updateFullCategory(category, id);
  // }

  // @Delete('categories/remove')
  // removeCategory(@Query('id') id: number): string {
  //   return this.adminService.removeCategory(id);
  // }
}
