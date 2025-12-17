import { Controller, Get, Patch, UseGuards, Param, Body, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('admin - users')
@ApiBearerAuth()

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Role('ADMIN')
    @Get()
    @ApiOperation({ summary: 'Listar usuarios con paginación' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiQuery({ name: 'sort', required: false, example: 'createdAt' })
    @ApiQuery({ name: 'order', required: false, example: 'desc' })
    @ApiResponse({ status: 200, description: 'Listado de usuarios' })
    findAll(@Query() pagination: PaginationDto) {
        return this.userService.findAll(pagination);
    }

    @Role('ADMIN')
    @Get(':id')
    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiParam({ name: 'id', description: 'ID del usuario (UUID)' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.userService.findById(id);
    }
    @Role('ADMIN')
    @Get(':id/orders')
    @ApiOperation({ summary: 'Obtener pedidos de un usuario' })
    @ApiParam({ name: 'id', description: 'ID del usuario (UUID)' })
    @ApiResponse({ status: 200, description: 'Listado de pedidos del usuario' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    findOrdersByUser(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.userService.findOrdersByUser(id);
    }

    @Role('ADMIN')
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar el rol de un usuario' })
    @ApiParam({ name: 'id', description: 'ID del usuario (UUID)' })
    @ApiResponse({ status: 200, description: 'Rol del usuario actualizado correctamente' })
    @ApiResponse({ status: 400, description: 'El usuario ya tiene ese rol' })
    @ApiResponse({ status: 404, description: 'Usuario o rol no encontrado' })
    updateRole(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateUserRoleDto) {
        return this.userService.updateRole(id, dto);
    }


}
