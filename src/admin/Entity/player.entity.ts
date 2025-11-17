import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { LoginEntity } from "./login.entity";

@Entity("player")
export class PlayerEntity {
    @PrimaryColumn()
    id: number;

    @Column({type: "varchar", nullable: true})
    username: string;

    @Column()
    email: string;
    
    @Column()
    profile_image: string;
    
    @Column()
    NID: number;

    @Column({type: "bigint"})
    phone: string;
    
    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => LoginEntity, login => login.admins, {cascade: true})
    @JoinColumn()
    login: LoginEntity;
}