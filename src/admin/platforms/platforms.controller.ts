import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PlatformsService } from './platforms.service';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('admin - platforms')
@ApiBearerAuth()

@Controller('admin/platforms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlatformsController {
    constructor(private readonly platformService: PlatformsService) { }

    @Role('ADMIN')
    @Post()
    @ApiOperation({ summary: 'Crear una nueva plataforma' })
    @ApiResponse({ status: 201, description: 'Plataforma creada correctamente' })
    @ApiResponse({ status: 400, description: 'La plataforma ya existe o datos inválidos' })
    create(@Body() dto: CreatePlatformDto) {
        return this.platformService.createPlatform(dto);
    }

    @Role('ADMIN')
    @Get()
    @ApiOperation({ summary: 'Listar plataformas con paginación' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiQuery({ name: 'sort', required: false, example: 'createdAt' })
    @ApiQuery({ name: 'order', required: false, example: 'desc' })
    @ApiResponse({ status: 200, description: 'Listado de plataformas' })
    findAll(@Query() pagination: PaginationDto) {
        return this.platformService.findAll(pagination);
    }

    @Role('ADMIN')
    @Get(':id')
    @ApiOperation({ summary: 'Obtener plataforma por ID' })
    @ApiParam({ name: 'id', description: 'ID de la plataforma (UUID)' })
    @ApiResponse({ status: 200, description: 'Plataforma encontrada' })
    @ApiResponse({ status: 404, description: 'Plataforma no encontrada' })
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.platformService.findById(id);
    }

    @Role('ADMIN')
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una plataforma' })
    @ApiParam({ name: 'id', description: 'ID de la plataforma (UUID)' })
    @ApiResponse({ status: 200, description: 'Plataforma actualizada correctamente' })
    @ApiResponse({ status: 404, description: 'Plataforma no encontrada' })
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdatePlatformDto) {
        return this.platformService.updatePlatform(id, dto);
    }

    @Role('ADMIN')
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una plataforma' })
    @ApiParam({ name: 'id', description: 'ID de la plataforma (UUID)' })
    @ApiResponse({ status: 200, description: 'Plataforma eliminada correctamente' })
    @ApiResponse({ status: 404, description: 'Plataforma no encontrada' })
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.platformService.deletePlatform(id);
    }

}
