import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateGenreDto } from './genres/dto/create-genre.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService){}

    @Role('ADMIN')
    @Get('dashboard')
    getdashboard(@Req() req) {
        return {
            message: `Bienvenido al panel de administrador ${req.user.username}`,
        };
    }
}
