import { Controller, Post, Get, Delete, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
    @ApiBody({
        schema: {
            example: {
                name: "Divertido",
            }
        }
    })
    @Post()
    createTag(@Body() dto: CreateTagDto) {
        return this.tagsService.createTag(dto);
    }

    @Role('ADMIN')
    @Get()
    findAll(@Query() pagination: PaginationDto) {
        return this.tagsService.findAll(pagination);
    }

    @Role('ADMIN')
    @Get(':id')
    findById(@Param('id', new ParseUUIDPipe()) id: string){
        return this.tagsService.findById(id);
    }
    @Role('ADMIN')
    @Patch(':id')
    updateTag(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateTagDto){
        return this.tagsService.updateTag(id, dto);
    }

    @Role('ADMIN')
    @Delete(':id')
    deleteTag(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.tagsService.deleteTag(id);
    }
}
