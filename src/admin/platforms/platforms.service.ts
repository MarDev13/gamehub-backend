import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';

@Injectable()
export class PlatformsService {
    constructor(private readonly prisma: PrismaService) { }
    async createPlatform(dto: CreatePlatformDto) {
        const existing = await this.prisma.platform.findUnique({
            where: { name: dto.name }
        });
        if (existing) throw new BadRequestException('Esta plataforma ya existe');
        const platform = await this.prisma.platform.create({
            data: {
                name: dto.name,
            },
        });
        return {
            message: 'Plataforma creada con éxito',
            platform
        };
    }

    async findAll() {
        return this.prisma.platform.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string) {
        const platform = await this.prisma.platform.findUnique({
            where: { id }
        });
        if (!platform) throw new NotFoundException('Plataforma no encontrada');
        return platform;
    }

    async updatePlatform(id: string, dto: UpdatePlatformDto) {
        const platform = await this.prisma.platform.findUnique({
            where: { id }
        });
        if (!platform) throw new NotFoundException('Plataforma no encontrada');
        const updatePlatform = await this.prisma.platform.update({
            where: { id },
            data: dto
        });
        return {
            message: 'Plataforma actualizada con éxito',
            updatePlatform
        };
    }

    async deletePlatform(id: string) {
        const platform = await this.prisma.platform.findUnique({
            where: { id }
        });
        if(!platform) throw new NotFoundException('Plataforma no encontrada');
        const deletePlatform = await this.prisma.platform.delete({
            where: {id}
        });
        return {
            message: 'Plataforma eliminada con éxito',
            deletePlatform
        };
    }
}
