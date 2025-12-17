import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { buildPagination } from 'src/common/utils/pagination.utils';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(pagination: PaginationDto) {
        const { skip, take, orderBy } = buildPagination(pagination);
        const [items, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
               skip, 
               take,
               orderBy,
               include: {
                role: true
               }
            }),
            this.prisma.user.count()
        ]);
        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            items
        };
    }
    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return {
            message: 'Usuario encontrado correctamente',
            user,
        };
    }

    async updateRole(id: string, dto: UpdateUserRoleDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                role: true
            },
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        if (user.role.name === dto.role) throw new BadRequestException('El usuario ya tiene este rol');
        const role = await this.prisma.role.findUnique({
            where: { name: dto.role },
        });
        if (!role) throw new NotFoundException('Rol no encontrado');
        const UpdatedUserRole = await this.prisma.user.update({
            where: { id },
            data: {
                role: {
                    connect: { id: role.id },
                },
            },
            include: {
                role: true,
            },
        });
        return {
            message: 'Rol del usuario actualizado con éxito',
            user: UpdatedUserRole,
        };
    }
    async findOrdersByUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        const orders = await this.prisma.order.findMany({
            where: { userId: id },
            orderBy: { createdAt: 'desc' },
        });
        return {
            userId: id,
            totalOrders: orders.length,
            orders
        };
    }
}
