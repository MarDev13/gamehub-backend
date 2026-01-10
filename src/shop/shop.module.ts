import { Module } from "@nestjs/common";
import { ShopController } from "./shop.controller";
import { RawgService } from "../rawg/rawg.service";

@Module({
  controllers: [ShopController],
  providers: [RawgService],
})
export class ShopModule {}
