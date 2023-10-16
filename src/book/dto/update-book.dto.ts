import { Category } from "../schemas/book.schema";
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from "class-validator";

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
}