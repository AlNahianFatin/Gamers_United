import { IsOptional, IsString, Matches, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { LoginEntity } from '../entities/login.entity';

export class UpdateAdminDTO {
    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-Z0-9\s\-\_\.]*$/, {
        message: 'Username should only contain alphabets, digits, hyphens, underscores, dots and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    username?: string;

    @IsOptional()
    image?: string;

    @IsOptional()
    @Matches(/^\d{10}$/, {
        message: 'NID must be a valid format of 10 digits'
    })
    @Transform(({ value }) => (value !== undefined && value !== null ? String(value).trim() : value))
    NID?: string;

    @IsOptional()
    @Matches(/^\d{11}$/, {
        message: 'Phone No. must be a valid format of 11 digits'
    })
    @Transform(({ value }) => (value !== undefined && value !== null ? String(value).trim() : value))
    phone?: string;

    created_at?: Date;

    login?: LoginEntity;
}