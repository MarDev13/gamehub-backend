import { Controller, Get, Query } from "@nestjs/common";
import { RawgService } from "../rawg/rawg.service";

@Controller("shop")
export class ShopController {
  constructor(private readonly rawgService: RawgService) {}

  @Get("games")
  async getGames(@Query("page") page = "1") {
    const data = await this.rawgService.getRetroCozyGames(Number(page));

    return {
      results: data.results,
      hasMore: !!data.next,
    };
  }
}
