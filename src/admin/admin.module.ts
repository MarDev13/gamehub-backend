import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { PrismaService } from "../prisma/prisma.service";
import { TagsModule } from './tags/tags.module';
@Module({
    controllers: [AdminController],
    providers: [AdminService, PrismaService],
    exports: [AdminService],
    imports: [TagsModule],
})
export class AdminModule {}