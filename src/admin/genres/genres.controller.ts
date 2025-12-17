import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from 'src/admin/genres/dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('admin - genres')
@ApiBearerAuth()

@Controller('admin/genres')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GenresController {
  constructor(private readonly genresService: GenresService) { }

  @Role('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo género' })
  @ApiResponse({ status: 201, description: 'Género creado correctamente' })
  @ApiResponse({ status: 400, description: 'El género ya existe o datos inválidos' })
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.createGenre(dto);
  }

  @Role('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Listar géneros con paginación' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'sort', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'order', required: false, example: 'desc' })
  @ApiResponse({ status: 200, description: 'Listado de géneros' })
  findAll(@Query() pagination: PaginationDto) {
    return this.genresService.findAll(pagination);
  }

  @Role('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener género por ID' })
  @ApiParam({ name: 'id', description: 'ID del género (UUID)' })
  @ApiResponse({ status: 200, description: 'Género encontrado' })
  @ApiResponse({ status: 404, description: 'Género no encontrado' })
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.genresService.findById(id);
  }

  @Role('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un género' })
  @ApiParam({ name: 'id', description: 'ID del género (UUID)' })
  @ApiResponse({ status: 200, description: 'Género actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Género no encontrado' })
  updateGenre(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateGenreDto) {
    return this.genresService.updateGenre(id, dto);
  }

  @Role('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un género' })
  @ApiParam({ name: 'id', description: 'ID del género (UUID)' })
  @ApiResponse({ status: 200, description: 'Género eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Género no encontrado' })
  deleteGenre(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.genresService.deleteGenre(id);
  }
}
