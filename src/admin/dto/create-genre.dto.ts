import { IsString, IsNotEmpty, MinLength } from "class-validator";
export class CreateGenreDto {
    @IsString({ message: 'El nombre debe ser un texto' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @IsNotEmpty()
    name: string;
}