import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
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
    create(@Body() dto: CreatePlatformDto) {
        return this.platformService.createPlatform(dto);
    }

    @Role('ADMIN')
    @Get()
    findAll(@Query() pagination: PaginationDto) {
        return this.platformService.findAll(pagination);
    }

    @Role('ADMIN')
    @Get(':id')
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.platformService.findById(id);
    }

    @Role('ADMIN')
    @Patch(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdatePlatformDto) {
        return this.platformService.updatePlatform(id, dto);
    }

    @Role('ADMIN')
    @Delete(':id')
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.platformService.deletePlatform(id);
    }

}
