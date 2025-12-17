import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
    create(@Body() dto: CreateGameDto) {
        return this.gameService.createGame(dto);
    }

    @Role('ADMIN')
    @Get()
    findAll(@Query() pagination: PaginationDto) {
        return this.gameService.findAll(pagination);
    }

    @Role('ADMIN')
    @Get(':id')
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.gameService.findById(id);
    }

    @Role('ADMIN')
    @Patch(':id')
    updateGame(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateGameDto){
        return this.gameService.updateGame(id,dto);
    }

    @Role('ADMIN')
    @Post(':id/publish')
    publishGame(@Param('id', new ParseUUIDPipe()) id: string){
        return this.gameService.togglePublish(id)
    }


    @Role('ADMIN')
    @Delete(':id')
    deleteGame(@Param('id', new ParseUUIDPipe()) id: string){
        return this.gameService.deleteGame(id);
    }
}
