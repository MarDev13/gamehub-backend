import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGenreDto } from "../admin/genres/dto/create-genre.dto";

@Injectable()
export class AdminService {}
