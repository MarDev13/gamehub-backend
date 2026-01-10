import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('admin - games')
@ApiBearerAuth()

@Controller('admin/games')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GamesController {
    constructor(private readonly gameService: GamesService) { }

    @Role('ADMIN')
    @Post()
    @ApiOperation({ summary: 'Crear un nuevo juego' })
    @ApiResponse({ status: 201, description: 'Juego creado correctamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o juego ya existente' })
    @ApiResponse({ status: 404, description: 'Género, plataformas o tags no encontrados' })
    create(@Body() dto: CreateGameDto) {
        return this.gameService.createGame(dto);
    }

    @Role('ADMIN')
    @Get()
    @ApiOperation({ summary: 'Listar juegos con paginación' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiQuery({ name: 'sort', required: false, example: 'createdAt' })
    @ApiQuery({ name: 'order', required: false, example: 'desc' })
    @ApiResponse({ status: 200, description: 'Listado de juegos' })
    findAll(@Query() pagination: PaginationDto) {
        return this.gameService.findAll(pagination);
    }

    @Role('ADMIN')
    @Get('metrics/count')
    @ApiOperation({ summary: 'Obtener total de videojuegos' })
    @ApiResponse({ status: 200, description: 'Total de videojuegos registrados' })
    countGames() {
        return this.gameService.countGames()
    }

    @Role('ADMIN')
    @Get(':id')
    @ApiOperation({ summary: 'Obtener juego por ID' })
    @ApiParam({ name: 'id', description: 'ID del juego (UUID)' })
    @ApiResponse({ status: 200, description: 'Juego encontrado' })
    @ApiResponse({ status: 404, description: 'Juego no encontrado' })
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.gameService.findById(id);
    }

    @Role('ADMIN')
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un juego' })
    @ApiParam({ name: 'id', description: 'ID del juego (UUID)' })
    @ApiResponse({ status: 200, description: 'Juego actualizado correctamente' })
    @ApiResponse({ status: 404, description: 'Juego no encontrado' })
    updateGame(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateGameDto) {
        return this.gameService.updateGame(id, dto);
    }

    @Role('ADMIN')
    @Post(':id/publish')
    @ApiOperation({ summary: 'Publicar u ocultar un juego' })
    @ApiParam({ name: 'id', description: 'ID del juego (UUID)' })
    @ApiResponse({ status: 200, description: 'Estado de publicación actualizado' })
    @ApiResponse({ status: 404, description: 'Juego no encontrado' })
    publishGame(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.gameService.togglePublish(id)
    }


    @Role('ADMIN')
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un juego' })
    @ApiParam({ name: 'id', description: 'ID del juego (UUID)' })
    @ApiResponse({ status: 200, description: 'Juego eliminado correctamente' })
    @ApiResponse({ status: 404, description: 'Juego no encontrado' })
    deleteGame(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.gameService.deleteGame(id);
    }
}
