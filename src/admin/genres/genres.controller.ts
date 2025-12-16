import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from 'src/admin/genres/dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@ApiTags('admin - genres')
@ApiBearerAuth()

@Controller('admin/genres')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GenresController {
    constructor(private readonly genresService: GenresService){}

    @Role('ADMIN')
    @Post()
        @ApiBody({
    schema: {
      example: {
      name: "Acción"
      }
    }
  })
    create(@Body() dto: CreateGenreDto){
        return this.genresService.createGenre(dto);
    }

    @Role('ADMIN')
    @Get()
    findAll() {
        return this.genresService.findAll();
    }

    @Role('ADMIN')
    @Get(':id')
    findById(@Param('id') id: string){
        return this.genresService.findById(id);
    }

  @Role('ADMIN')
     @ApiBody({
    schema: {
      example: {
      name: "Acción"
      }
    }
  })
  @Patch(':id')
  updateGenre(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genresService.updateGenre(id, dto);
  }

  @Role('ADMIN')
  @Delete(':id')
  deleteGenre(@Param('id') id: string){
    return this.genresService.deleteGenre(id);
  }
}
