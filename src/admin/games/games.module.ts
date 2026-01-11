import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RawgModule } from 'src/rawg/rawg.module';

@Module({
    imports: [PrismaModule, RawgModule],
    controllers: [GamesController],
    providers: [GamesService]
})
export class GamesModule {}
