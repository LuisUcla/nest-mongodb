import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'Please enter correct email...' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'password min length is 6 characters' })
    readonly password: string;

}