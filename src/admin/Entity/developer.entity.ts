import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { LoginEntity } from "./login.entity";

@Entity("developer")
export class DeveloperEntity {
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
    
    @Column({nullable: true})
    phone: string;

    @CreateDateColumn({nullable: true})
    created_at: Date;

    @OneToOne(() => LoginEntity, login => login.developer, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn({ name: "id" })
    login: LoginEntity;
}