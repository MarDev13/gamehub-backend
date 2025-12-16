import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
    constructor(private readonly prisma: PrismaService){}
    async createTag(dto: CreateTagDto){
        const existing = await this.prisma.tag.findUnique({
            where: { name: dto.name },
        });
        if (existing) throw new BadRequestException('Esta etiqueta ya existe');
        const tag = await this.prisma.tag.create({
            data: {
                name: dto.name
            },
        });
        return {
            message: 'Etiqueta creada con éxito',
            tag,
        };
    }
    async findAll(){
        return this.prisma.tag.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findById(id: string){
        const tag = await this.prisma.tag.findUnique({
            where: { id},
        });
        if (!tag) throw new NotFoundException('Etiqueta no encontrada');
        return {
            message: 'Etiqueta encontrada con éxito',
            tag,
        }
    }
    async updateTag(id: string, dto: UpdateTagDto){
        const tag = await this.prisma.tag.findUnique({
            where: { id},
        });
        if (!tag) throw new NotFoundException('Etiqueta no encontrada');
        const updatedTag = await this.prisma.tag.update({
            where: { id },
            data: dto,
        });
        return {
            message: 'Etiqueta actualizada con éxito',
            updatedTag,
        }
    }
    async deleteTag(id: string){
        const tag = await this.prisma.tag.findUnique({
            where: { id}
        });
        if (!tag) throw new NotFoundException('Etiqueta no encontrada');
        const deleteTag = await this.prisma.tag.delete({
            where: { id },
        });
        return {
            message: 'Etiqueta eliminada con éxito',
            deleteTag,
        }
    }
}
