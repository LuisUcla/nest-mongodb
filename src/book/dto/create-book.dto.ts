import { IsNotEmpty, IsString, IsNumber, IsEnum, IsEmpty } from "class-validator";
import { Category } from "../../shared/enums/category.enum";
import { User } from "../../auth/schemas/user.schema";

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly author: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please enter correct category.' })
    readonly category: Category

    @IsEmpty({ message: 'You cannot pass user Id' }) // se establece Empty por que se guarda el id mediante el token
    readonly user: User
}