import { IsString, IsEmail, IsNotEmpty, Matches, MinLength, MaxLength, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class AdminDTO {
    id: number;

    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    @Matches(/^[a-zA-Z\s]*$/, {
        message: 'Username should only contain alphabets and spaces',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    username: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @Matches(/@.*\.(xyz)$/i, {
        message: 'Email must contain @ and a .xyz domain',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    email: string;

    profile_image_url: string;

    @IsNotEmpty({ message: 'NID is required' })
    @MinLength(10, {
        message: 'NID must be a valid format of 10 digits'
    })
    @Transform(({ value }) => (value?.toString()).trim())
    NID: number;

    created_at: Date;
}