import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { AdminEntity } from "./admin.entity";
import { PlayerEntity } from "./player.entity";
import { DeveloperEntity } from "./developer.entity";

@Entity("login")
export class LoginEntity {
    @PrimaryColumn()
    id: number;

    @Column({type: "varchar", nullable: true})
    username: string;
    
    @Column()
    password_hash: string;
    
    @Column()
    role: string;
    
    @Column({type: "boolean", default: true})
    activation: boolean;
    
    @Column({type: "boolean", default: false})
    ban: boolean;

    @BeforeInsert() 
    generateID() {
        this.id = Number(new Date()) + Math.floor(Math.random() * 100);
    }

    @OneToMany(() => AdminEntity, admin => admin.login)
    admins: AdminEntity[];
    
    @OneToMany(() => PlayerEntity, player => player.login)
    players: PlayerEntity[];

    @OneToMany(() => DeveloperEntity, developer => developer.login)
    developers: DeveloperEntity[];
}