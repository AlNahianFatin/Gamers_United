import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { GamesEntity } from "./games.entity";

@Entity("categories")
export class CategoriesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", nullable: false, unique: true})
    name: string;
    
    @Column({nullable: true, length: 200})
    description: string;
    
    @ManyToMany(() => GamesEntity, game => game.categories, {cascade: true})
    @JoinTable()
    games: GamesEntity[];
}