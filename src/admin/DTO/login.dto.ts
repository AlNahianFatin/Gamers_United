export class LoginDTO {
    id: number;
    username: string;
    password_hash: string;
    role: string;
    activation: boolean;
    ban: boolean;
}