import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { LoginEntity } from "./login.entity";

@Entity("player")
export class PlayerEntity {
    @PrimaryColumn()
    id: number;

    @Column({type: "varchar", nullable: false, unique: true})
    username: string;

    @Column({nullable: true})
    email: string;
    
    @Column({nullable: true})
    profile_image: string;
    
    @Column({nullable: true})
    NID: string;

    @Column({type: "bigint", nullable: true})
    phone: number;
    
    @CreateDateColumn({nullable: true})
    created_at: Date;

    @OneToOne(() => LoginEntity, login => login.player)
    login: LoginEntity;
}