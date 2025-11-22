import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { LoginEntity } from "./login.entity";

@Entity("player")
export class PlayerEntity {
    @PrimaryColumn()
    id?: number;

    @Column({type: "varchar", nullable: true, unique: true})
    username?: string;

    @Column({nullable: true})
    email: string;
    
    @Column({nullable: true})
    profile_image: string;
    
    @Column({nullable: true})
    NID: number;

    @Column({type: "bigint", nullable: true})
    phone: string;
    
    @CreateDateColumn({nullable: true})
    created_at: Date;

    @OneToOne(() => LoginEntity, login => login.player)
    // @JoinColumn()
    login: LoginEntity;

    // @BeforeInsert() 
    // generateID() {
    //     this.id = Number(new Date()) + Math.floor(Math.random() * 100);
    // }
}