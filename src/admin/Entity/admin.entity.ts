import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { LoginEntity } from "./login.entity";

@Entity("admin")
export class AdminEntity {
    @PrimaryColumn()
    id: number;

    @Column({type: "varchar", nullable: true})
    username: string;

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

    @ManyToOne(() => LoginEntity, login => login.admins, {cascade: true})
    @JoinColumn()
    login: LoginEntity;
}