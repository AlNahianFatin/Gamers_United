import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("admin")
export class AdminEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;
    
    @Column()
    profile_image_url: string;
    
    @Column()
    NID: number;
    
    @Column()
    created_at: Date;
}