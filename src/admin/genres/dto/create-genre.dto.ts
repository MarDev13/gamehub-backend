import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateGenreDto {
    @ApiProperty({ example: 'Acción' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @IsNotEmpty()
    name: string;
}