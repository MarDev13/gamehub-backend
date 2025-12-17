import { Controller, Post, Get, Delete, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('admin - tags')
@ApiBearerAuth()

@Controller('admin/tags')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Role('ADMIN')
    @ApiOperation({ summary: 'Crear una nueva etiqueta' })
    @ApiResponse({ status: 201, description: 'Etiqueta creada correctamente' })
    @ApiResponse({ status: 400, description: 'La etiqueta ya existe o datos inválidos' })
    @Post()
    createTag(@Body() dto: CreateTagDto) {
        return this.tagsService.createTag(dto);
    }

    @Role('ADMIN')
    @Get()
    @ApiOperation({ summary: 'Listar etiquetas con paginación' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiQuery({ name: 'sort', required: false, example: 'createdAt' })
    @ApiQuery({ name: 'order', required: false, example: 'desc' })
    @ApiResponse({ status: 200, description: 'Listado de etiquetas' })
    findAll(@Query() pagination: PaginationDto) {
        return this.tagsService.findAll(pagination);
    }

    @Role('ADMIN')
    @Get(':id')
    @ApiOperation({ summary: 'Obtener etiqueta por ID' })
    @ApiParam({ name: 'id', description: 'ID de la etiqueta (UUID)' })
    @ApiResponse({ status: 200, description: 'Etiqueta encontrada' })
    @ApiResponse({ status: 404, description: 'Etiqueta no encontrada' })
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.tagsService.findById(id);
    }
    @Role('ADMIN')
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una etiqueta' })
    @ApiParam({ name: 'id', description: 'ID de la etiqueta (UUID)' })
    @ApiResponse({ status: 200, description: 'Etiqueta actualizada correctamente' })
    @ApiResponse({ status: 404, description: 'Etiqueta no encontrada' })
    updateTag(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateTagDto) {
        return this.tagsService.updateTag(id, dto);
    }

    @Role('ADMIN')
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una etiqueta' })
    @ApiParam({ name: 'id', description: 'ID de la etiqueta (UUID)' })
    @ApiResponse({ status: 200, description: 'Etiqueta eliminada correctamente' })
    @ApiResponse({ status: 404, description: 'Etiqueta no encontrada' })
    deleteTag(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.tagsService.deleteTag(id);
    }
}
