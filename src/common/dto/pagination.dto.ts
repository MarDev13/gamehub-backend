import { IsOptional, IsInt, Min, IsIn } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto{
    @ApiPropertyOptional({
        example: 1,
        description: 'Página actual'
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 10,
        description: 'Número de resultados por página'
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({
        example: 'CreatedAt',
        description: 'Campo por el que ordenar'
    })
    @IsOptional()
    sort?: string = 'CreatedAt';

    @ApiPropertyOptional({
        example: 'desc',
        enum: ['asc', 'desc'],
        description: 'Dirección de la ordenación'
    })
    @IsOptional()
    @IsIn(['asc','desc'])
    order?: 'asc' | 'desc' = 'desc'
}