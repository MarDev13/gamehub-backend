import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateGenreDto } from "src/admin/dto/create-genre.dto";
import { UpdateGenreDto } from "../dto/update-genre.dto";

@Injectable()
export class GenresService {
    constructor(private readonly prisma: PrismaService) { }
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
    } async findAll() {
        return this.prisma.genre.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string) {
        const genre = await this.prisma.genre.findUnique({
            where: { id },
        });
        if (!genre) throw new BadRequestException('Género no encontrado');
        return genre;
    }

    async updateGenre(id: string, dto: UpdateGenreDto) {
        const genre = await this.prisma.genre.findUnique({
            where: { id },
        });
        if (!genre) throw new BadRequestException('Género no encontrado');
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
        if (!genre) throw new BadRequestException('Género no encontrado');
        await this.prisma.genre.delete({
            where: { id }
        });
        return {
            message: 'Género eliminado con éxito',
        }
    }
}
