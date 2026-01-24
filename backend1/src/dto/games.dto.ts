import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Matches, IsNumber, Min, IsArray, ArrayNotEmpty } from 'class-validator';
import { CategoriesEntity } from '../entities/categories.entity';
import { DeveloperEntity } from '../entities/developer.entity';
import { PurchasesEntity } from '../entities/purchases.entity';

export class GamesDTO {
    @IsString()
    @IsNotEmpty({ message: 'Game title is required' })
    @Matches(/^[a-zA-Z0-9\s\-\_\.\:]*$/, {
        message: 'Game title should only contain alphabets, digits, hyphens, underscores, dots, colons and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Develoepr name is required' })
    @Matches(/^[a-zA-Z0-9\s\-\_\.]*$/, {
        message: 'Developer name should only contain alphabets, digits, hyphens, underscores, dots and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    developed_by: string;

    @Transform(({ value }) => (value !== undefined && value !== null ? String(value).trim() : value))
    description?: string;

    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({}, { message: 'Price must be a valid number' })
    @Min(0, { message: 'Price must be greater than or at least equal to 0' })
    @Transform(({ value }) => value !== undefined && value !== null ? Number(value) : value)
    price: number;

    image?: string;

    trailer?: string;
    
    game?: string;

    published_at?: Date;

    // view_count?: number;

    // play_count?: number;

    purchase_count?: number;
    
    categories?: CategoriesEntity[];

    developer?: DeveloperEntity;

    purchases?: PurchasesEntity[];
}