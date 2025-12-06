import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { LoginEntity } from "../entities/login.entity";
import { GamesEntity } from "../entities/games.entity";

export class DeveloperDTO {
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    @Matches(/^[a-zA-Z0-9\s\-\_\.]*$/, {
        message: 'Username should only contain alphabets, digits, hyphens, underscores, dots and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    username: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @Matches(/@.*\.(xyz|com|edu)$/i, {
        message: 'Email must contain @ and a .xyz or .com or .edu domain',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    email: string;

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

    login?: LoginEntity;

    games?: GamesEntity[];
}