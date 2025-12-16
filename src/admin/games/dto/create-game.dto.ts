import {
   IsString, MinLength, IsOptional, IsArray, IsNumber, IsInt, IsBoolean, IsDateString, IsEnum
} from "class-validator";
import { GameStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateGameDto {

   @IsString()
   @MinLength(3)
   @ApiProperty({ example: 'The Witcher 3' })
   title: string;

   @ApiProperty({
      example: 'RPG de mundo abierto ambientado en un universo de fantasía oscura',
      required: false
   })
   @IsOptional()
   @IsString()
   @MinLength(10)
   description?: string;

   @IsOptional()
   @IsString()
   imageUrl?: string;

   @ApiProperty({ example: 'RPG' })
   @IsString()
   genreName: string;

   @ApiProperty({ example: ['PC', 'PS5'] })
   @IsArray()
   @IsString({ each: true })
   platformNames: string[];

   @IsOptional()
   @IsArray()
   @IsString({ each: true })
   tagNames?: string[];

   @ApiProperty({ example: 59.99 })
   @IsNumber()
   price: number;

   @ApiProperty({ example: 20, required: false })
   @IsOptional()
   @IsInt()
   discountPct?: number;

   @IsOptional()
   @IsDateString()
   saleStartDate?: string;

   @IsOptional()
   @IsDateString()
   saleEndDate?: string;

   @IsOptional()
   @IsInt()
   stock?: number;

   @IsOptional()
   @IsBoolean()
   isPublished?: boolean;

   @IsOptional()
   @IsEnum(GameStatus)
   status?: GameStatus;
}
