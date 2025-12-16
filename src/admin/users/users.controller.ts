import { Controller, Get, Patch, UseGuards, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';

@ApiTags('admin - users')
@ApiBearerAuth()

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Role('ADMIN')
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Role('ADMIN')
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.userService.findById(id);
    }
    @Role('ADMIN')
    @Get(':id/orders')
    findOrdersByUser(@Param('id') id: string) {
        return this.userService.findOrdersByUser(id);
    }

    @Role('ADMIN')
    @Patch(':id')
    updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
        return this.userService.updateRole(id, dto);
    }


}
