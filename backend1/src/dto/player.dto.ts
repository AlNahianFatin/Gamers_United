import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import { LoginEntity } from "../entities/login.entity";
import { GamesEntity } from "../entities/games.entity";
import { PurchasesEntity } from "../entities/purchases.entity";

export class PlayerDTO {
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    @Matches(/^[a-zA-Z0-9\s\-\_\.]*$/, {
        message: 'Username should only contain alphabets, digits, hyphens, underscores, dots and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    username: string;

    image?: string;

    @IsNotEmpty({ message: 'NID is required' })
    @Matches(/^\d{10}$/, {
        message: 'NID must be a valid format of 10 digits'
    })
    @Transform(({ value }) => (value !== undefined && value !== null ? String(value).trim() : value))
    NID: string;

    @IsNotEmpty({ message: 'Phone No. is required' })
    @Matches(/^\d{11}$/, {
        message: 'Phone No. must be a valid format of 11 digits'
    })
    @Transform(({ value }) => (value !== undefined && value !== null ? String(value).trim() : value))
    phone: string;

    created_at?: Date;

    game_ids?: number[];

    login?: LoginEntity;   
    
    purchases?: PurchasesEntity[];
}