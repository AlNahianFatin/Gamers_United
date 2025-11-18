import { IsNotEmpty, IsString, Matches } from "class-validator";
import { AdminDTO } from "./admin.dto";
import { DeveloperDTO } from "./developer.dto";
import { PlayerDTO } from "./player.dto";
import { Transform } from "class-transformer";
import { AdminEntity } from "../Entity/admin.entity";
import { PlayerEntity } from "../Entity/player.entity";
import { DeveloperEntity } from "../Entity/developer.entity";

export class LoginDTO {
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    @Matches(/^[a-zA-Z\s]*$/, {
        message: 'Username should only contain alphabets and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    username?: string;

    @IsNotEmpty({ message: 'Password is required' })
    password_hash?: string;

    @IsNotEmpty()
    role?: string;

    @IsNotEmpty()
    activation?: boolean;

    @IsNotEmpty()
    ban?: boolean;

    admins?: AdminEntity[];
    players?: PlayerEntity[];
    developers?: DeveloperEntity[];

    generateID: any;
}