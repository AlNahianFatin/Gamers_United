import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Matches, IsArray } from 'class-validator';
import { GamesEntity } from '../entities/games.entity';

export class CategoriesDTO {
    @IsString()
    @IsNotEmpty({ message: 'Category name is required' })
    @Matches(/^[a-zA-Z0-9\s\-\_]*$/, {
        message: 'Category name should only contain alphabets, numbers, hyphens, underscores and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    name: string;

    @Transform(({ value }) => (value !== undefined && value !== null ? String(value).trim() : value))
    description: string;

    // game?: string[];

    games?: GamesEntity[];
}