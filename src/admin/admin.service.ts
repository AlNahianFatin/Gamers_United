import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { GamesDTO } from './DTO/games.dto';
import { PurchasesDTO } from './DTO/purchases.dto';
import { ViewsDTO } from './DTO/views.dto';
import { PlaysDTO } from './DTO/plays.dto';
import { CategoriesDTO } from './DTO/categories.dto';
import { AdminDTO } from './DTO/admin.dto';
import { PlayerDTO } from './DTO/player.dto';
import { DeveloperDTO } from './DTO/developer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './Entity/admin.entity';
import { PlayerEntity } from './Entity/player.entity';
import { DeveloperEntity } from './Entity/developer.entity';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
              @InjectRepository(PlayerEntity) private playerRepository: Repository<PlayerEntity>,
              @InjectRepository(DeveloperEntity) private developerRepository: Repository<DeveloperEntity>) {}

  async getAdmins(): Promise<AdminEntity[]> {
    // let admin1: Object = {
    //   id: 1002,
    //   username: "Al Nahian Fatin",
    //   email: "fatinnahian@gmail.com",
    //   password_hash: "12345678",
    //   role: "Admin",
    //   created_at: "2025-11-03T18:21:00.000Z"
    // };
    return this.adminRepository.find();
  }
  
  async addAdmin(admin: AdminEntity): Promise<object> {
    return this.adminRepository.save(admin);
  }

  updateAdmin(admin: AdminDTO, oldUsername: string, newUsername: string): string {
    return `${admin.id} has been updated from '${oldUsername}' to '${newUsername}' successfully`;
  }

  updateFullAdmin(admin: AdminDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  removeAdmin(id: number): string {
    return `Admin with ID ${id} has been removed successfully`;
  }

  // getAdmin(name: string, res: any) {
  //   const filePath = path.join(process.cwd(), 'uploads', 'users', 'admin', name);
  //   console.log('Serving file:', filePath);
  //   return res.sendFile(filePath);
  // }

  getPlayers(): object {
    let player1: Object = {
      id: 1002,
      username: "Al Nahian Fatin",
      email: "fatinnahian@gmail.com",
      password_hash: "12345678",
      role: "Admin",
      created_at: "2025-11-03T18:21:00.000Z"
    };
    return player1;
  }

  addPlayer(player: PlayerDTO): object {
    return { message: `${player.username} has been added successfully`, player };
  }

  updatePlayer(player: PlayerDTO, oldUsername: string, newUsername: string): string {
    return `${player.id} has been updated from '${oldUsername}' to '${newUsername}' successfully`;
  }

  updateFullPlayer(player: PlayerDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  removePlayer(id: number): string {
    return `Player with ID ${id} has been removed successfully`;
  }

  getDevelopers(): object {
    let developer1: Object = {
      id: 1002,
      username: "Al Nahian Fatin",
      email: "fatinnahian@gmail.com",
      password_hash: "12345678",
      role: "Admin",
      created_at: "2025-11-03T18:21:00.000Z"
    };
    return developer1;
  }
  
  addDeveloper(developer: DeveloperDTO): object {
    return { message: `${developer.username} has been added successfully`, developer };
  }

  updateDeveloper(developer: DeveloperDTO, oldUsername: string, newUsername: string): string {
    return `${developer.id} has been updated from '${oldUsername}' to '${newUsername}' successfully`;
  }

  updateFullDeveloper(developer: DeveloperDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  removeDeveloper(id: number): string {
    return `Developer with ID ${id} has been removed successfully`;
  }

  getGames(): object {
    let game1: Object = {
      id: 101,
      title: "Hollow Knight: Silskong",
      description: "A souls-like game developed by Team Cherry to test your patience & skills!",
      price: 2000,
      category: ["2D", "Metroidvania game"],
      image_url: "https://static.wikia.nocookie.net/hollowknight/images/1/13/Silksong_cover.jpg/revision/latest?cb=20190214093718",
      trailer_url: "https://www.youtube.com/watch?v=6XGeJwsUP9c",
      view_count: 12,
      purchase_count: 2,
      play_count: 55,
      published_at: "2025-11-03T18:21:00.000Z"
    };
    return game1;
  }

  addGame(game: GamesDTO): string {
    return game.title + " has been added successfully";
  }

  updateGame(game: GamesDTO, oldTitle: string, newTitle: string): string {
    return `${game.id} has been updated from '${oldTitle}' to '${newTitle}' successfully`;
  }

  updateFullGame(game: GamesDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  removeGame(id: number): string {
    return `Game with ID ${id} has been removed successfully`;
  }

  getPurchases(): object {
    let purchase1: Object = {
      id: 453146,
      user_id: 4523,
      game_id: 235,
      purchase_date: "2025-11-03T18:21:00.000Z",
      amount: 60
    };
    return purchase1;
  }

  addPurchase(purchase: PurchasesDTO): string {
    return purchase.id + " has been added successfully";
  }

  updatePurchase(purchase: PurchasesDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  updateFullPurchase(purchase: PurchasesDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  deletePurchase(id: number): string {
    return `Purchase record with ID ${id} has been deleted successfully`;
  }

  getViews(): object {
    let view1: Object = {
      id: 132,
      user_id: 14,
      game_id: 5436,
      view_count: 12
    };
    return view1;
  }

  addView(view: ViewsDTO): string {
    return view.id + " has been added successfully";
  }

  updateView(view: ViewsDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  updateFullView(view: ViewsDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  deleteView(id: number): string {
    return `View record with ID ${id} has been deleted successfully`;
  }

  getPlays(): object {
    let play1: Object = {
      id: 132,
      user_id: 14,
      game_id: 5436,
      duration: 12
    };
    return play1;
  }

  addPlay(play: PlaysDTO): string {
    return play.id + " has been added successfully";
  }

  updatePlay(play: PlaysDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  updateFullPlay(play: PlaysDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  deletePlay(id: number): string {
    return `Play record with ID ${id} has been deleted successfully`;
  }

  getCategories(): object {
    let category1: Object = {
      id: 1345,
      name: "Action",
      game_ids: [12, 3454],
      description: "Any type of action games, such as fighting, shooting, etc."
    };
    return category1;
  }

  addCategory(category: CategoriesDTO): string {
    return category.id + " has been added successfully";
  }

  updateCategory(category: CategoriesDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  updateFullCategory(category: CategoriesDTO, id: number): string {
    return `${id} has been updated successfully`;
  }

  removeCategory(id: number): string {
    return `Play record with ID ${id} has been deleted successfully`;
  }
}
