import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Role } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("shop")
export class ShopController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("games")
  async getGames(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 12
  ) {
    const skip = (Number(page) - 1) * Number(limit);

    const [games, total] = await this.prisma.$transaction([
      this.prisma.game.findMany({
        where: {
          isPublished: true,
          status: "ACTIVE",
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          genre: true,
          tags: true,
          platforms: true,
        },
      }),
      this.prisma.game.count({
        where: {
          isPublished: true,
          status: "ACTIVE",
        },
      }),
    ]);

    return {
      page: Number(page),
      total,
      hasMore: skip + games.length < total,
      items: games,
    };
  }
@Role("USER")
@UseGuards(RolesGuard, JwtAuthGuard)
@Get("games/discounts")
async getDiscountGames() {
  const games = await this.prisma.game.findMany({
    where: {
      isPublished: true,
      onSale: true,
    },
    orderBy: {
      discountPct: "desc",
    },
    take: 12,
    include: {
      platforms: true,
      tags: true,
    },
  })

  return games
}
@Get("games/:id")
async getGameById(@Param("id") id: string) {
  const game = await this.prisma.game.findUnique({
    where: { id },
    include: {
      genre: true,
      tags: true,
      platforms: true,
    },
  })

  if (!game || !game.isPublished) {
    throw new NotFoundException("Juego no encontrado")
  }

  return game
}


}
