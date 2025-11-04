import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GamesDTO } from './games.dto';
import { UsersDTO } from './users.dto';
import { PurchasesDTO } from './purchases.dto';
import { ViewsDTO } from './views.dto';
import { PlaysDTO } from './plays.dto';
import { CategoriesDTO } from './categories.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('games')
  getGames(): object {
    return this.adminService.getGames();
  }

  @Post('games/add')
  addGame(@Body() game: GamesDTO): string {
    return this.adminService.addGame(game);
  }

  @Patch('games/update/:newTitle')
  updateGame(@Param('newTitle') newTitle: string, @Body() game: GamesDTO): string {
    return this.adminService.updateGame(game, game.title, newTitle);
  }
  
  @Put('games/update/:id')
  updateFullGame(@Param('id') id: number, @Body() game: GamesDTO): string {
    return this.adminService.updateFullGame(game, id);
  }
  
  @Delete('games/remove')
  removeGame(@Query('id') id: number): string {
    return this.adminService.removeGame(id);
  }
  
  @Get('users')
  getUsers(): object {
    return this.adminService.getUsers();
  }

  @Post('users/add')
  addUser(@Body() user: UsersDTO): string {
    return this.adminService.addUser(user);
  }

  @Patch('users/update/:newUsername')
  updateUser(@Param('newUsername') newUsername: string, @Body() user: UsersDTO): string {
    return this.adminService.updateUser(user, user.username, newUsername);
  }
  
  @Put('users/update/:id')
  updateFullUser(@Param('id') id: number, @Body() user: UsersDTO): string {
    return this.adminService.updateFullUser(user, id);
  }
  
  @Delete('users/remove')
  removeUser(@Query('id') id: number): string {
    return this.adminService.removeUser(id);
  }
  
  @Get('purchases')
  getPurchases(): object {
    return this.adminService.getPurchases();
  }

  @Post('purchases/add')
  addPurchase(@Body() purchase: PurchasesDTO): string {
    return this.adminService.addPurchase(purchase);
  }

  @Patch('purchases/update/:id')
  updatePurchase(@Param('id') id: number, @Body() purchase: PurchasesDTO): string {
    return this.adminService.updatePurchase(purchase, id);
  }
  
  @Put('purchases/update/:id')
  updateFullPurchase(@Param('id') id: number, @Body() purchase: PurchasesDTO): string {
    return this.adminService.updateFullPurchase(purchase, id);
  }
  
  @Delete('purchases/remove')
  deletePurchase(@Query('id') id: number): string {
    return this.adminService.deletePurchase(id);
  }
  
  @Get('views')
  getViews(): object {
    return this.adminService.getViews();
  }

  @Post('views/add')
  addView(@Body() view: ViewsDTO): string {
    return this.adminService.addView(view);
  }

  @Patch('views/update/:id')
  updateView(@Param('id') id: number, @Body() view: ViewsDTO): string {
    return this.adminService.updateView(view, id);
  }
  
  @Put('views/update/:id')
  updateFullView(@Param('id') id: number, @Body() view: ViewsDTO): string {
    return this.adminService.updateFullView(view, id);
  }
  
  @Delete('views/remove')
  deleteView(@Query('id') id: number): string {
    return this.adminService.deleteView(id);
  }
  
  @Get('plays')
  getPlays(): object {
    return this.adminService.getPlays();
  }

  @Post('plays/add')
  addPlay(@Body() play: PlaysDTO): string {
    return this.adminService.addPlay(play);
  }

  @Patch('plays/update/:id')
  updatePlay(@Param('id') id: number, @Body() play: PlaysDTO): string {
    return this.adminService.updatePlay(play, id);
  }
  
  @Put('plays/update/:id')
  updateFullPlay(@Param('id') id: number, @Body() play: PlaysDTO): string {
    return this.adminService.updateFullPlay(play, id);
  }
  
  @Delete('plays/remove')
  deletePlay(@Query('id') id: number): string {
    return this.adminService.deletePlay(id);
  }
  
  @Get('categories')
  getCategories(): object {
    return this.adminService.getCategories();
  }

  @Post('categories/add')
  addCategory(@Body() category: CategoriesDTO): string {
    return this.adminService.addCategory(category);
  }

  @Patch('categories/update/:id')
  updateCategory(@Param('id') id: number, @Body() category: CategoriesDTO): string {
    return this.adminService.updateCategory(category, id);
  }
  
  @Put('categories/update/:id')
  updateFullCategory(@Param('id') id: number, @Body() category: CategoriesDTO): string {
    return this.adminService.updateFullCategory(category, id);
  }
  
  @Delete('categories/remove')
  removeCategory(@Query('id') id: number): string {
    return this.adminService.removeCategory(id);
  }
}
