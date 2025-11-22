import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { LoginEntity } from "./login.entity";

@Entity("developer")
export class DeveloperEntity {
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

    @OneToOne(() => LoginEntity, login => login.admin)
    login: LoginEntity;
}