import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminController } from './admin/admin.controller';
import { UserController } from './user/user.controller';
import { GenresModule } from './admin/genres/genres.module';
import { AdminModule } from './admin/admin.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, GenresModule, AdminModule, ShopModule],
  controllers: [AppController, AdminController, UserController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
