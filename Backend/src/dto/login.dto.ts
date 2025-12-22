import { IsNotEmpty, IsString, Matches } from "class-validator";
import { Transform } from "class-transformer";
import { AdminEntity } from "../entities/admin.entity";
import { PlayerEntity } from "../entities/player.entity";
import { DeveloperEntity } from "../entities/developer.entity";

export class LoginDTO {
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    @Matches(/^[a-zA-Z0-9\s\-\_\.]*$/, {
        message: 'Username should only contain alphabets, digits, hyphens, underscores, dots and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    username: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    role?: string;

    activation?: boolean;

    ban?: boolean;

    admin?: AdminEntity;
    player?: PlayerEntity;
    developer?: DeveloperEntity;
}