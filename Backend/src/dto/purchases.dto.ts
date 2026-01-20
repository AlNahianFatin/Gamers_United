import { GamesEntity } from "../entities/games.entity";
import { PlayerEntity } from "../entities/player.entity";

export class PurchasesDTO {
    player?: PlayerEntity;

    game?: GamesEntity;

    purchase_date?: Date;

    amount?: number;
}