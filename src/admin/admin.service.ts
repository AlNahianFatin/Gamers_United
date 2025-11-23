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
import path from 'path';
import { promises } from 'fs';

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
  
  async getAdminsByNullName(): Promise<object | AdminEntity[]> {
    const admins = await this.adminRepository.find({ where: [{ username: IsNull() }, { username: "" }, { username: " " }], relations: ['login'] });
    if (admins.length === 0) 
      return {message: "No admin with null username has been found"};
    return admins;
  }

  async addAdmin(adminDto: AdminDTO, loginDto: LoginDTO): Promise<AdminEntity> {
    const adminExists = await this.adminRepository.findOneBy({ username: adminDto.username });
    const loginExists = await this.loginRepository.findOneBy({ username: loginDto.username });
    if (adminExists || loginExists) 
      throw new Error(`User with username ${adminDto.username} already exists`);
    else {
      loginDto.role = "admin";
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

  async updateAdminPhoneById(id: any, newPhone: any): Promise<AdminEntity | null> {
    if(!Number(id))
      throw new Error("Please enter a valid ID number");
    id = Number(id)
    const exists = await this.adminRepository.findOneBy({ id });
    if (!exists) 
      throw new Error(`Admin with id ${id} not found!`);
    else {
      if(!Number(newPhone))
        throw new Error("Please enter a valid Phone No.");
      if(newPhone.length !== 11)
        throw new Error('Phone No. must be a valid format of 11 digits');
      await this.adminRepository.update({ id }, { phone: newPhone });
      return await this.adminRepository.findOneBy({ id: id });
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
        throw new Error(`User with username ${adminDto.username} already exists`);
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
        loginDto.role = "admin";
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
    const admin = await this.adminRepository.findOneBy({ id: id });
    if (!admin) 
      throw new Error(`Admin with id ${id} not found!`);
    else {
      if (admin.profile_image) {
        const filePath = path.join('uploads/users/admin', admin.profile_image);
        try {
          await promises.access(filePath); 
          await promises.unlink(filePath);
        } 
        catch (err) {
          console.warn(`Profile image file not found or already deleted: ${filePath}`);
        }
      }
      await this.loginRepository.delete(id);
      return {message: `Admin with id ${id} has been deleted`};
    }
  }
  
  //lab performance
  async removeAdminByEmail(email: string): Promise<object> {
    const admins = await this.adminRepository.find({ where: { email }, relations: ['login'] });
    if (!admins || admins.length < 1)
      throw new Error(`No admins found with email ${email}!`);
    for (const admin of admins) {
      if (admin.profile_image) {
        const filePath = path.join('uploads/users/admin', admin.profile_image);
        try {
          await promises.access(filePath);
          await promises.unlink(filePath); 
        } 
        catch (err) {
          console.warn(`Profile image not found or already deleted: ${filePath}`);
        }
      }
    }
    const loginIds = admins.filter(admin => admin.login).map(admin => admin.login.id);
    if (loginIds.length > 0) 
      await this.loginRepository.delete(loginIds);
    return { message: `All admins with email ${email} has been deleted` };
  }


  async searchAdmin(key: any): Promise<object> {
    let admins: object[];
    if(Number(key)) 
      admins = await this.adminRepository.find({ where: { id: Number(key) } })
    else
      admins = await this.adminRepository.find({ where: [ { username: Like(`%${key}%`) }, { email: Like(`%${key}%`) }, { NID: Like(`%${key}%`) }, { phone: Like(`%${key}%`) } ] });
    
    if(admins.length < 1) 
      return {message: `No admin found! Try searching with another key`};
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
  
  async getPlayers(): Promise<PlayerEntity[]> {
    return this.playerRepository.find({ relations: ['login'] });
  }

  async getPlayerByID(playerID: number): Promise<PlayerEntity> {
    const exists = await this.playerRepository.findOne({where: { id: playerID }});
    if (!exists) 
      throw new Error(`Player with id ${playerID} does not exist`);
    else 
      return exists;
  }

  async getPlayerPicByID(playerID: number, @Res() res): Promise<any> {
    const player = await this.playerRepository.findOne({ where: { id: playerID }, select: { profile_image: true }});
    if(!player || !player.profile_image)
      return { message: 'Player image not found' };
    return res.sendFile(player.profile_image, {root:'./uploads/users/player'})
  }
  
  async getPlayersByNullName(): Promise<object | PlayerEntity[]> {
    const players = await this.playerRepository.find({ where: [{ username: IsNull() }, { username: "" }, { username: " " }], relations: ['login'] });
    if (players.length === 0) 
      return {message: "No player with null username has been found"};
    return players;
  }

  async addPlayer(playerDto: PlayerDTO, loginDto: LoginDTO): Promise<PlayerEntity> {
    const playerExists = await this.playerRepository.findOneBy({ username: playerDto.username });
    const loginExists = await this.loginRepository.findOneBy({ username: loginDto.username });
    if (playerExists || loginExists) 
      throw new Error(`User with username ${playerDto.username} already exists`);
    else {
      loginDto.role = "player";
      // Create login entity (this will auto-generate ID)
      const login = this.loginRepository.create(loginDto);
      // Save login so @BeforeInsert runs
      const savedLogin = await this.loginRepository.save(login);

      // Create admin entity but DO NOT assign id
      const player = this.playerRepository.create({...playerDto,
        login: savedLogin,
        id: savedLogin.id       // share primary key
      });
      // Save admin
      const savedPlayer = await this.playerRepository.save(player);

      return savedPlayer;
      }
  }

  async updatePlayerPhoneByID(id: any, newPhone: any): Promise<PlayerEntity | null> {
    if(!Number(id))
      throw new Error("Please enter a valid ID number");
    id = Number(id)
    const exists = await this.playerRepository.findOneBy({ id });
    if (!exists) 
      throw new Error(`Player with id ${id} not found!`);
    else {
      if(!Number(newPhone))
        throw new Error("Please enter a valid Phone No.");
      if(newPhone.length !== 11)
        throw new Error('Phone No. must be a valid format of 11 digits');
      await this.playerRepository.update({ id }, { phone: newPhone });
      return await this.playerRepository.findOneBy({ id: id });
    }
  }

  async updateFullPlayer(id: number, playerDto: PlayerDTO, loginDto: LoginDTO): Promise<PlayerEntity | null> {
    const exists = await this.playerRepository.findOne({ where: { id }, relations: ['login'] });
    if (!exists) 
      throw new Error(`Player with id ${id} not found!`);
    else{ 
      const playerExists = await this.playerRepository.findOne({ where: {username: playerDto.username, id: Not(id)} });
      const loginExists = await this.loginRepository.findOne({ where: {username: loginDto.username, id: Not(id)} });
      if (playerExists || loginExists) 
        throw new Error(`User with username ${playerDto.username} already exists`);
      else {
        await this.playerRepository.update({ id }, { username: playerDto.username || exists.username, 
                                                    email: playerDto.email || exists.email, 
                                                    profile_image: playerDto.profile_image || exists.profile_image, 
                                                    phone: playerDto.phone || exists.phone, 
                                                    NID: playerDto.NID || exists.NID});
        
        loginDto.ban = String(loginDto.ban) === "true";
        loginDto.activation = String(loginDto.activation) === "true";
        if (loginDto.ban) 
          loginDto.activation = false;
        if(loginDto.activation)
          loginDto.ban = false;
        loginDto.role = "player";
        await this.loginRepository.update({ id }, { username: loginDto.username || exists.login.username,
                                                    password_hash: loginDto.password_hash || exists.login.password_hash,
                                                    role: loginDto.role || exists.login.role,
                                                    activation: loginDto.activation ?? exists.login.activation,
                                                    ban: loginDto.ban ?? exists.login.ban });
        const updatedPlayer = await this.playerRepository.findOne({ where: { id }, relations: ['login'] });
        return updatedPlayer;
      }
    }
  }

  async removePlayer(id: number): Promise<object> {
    const player = await this.playerRepository.findOneBy({ id: id });
    if (!player) 
      throw new Error(`Player with id ${id} not found!`);
    else {
      if (player.profile_image) {
        const filePath = path.join('uploads/users/player', player.profile_image);
        try {
          await promises.access(filePath); 
          await promises.unlink(filePath);
        } 
        catch (err) {
          console.warn(`Profile image file not found or already deleted: ${filePath}`);
        }
      }
      await this.loginRepository.delete(id);
      return {message: `Player with id ${id} has been deleted`};
    }
  }
  
  //lab performance
  async removePlayerByEmail(email: string): Promise<object> {
    const players = await this.playerRepository.find({ where: { email }, relations: ['login'] });
    if (!players || players.length < 1)
      throw new Error(`No players found with email ${email}!`);
    for (const player of players) {
      if (player.profile_image) {
        const filePath = path.join('uploads/users/player', player.profile_image);
        try {
          await promises.access(filePath);
          await promises.unlink(filePath); 
        } 
        catch (err) {
          console.warn(`Profile image not found or already deleted: ${filePath}`);
        }
      }
    }
    const loginIds = players.filter(player => player.login).map(player => player.login.id);
    if (loginIds.length > 0) 
      await this.loginRepository.delete(loginIds);
    return { message: `All players with email ${email} has been deleted` };
  }

  async searchPlayer(key: any): Promise<object> {
    let players: object[];
    if(Number(key)) 
      players = await this.playerRepository.find({ where: { id: Number(key) } })
    else
      players = await this.playerRepository.find({ where: [ { username: Like(`%${key}%`) }, { email: Like(`%${key}%`) }, { NID: Like(`%${key}%`) }, { phone: Like(`%${key}%`) } ] });
    
    if(players.length < 1) 
      return {message: `No player found! Try searching with another key`};
    return players;
  }

  async sortPlayerByIDAsc(): Promise<object> {
    return await this.playerRepository.find({ order: { id: 'ASC' } });
  }
  
  async sortPlayerByIDDesc(): Promise<object> {
    return await this.playerRepository.find({ order: { id: 'DESC' } });
  }
  
  async sortPlayerByNameAsc(): Promise<object> {
    return await this.playerRepository.find({ order: { username: 'ASC' } });
  }
  
  async sortPlayerByNameDesc(): Promise<object> {
    return await this.playerRepository.find({ order: { username: 'DESC' } });
  }
  
  async getDevelopers(): Promise<DeveloperEntity[]> {
    return this.developerRepository.find({ relations: ['login'] });
  }

  async getDeveloperByID(developerID: number): Promise<DeveloperEntity> {
    const exists = await this.developerRepository.findOne({where: { id: developerID }});
    if (!exists) 
      throw new Error(`Developer with id ${developerID} does not exist`);
    else 
      return exists;
  }

  async getDeveloperPicByID(developerID: number, @Res() res): Promise<any> {
    const developer = await this.developerRepository.findOne({ where: { id: developerID }, select: { profile_image: true }});
    if(!developer || !developer.profile_image)
      return { message: 'Developer image not found' };
    return res.sendFile(developer.profile_image, {root:'./uploads/users/developer'})
  }
  
  async getDevelopersByNullName(): Promise<object | DeveloperEntity[]> {
    const developers = await this.developerRepository.find({ where: [{ username: IsNull() }, { username: "" }, { username: " " }], relations: ['login'] });
    if (developers.length === 0) 
      return {message: "No developer with null username has been found"};
    return developers;
  }

  async addDeveloper(developerDto: DeveloperDTO, loginDto: LoginDTO): Promise<DeveloperEntity> {
    const developerExists = await this.developerRepository.findOneBy({ username: developerDto.username });
    const loginExists = await this.loginRepository.findOneBy({ username: loginDto.username });
    if (developerExists || loginExists) 
      throw new Error(`User with username ${developerDto.username} already exists`);
    else {
      loginDto.role = "developer";
      // Create login entity (this will auto-generate ID)
      const login = this.loginRepository.create(loginDto);
      // Save login so @BeforeInsert runs
      const savedLogin = await this.loginRepository.save(login);

      // Create admin entity but DO NOT assign id
      const developer = this.developerRepository.create({...developerDto,
        login: savedLogin,
        id: savedLogin.id       // share primary key
      });
      // Save admin
      const savedDeveloper = await this.developerRepository.save(developer);

      return savedDeveloper;
      }
  }

  async updateDeveloperPhoneByID(id: any, newPhone: any): Promise<DeveloperEntity | null> {
    if(!Number(id))
      throw new Error("Please enter a valid ID number");
    id = Number(id)
    const exists = await this.developerRepository.findOneBy({ id });
    if (!exists) 
      throw new Error(`Developer with id ${id} not found!`);
    else {
      if(!Number(newPhone))
        throw new Error("Please enter a valid Phone No.");
      if(newPhone.length !== 11)
        throw new Error('Phone No. must be a valid format of 11 digits');
      await this.developerRepository.update({ id }, { phone: newPhone });
      return await this.developerRepository.findOneBy({ id: id });
    }
  }

  async updateFullDeveloper(id: number, developerDto: DeveloperDTO, loginDto: LoginDTO): Promise<DeveloperEntity | null> {
    const exists = await this.developerRepository.findOne({ where: { id }, relations: ['login'] });
    if (!exists) 
      throw new Error(`Developer with id ${id} not found!`);
    else{ 
      const developerExists = await this.developerRepository.findOne({ where: {username: developerDto.username, id: Not(id)} });
      const loginExists = await this.loginRepository.findOne({ where: {username: loginDto.username, id: Not(id)} });
      if (developerExists || loginExists) 
        throw new Error(`User with username ${developerDto.username} already exists`);
      else {
        await this.developerRepository.update({ id }, { username: developerDto.username || exists.username, 
                                                    email: developerDto.email || exists.email, 
                                                    profile_image: developerDto.profile_image || exists.profile_image, 
                                                    phone: developerDto.phone || exists.phone, 
                                                    NID: developerDto.NID || exists.NID});
        
        loginDto.ban = String(loginDto.ban) === "true";
        loginDto.activation = String(loginDto.activation) === "true";
        if (loginDto.ban) 
          loginDto.activation = false;
        if(loginDto.activation)
          loginDto.ban = false;
        loginDto.role = "developer";
        await this.loginRepository.update({ id }, { username: loginDto.username || exists.login.username,
                                                    password_hash: loginDto.password_hash || exists.login.password_hash,
                                                    role: loginDto.role || exists.login.role,
                                                    activation: loginDto.activation ?? exists.login.activation,
                                                    ban: loginDto.ban ?? exists.login.ban });
        const updatedDeveloper = await this.developerRepository.findOne({ where: { id }, relations: ['login'] });
        return updatedDeveloper;
      }
    }
  }

  async removeDeveloper(id: number): Promise<object> {
    const developer = await this.developerRepository.findOneBy({ id: id });
    if (!developer) 
      throw new Error(`Developer with id ${id} not found!`);
    else {
      if (developer.profile_image) {
        const filePath = path.join('uploads/users/developer', developer.profile_image);
        try {
          await promises.access(filePath); 
          await promises.unlink(filePath);
        } 
        catch (err) {
          console.warn(`Profile image file not found or already deleted: ${filePath}`);
        }
      }
      await this.loginRepository.delete(id);
      return {message: `Developer with id ${id} has been deleted`};
    }
  }
  
  //lab performance
  async removeDeveloperByEmail(email: string): Promise<object> {
    const developers = await this.developerRepository.find({ where: { email }, relations: ['login'] });
    if (!developers || developers.length < 1)
      throw new Error(`No developers found with email ${email}!`);
    for (const developer of developers) {
      if (developer.profile_image) {
        const filePath = path.join('uploads/users/developer', developer.profile_image);
        try {
          await promises.access(filePath);
          await promises.unlink(filePath); 
        } 
        catch (err) {
          console.warn(`Profile image not found or already deleted: ${filePath}`);
        }
      }
    }
    const loginIds = developers.filter(developer => developer.login).map(developer => developer.login.id);
    if (loginIds.length > 0) 
      await this.loginRepository.delete(loginIds);
    return { message: `All developers with email ${email} has been deleted` };
  }

  async searchDeveloper(key: any): Promise<object> {
    let developers: object[];
    if(Number(key)) 
      developers = await this.developerRepository.find({ where: { id: Number(key) } })
    else
      developers = await this.developerRepository.find({ where: [ { username: Like(`%${key}%`) }, { email: Like(`%${key}%`) }, { NID: Like(`%${key}%`) }, { phone: Like(`%${key}%`) } ] });
    
    if(developers.length < 1) 
      return {message: `No developer found! Try searching with another key`};
    return developers;
  }

  async sortDeveloperByIDAsc(): Promise<object> {
    return await this.developerRepository.find({ order: { id: 'ASC' } });
  }
  
  async sortDeveloperByIDDesc(): Promise<object> {
    return await this.developerRepository.find({ order: { id: 'DESC' } });
  }
  
  async sortDeveloperByNameAsc(): Promise<object> {
    return await this.developerRepository.find({ order: { username: 'ASC' } });
  }
  
  async sortDeveloperByNameDesc(): Promise<object> {
    return await this.developerRepository.find({ order: { username: 'DESC' } });
  }

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