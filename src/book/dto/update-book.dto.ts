import { User } from "../../auth/schemas/user.schema";
import { Category } from "../../shared/enums/category.enum";
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsEmpty } from "class-validator";

export class UpdateBookDto {
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    readonly author: string;

    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    readonly price: number;

    @IsNotEmpty()
    @IsOptional()
    @IsEnum(Category, { message: 'Please enter correct category.' })
    readonly category: Category
    
    @IsEmpty({ message: 'You cannot pass user Id' })
    readonly user: User
}