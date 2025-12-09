import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateGenreDto } from "src/admin/genres/dto/create-genre.dto";

@Injectable()
export class AdminService {}
