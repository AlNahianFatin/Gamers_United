import { IsNotEmpty, IsString, Matches } from "class-validator";
import { Transform } from "class-transformer";

export class LoginRequestDTO {
  @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    @Matches(/^[a-zA-Z0-9\s\-\_\.]*$/, {
        message: 'Username should only contain alphabets, digits, hyphens, underscores, dots and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    username: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}