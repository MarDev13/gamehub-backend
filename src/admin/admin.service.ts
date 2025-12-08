import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateGenreDto } from "src/admin/dto/create-genre.dto";

@Injectable()
export class AdminService {}
