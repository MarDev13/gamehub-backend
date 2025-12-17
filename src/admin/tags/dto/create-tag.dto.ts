import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateTagDto {
    @ApiProperty({ example: 'Familiar'})
    @IsString({ message: 'El nombre debe ser un texto' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @IsNotEmpty()
    name: string;
}