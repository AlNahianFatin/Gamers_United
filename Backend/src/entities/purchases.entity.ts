import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GamesEntity } from "./games.entity";
import { PlayerEntity } from "./player.entity";

@Entity("purchases")
export class PurchasesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlayerEntity, player => player.purchases)
    player: PlayerEntity;

    @ManyToOne(() => GamesEntity, game => game.purchases)
    game: GamesEntity;

    @CreateDateColumn({ nullable: true })
    purchase_date: Date;

    @Column({ type: 'decimal', nullable: true, default: 0 })
    amount: number;
}