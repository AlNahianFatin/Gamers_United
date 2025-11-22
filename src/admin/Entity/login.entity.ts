import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { AdminEntity } from "./admin.entity";
import { PlayerEntity } from "./player.entity";
import { DeveloperEntity } from "./developer.entity";

@Entity("login")
export class LoginEntity {
    @PrimaryColumn()
    id: number;

    @Column({type: "varchar", unique: true})
    username: string;
    
    @Column()
    password_hash: string;
    
    @Column({type: "varchar", default: "player"})
    role: string;
    
    @Column({type: "boolean", default: true, nullable: true})
    activation: boolean;
    
    @Column({type: "boolean", default: false, nullable: true})
    ban: boolean;

    @BeforeInsert() 
    generateID() {
        this.id = Number(String(Date.now()).slice(-8)) + Math.floor(Math.random() * 10);
    }

    @OneToOne(() => AdminEntity, admin => admin.login, {cascade: true})
    @JoinColumn()
    admin: AdminEntity;
    
    @OneToOne(() => PlayerEntity, player => player.login, {cascade: true})
    @JoinColumn()
    player: PlayerEntity;
    
    @OneToOne(() => DeveloperEntity, developer => developer.login, {cascade: true})
    @JoinColumn()
    developer: DeveloperEntity;
}