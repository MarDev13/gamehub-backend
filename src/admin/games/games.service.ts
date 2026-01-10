import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateGameDto } from './dto/update-game.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameStatus } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { buildPagination } from 'src/common/utils/pagination.utils';

@Injectable()
export class GamesService {
    constructor(private readonly prisma: PrismaService) { }

    private calculatePricing(price: number, discountPct?: number) {
        if (!discountPct || discountPct <= 0) {
            return {
                salePrice: null,
                discountPct: null,
                onSale: false,
            };
        }

        const salePrice = price - (price * (discountPct / 100));

        return {
            salePrice: Number(salePrice.toFixed(2)),
            onSale: true,
            discountPct
        };
    }

    async createGame(dto: CreateGameDto) {
        const existing = await this.prisma.game.findFirst({
            where: { title: dto.title }
        });
        if (existing) throw new BadRequestException('Este juego ya existe');

        const genre = await this.prisma.genre.findUnique({
            where: { name: dto.genreName }
        });
        if (!genre) throw new NotFoundException('Género no encontrado');

        const platforms = await this.prisma.platform.findMany({
            where: { name: { in: dto.platformNames } }
        });
        if (platforms.length !== dto.platformNames.length) {
            throw new NotFoundException(`Una o más plataformas no existen: ${dto.platformNames.join(', ')}`);
        }

        let tags: { id: string }[] = [];
        if (dto.tagNames?.length) {
            tags = await this.prisma.tag.findMany({
                where: { name: { in: dto.tagNames } }
            });

            if (tags.length !== dto.tagNames.length) {
                throw new NotFoundException(`Una o más etiquetas no existen: ${dto.tagNames.join(', ')}`);
            }
        }

        const pricing = this.calculatePricing(dto.price, dto.discountPct);

        const game = await this.prisma.game.create({
            data: {
                title: dto.title,
                description: dto.description,
                imageUrl: dto.imageUrl,

                price: dto.price,
                salePrice: pricing.salePrice,
                discountPct: pricing.discountPct,
                onSale: pricing.onSale,

                stock: dto.stock ?? 0,
                isPublished: dto.isPublished ?? true,
                status: dto.status ?? GameStatus.ACTIVE,
                saleStartDate: dto.saleStartDate ? new Date(dto.saleStartDate) : null,
                saleEndDate: dto.saleEndDate ? new Date(dto.saleEndDate) : null,

                genre: { connect: { id: genre.id } },
                platforms: { connect: platforms.map(p => ({ id: p.id })) },
                tags: tags.length ? { connect: tags.map(t => ({ id: t.id })) } : undefined,
            },
            include: {
                genre: true,
                platforms: true,
                tags: true,
            }
        });

        return {
            message: 'Juego creado con éxito',
            game,
        };
    }
    async countGames() {
        const total = await this.prisma.game.count()
        return { total }
    }

    async findAll(pagination: PaginationDto) {
        const { skip, take, orderBy } = buildPagination(pagination);
        const [items, total] = await this.prisma.$transaction([
            this.prisma.game.findMany({
                skip,
                take,
                orderBy,
                include: {
                    genre: true,
                    platforms: true,
                    tags: true,
                }
            }),
            this.prisma.game.count(),
        ]);
        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            items,
        };
    }

    async findById(id: string) {
        const game = await this.prisma.game.findUnique({
            where: { id },
            include: {
                genre: true,
                platforms: true,
                tags: true,
            }
        });

        if (!game) throw new NotFoundException('Juego no encontrado');

        return {
            message: 'Juego encontrado con éxito',
            game,
        };
    }

    async updateGame(id: string, dto: UpdateGameDto) {
        const game = await this.prisma.game.findUnique({ where: { id } });

        if (!game) throw new NotFoundException('Juego no encontrado');

        let genreConnect;
        let platformsSet;
        let tagsSet;

        if (dto.genreName) {
            const genre = await this.prisma.genre.findUnique({
                where: { name: dto.genreName },
            });
            if (!genre) throw new NotFoundException('Género no encontrado');
            genreConnect = { connect: { id: genre.id } };
        }

        if (dto.platformNames?.length) {
            const platforms = await this.prisma.platform.findMany({
                where: { name: { in: dto.platformNames } },
            });

            if (platforms.length !== dto.platformNames.length) {
                throw new NotFoundException(`Una o más plataformas no existen: ${dto.platformNames.join(', ')}`);
            }

            platformsSet = { set: platforms.map(p => ({ id: p.id })) };
        }

        if (dto.tagNames?.length) {
            const tags = await this.prisma.tag.findMany({
                where: { name: { in: dto.tagNames } },
            });

            if (tags.length !== dto.tagNames.length) {
                throw new NotFoundException(`Una o más etiquetas no existen: ${dto.tagNames.join(', ')}`);
            }

            tagsSet = { set: tags.map(t => ({ id: t.id })) };
        }

        let pricing;
        if (dto.price !== undefined || dto.discountPct !== undefined) {
            const newPrice = dto.price ?? game.price;
            const newDiscount = dto.discountPct ?? game.discountPct;

            pricing = this.calculatePricing(newPrice, newDiscount ?? undefined);
        }

        const updatedGame = await this.prisma.game.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                imageUrl: dto.imageUrl,

                ...(pricing && {
                    price: dto.price ?? game.price,
                    salePrice: pricing.salePrice,
                    discountPct: pricing.discountPct,
                    onSale: pricing.onSale,
                }),

                ...(genreConnect && { genre: genreConnect }),
                ...(platformsSet && { platforms: platformsSet }),
                ...(tagsSet && { tags: tagsSet }),

                stock: dto.stock ?? game.stock,
                isPublished: dto.isPublished ?? game.isPublished,
                status: dto.status ?? game.status,
                saleStartDate: dto.saleStartDate ? new Date(dto.saleStartDate) : game.saleStartDate,
                saleEndDate: dto.saleEndDate ? new Date(dto.saleEndDate) : game.saleEndDate,
            },
            include: {
                genre: true,
                platforms: true,
                tags: true,
            },
        });

        return {
            message: 'Juego actualizado con éxito',
            updatedGame,
        };
    }

    async togglePublish(id: string) {
        const game = await this.prisma.game.findUnique({
            where: { id },
        });
        if (!game) throw new NotFoundException('Juego no encontrado')

        const updatedGame = await this.prisma.game.update({
            where: { id },
            data: {
                isPublished: !game.isPublished
            },
        });
        return {
            message: `Juego ${updatedGame.isPublished ? 'publicado' : 'ocultado'} con éxito`,
            game: updatedGame,
        };
    }



    async deleteGame(id: string) {
        const game = await this.prisma.game.findUnique({ where: { id } });
        if (!game) throw new NotFoundException('Juego no encontrado');

        const deleteGame = await this.prisma.game.delete({ where: { id } });

        return {
            message: 'Juego eliminado con éxito',
            deleteGame,
        };
    }
}
