import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, total: number) {
    const normalizedTotal = Math.round(total * 100) / 100;

    if (!normalizedTotal || normalizedTotal <= 0) {
      throw new BadRequestException("Total inválido");
    }

    return this.prisma.order.create({
      data: {
        total: normalizedTotal,
        userId,
        status: "PAID",
      },
    });
  }

  async getMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
