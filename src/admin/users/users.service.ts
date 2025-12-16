import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                role: true,
            }
        });
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
        if(!role) throw new NotFoundException('Rol no encontrado');
        const UpdatedUserRole = await this.prisma.user.update({
            where: {id},
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
    async findOrdersByUser(id: string){
        const user = await this.prisma.user.findUnique({
            where: {id},
        });
        if(!user) throw new NotFoundException('Usuario no encontrado');
        const orders = await this.prisma.order.findMany({
            where: {userId: id},
            orderBy: {createdAt:'desc'},
        });
        return{
            userId: id,
            totalOrders: orders.length,
            orders
        };
    }
}
