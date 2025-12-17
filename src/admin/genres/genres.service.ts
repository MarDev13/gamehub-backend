import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateGenreDto } from "src/admin/genres/dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { buildPagination } from "src/common/utils/pagination.utils";

@Injectable()
export class GenresService {
    constructor(private readonly prisma: PrismaService) {}
    async createGenre(dto: CreateGenreDto) {
        const existing = await this.prisma.genre.findUnique({
            where: { name: dto.name },
        });
        if (existing) throw new BadRequestException('Este género ya existe');
        const genre = await this.prisma.genre.create({
            data: {
                name: dto.name,
            },
        });
        return {
            message: 'Género creado con éxito',
            genre,
        };
    } 
    async findAll(pagination: PaginationDto) {
        const { skip, take, orderBy } = buildPagination(pagination);
        const [items, total] = await this.prisma.$transaction([
            this.prisma.genre.findMany({
                take,
                skip,
                orderBy,

            }),
            this.prisma.genre.count(),
        ]);
        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            items
        };
    }

    async findById(id: string) {
        const genre = await this.prisma.genre.findUnique({
            where: { id },
        });
        if (!genre) throw new NotFoundException('Género no encontrado');
        return genre;
    }

    async updateGenre(id: string, dto: UpdateGenreDto) {
        const genre = await this.prisma.genre.findUnique({
            where: { id },
        });
        if (!genre) throw new NotFoundException('Género no encontrado');
        const updateGenre = await this.prisma.genre.update({
            where: { id },
            data: dto,
        });
        return {
            message: 'Género actualizado con éxito',
            updateGenre,
        }
    }
    async deleteGenre(id: string) {
        const genre = await this.prisma.genre.findUnique({
            where: { id }
        });
        if (!genre) throw new NotFoundException('Género no encontrado');
        const deleteGenre =await this.prisma.genre.delete({
            where: { id }
        });
        return {
            message: 'Género eliminado con éxito',
            deleteGenre,
        }
    }
}
