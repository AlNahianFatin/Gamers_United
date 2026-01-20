import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoriesEntity } from "./categories.entity";
import { DeveloperEntity } from "./developer.entity";
import { PurchasesEntity } from "./purchases.entity";

@Entity("games")
export class GamesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false, unique: true })
    title: string;

    @Column({ nullable: true, length: 200 })
    description: string;

    @Column({ type: "decimal", nullable: false, default: 0 })
    price: number;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    trailer: string;

    @Column({ nullable: true })
    game: string;

    @CreateDateColumn({ nullable: true })
    published_at: Date;

    @Column({ nullable: true, default: 0 })
    view_count: number;

    @Column({ nullable: true, default: 0 })
    play_count: number;

    @Column({ nullable: true, default: 0 })
    purchase_count: number;

    @ManyToMany(() => CategoriesEntity, category => category.games)
    categories: CategoriesEntity[];

    @ManyToOne(() => DeveloperEntity, developer => developer.games, { onDelete: 'CASCADE', nullable: false })
    developer: DeveloperEntity;

    @OneToMany(() => PurchasesEntity, purchase => purchase.game)
    purchases?: PurchasesEntity[];
}