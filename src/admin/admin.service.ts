import { Injectable, Res } from '@nestjs/common';
import { GamesDTO } from './DTO/games.dto';
import { PurchasesDTO } from './DTO/purchases.dto';
import { ViewsDTO } from './DTO/views.dto';
import { PlaysDTO } from './DTO/plays.dto';
import { CategoriesDTO } from './DTO/categories.dto';
import { AdminDTO } from './DTO/admin.dto';
import { PlayerDTO } from './DTO/player.dto';
import { DeveloperDTO } from './DTO/developer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { LoginEntity } from './Entity/login.entity';
import { AdminEntity } from './Entity/admin.entity';
import { PlayerEntity } from './Entity/player.entity';
import { DeveloperEntity } from './Entity/developer.entity';
import { LoginDTO } from './DTO/login.dto';
import { stringify } from 'querystring';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(LoginEntity) private loginRepository: Repository<LoginEntity>,
              @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
              @InjectRepository(PlayerEntity) private playerRepository: Repository<PlayerEntity>,
              @InjectRepository(DeveloperEntity) private developerRepository: Repository<DeveloperEntity>) {}

  async getAdmins(): Promise<AdminEntity[]> {
    return this.adminRepository.find({ relations: ['login'] });
  }

  async getAdminByID(adminID: number): Promise<AdminEntity> {
    const exists = await this.adminRepository.findOne({where: { id: adminID }});
    if (!exists) 
      throw new Error(`Admin with id ${adminID} does not exist`);
    else 
      return exists;
  }

  async getAdminPicByID(adminID: number, @Res() res): Promise<any> {
    const admin = await this.adminRepository.findOne({ where: { id: adminID }, select: { profile_image: true }});
    if(!admin || !admin.profile_image)
      return { message: 'Admin image not found' };
    return res.sendFile(admin.profile_image, {root:'./uploads/users/admin'})
  }
  
  async getAdminsByNullName(): Promise<object | AdminEntity[] | null> {
    const admins = await this.adminRepository.find({ where: [{ username: IsNull() }, { username: "" }, { username: " " }], relations: ['login'] });
    if (admins.length === 0) 
      return {message: "No admin with null username has been found"};
    return admins;
  }

  async addAdmin(adminDto: AdminDTO, loginDto: LoginDTO): Promise<AdminEntity> {
    const adminExists = await this.adminRepository.findOneBy({ username: adminDto.username });
    const loginExists = await this.loginRepository.findOneBy({ username: loginDto.username });
    if (adminExists || loginExists) 
      throw new Error(`Admin with username ${adminDto.username} already exists`);
    else {
      // Create login entity (this will auto-generate ID)
      const login = this.loginRepository.create(loginDto);
      // Save login so @BeforeInsert runs
      const savedLogin = await this.loginRepository.save(login);

      // Create admin entity but DO NOT assign id
      const admin = this.adminRepository.create({...adminDto,
        login: savedLogin,
        id: savedLogin.id       // share primary key
      });
      // Save admin
      const savedAdmin = await this.adminRepository.save(admin);

      return savedAdmin;
      }
  }

  async updateAdminPhoneById(id: number, newPhone: number): Promise<AdminEntity | null> {
    const exists = await this.adminRepository.findOneBy({ id: id });
    if (!exists) 
      throw new Error(`Admin with id ${id} not found!`);
    else {
      await this.adminRepository.update({ id }, { phone: newPhone });
      const updatedAdmin = await this.adminRepository.findOneBy({ id: id });
      return updatedAdmin;
    }
  }

  async updateFullAdmin(id: number, adminDto: AdminDTO, loginDto: LoginDTO): Promise<AdminEntity | null> {
    const exists = await this.adminRepository.findOne({ where: { id }, relations: ['login'] });
    if (!exists) 
      throw new Error(`Admin with id ${id} not found!`);
    else{ 
      const adminExists = await this.adminRepository.findOne({ where: {username: adminDto.username, id: Not(id)} });
      const loginExists = await this.loginRepository.findOne({ where: {username: loginDto.username, id: Not(id)} });
      if (adminExists || loginExists) 
        throw new Error(`Admin with username ${adminDto.username} already exists`);
      else {
        await this.adminRepository.update({ id }, { username: adminDto.username || exists.username, 
                                                    email: adminDto.email || exists.email, 
                                                    profile_image: adminDto.profile_image || exists.profile_image, 
                                                    phone: adminDto.phone || exists.phone, 
                                                    NID: adminDto.NID || exists.NID});
        
        loginDto.ban = String(loginDto.ban) === "true";
        loginDto.activation = String(loginDto.activation) === "true";
        if (loginDto.ban) 
          loginDto.activation = false;
        if(loginDto.activation)
          loginDto.ban = false;
        await this.loginRepository.update({ id }, { username: loginDto.username || exists.login.username,
                                                    password_hash: loginDto.password_hash || exists.login.password_hash,
                                                    role: loginDto.role || exists.login.role,
                                                    activation: loginDto.activation ?? exists.login.activation,
                                                    ban: loginDto.ban ?? exists.login.ban });
        const updatedAdmin = await this.adminRepository.findOne({ where: { id }, relations: ['login'] });
        return updatedAdmin;
      }
    }
  }

  async removeAdmin(id: number): Promise<object> {
    const exists = await this.adminRepository.findOneBy({ id: id });
    if (!exists) 
      throw new Error(`Admin with id ${id} not found!`);
    else {
      await this.adminRepository.delete(id);
      return {message: `Admin with id ${id} has been deleted`};
    }
  }
  
  //lab performance
  async removeAdminByEmail(email: string): Promise<object> {
    await this.adminRepository.delete({ email: email });
    return {message: `Admin with email ${email} has been deleted`};
  }

  async searchAdmin(key: any): Promise<object> {
    let admins: object[];
    if(Number(key)) {
      admins = await this.adminRepository.find({ where: { id: Number(key) } })
      if(admins.length < 1)
        admins = await this.adminRepository.find({ where: { phone: Number(key) } })
    }
    else
      admins = await this.adminRepository.find({ where: [ { username: Like(`%${key}%`) }, { email: Like(`%${key}%`) }, { NID: Like(`%${key}%`) } ] });
    
    if(admins.length < 1) 
      return {message: `No admin found!\nTry searching with another key`};
    return admins;
  }

  async sortAdminByIDAsc(): Promise<object> {
    return await this.adminRepository.find({ order: { id: 'ASC' } });
  }
  
  async sortAdminByIDDesc(): Promise<object> {
    return await this.adminRepository.find({ order: { id: 'DESC' } });
  }
  
  async sortAdminByNameAsc(): Promise<object> {
    return await this.adminRepository.find({ order: { username: 'ASC' } });
  }
  
  async sortAdminByNameDesc(): Promise<object> {
    return await this.adminRepository.find({ order: { username: 'DESC' } });
  }

//   getPlayers(): object {
//     let player1: Object = {
//       id: 1002,
//       username: "Al Nahian Fatin",
//       email: "fatinnahian@gmail.com",
//       password_hash: "12345678",
//       role: "Admin",
//       created_at: "2025-11-03T18:21:00.000Z"
//     };
//     return player1;
//   }

//   addPlayer(player: PlayerDTO): object {
//     return { message: `${player.username} has been added successfully`, player };
//   }

//   updatePlayer(player: PlayerDTO, oldUsername: string, newUsername: string): string {
//     return `${player.id} has been updated from '${oldUsername}' to '${newUsername}' successfully`;
//   }

//   updateFullPlayer(player: PlayerDTO, id: number): string {
//     return `${id} has been updated successfully`;
//   }

//   removePlayer(id: number): string {
//     return `Player with ID ${id} has been removed successfully`;
//   }

//   getDevelopers(): object {
//     let developer1: Object = {
//       id: 1002,
//       username: "Al Nahian Fatin",
//       email: "fatinnahian@gmail.com",
//       password_hash: "12345678",
//       role: "Admin",
//       created_at: "2025-11-03T18:21:00.000Z"
//     };
//     return developer1;
//   }
  
//   addDeveloper(developer: DeveloperDTO): object {
//     return { message: `${developer.username} has been added successfully`, developer };
//   }

//   updateDeveloper(developer: DeveloperDTO, oldUsername: string, newUsername: string): string {
//     return `${developer.id} has been updated from '${oldUsername}' to '${newUsername}' successfully`;
//   }

//   updateFullDeveloper(developer: DeveloperDTO, id: number): string {
//     return `${id} has been updated successfully`;
//   }

//   removeDeveloper(id: number): string {
//     return `Developer with ID ${id} has been removed successfully`;
//   }

//   getGames(): object {
//     let game1: Object = {
//       id: 101,
//       title: "Hollow Knight: Silskong",
//       description: "A souls-like game developed by Team Cherry to test your patience & skills!",
//       price: 2000,
//       category: ["2D", "Metroidvania game"],
//       image_url: "https://static.wikia.nocookie.net/hollowknight/images/1/13/Silksong_cover.jpg/revision/latest?cb=20190214093718",
//       trailer_url: "https://www.youtube.com/watch?v=6XGeJwsUP9c",
//       view_count: 12,
//       purchase_count: 2,
//       play_count: 55,
//       published_at: "2025-11-03T18:21:00.000Z"
//     };
//     return game1;
//   }

//   addGame(game: GamesDTO): string {
//     return game.title + " has been added successfully";
//   }

//   updateGame(game: GamesDTO, oldTitle: string, newTitle: string): string {
//     return `${game.id} has been updated from '${oldTitle}' to '${newTitle}' successfully`;
//   }

//   updateFullGame(game: GamesDTO, id: number): string {
//     return `${id} has been updated successfully`;
//   }

//   removeGame(id: number): string {
//     return `Game with ID ${id} has been removed successfully`;
//   }

//   getPurchases(): object {
//     let purchase1: Object = {
//       id: 453146,
//       user_id: 4523,
//       game_id: 235,
//       purchase_date: "2025-11-03T18:21:00.000Z",
//       amount: 60
//     };
//     return purchase1;
//   }

//   addPurchase(purchase: PurchasesDTO): string {
//     return purchase.id + " has been added successfully";
//   }

//   updatePurchase(purchase: PurchasesDTO, id: number): string {
//     return `${id} has been updated successfully`;
//   }

//   updateFullPurchase(purchase: PurchasesDTO, id: number): string {
//     return `${id} has been updated successfully`;
//   }

//   deletePurchase(id: number): string {
//     return `Purchase record with ID ${id} has been deleted successfully`;
//   }

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

//   getCategories(): object {
//     let category1: Object = {
//       id: 1345,
//       name: "Action",
//       game_ids: [12, 3454],
//       description: "Any type of action games, such as fighting, shooting, etc."
//     };
//     return category1;
//   }

//   addCategory(category: CategoriesDTO): string {
//     return category.id + " has been added successfully";
//   }

//   updateCategory(category: CategoriesDTO, id: number): string {
//     return `${id} has been updated successfully`;
//   }

//   updateFullCategory(category: CategoriesDTO, id: number): string {
//     return `${id} has been updated successfully`;
//   }

//   removeCategory(id: number): string {
//     return `Play record with ID ${id} has been deleted successfully`;
//   }
}