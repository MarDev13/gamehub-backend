import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { PrismaService } from "../prisma/prisma.service";
import { TagsModule } from './tags/tags.module';
import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';
import { GamesModule } from './games/games.module';
import { PlatformsModule } from './platforms/platforms.module';
import { UsersModule } from './users/users.module';
@Module({
    controllers: [AdminController, GamesController],
    providers: [AdminService, PrismaService, GamesService],
    exports: [AdminService],
    imports: [TagsModule, GamesModule, PlatformsModule, UsersModule],
})
export class AdminModule {}