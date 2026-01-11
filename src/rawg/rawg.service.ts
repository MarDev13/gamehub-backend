import { Injectable } from "@nestjs/common";

@Injectable()
export class RawgService {
  private readonly API_KEY = process.env.RAWG_API_KEY;
  private readonly BASE_URL = "https://api.rawg.io/api";

  async getRetroCozyGames(page = 1, pageSize = 20) {
    const res = await fetch(
      `${this.BASE_URL}/games?key=${this.API_KEY}` +
      `&dates=1980-01-01,2005-12-31` +
      `&tags=relaxing,pixel-art,cute` +
      `&ordering=-rating` +
      `&page=${page}&page_size=${pageSize}`
    );

    if (!res.ok) {
      throw new Error("RAWG fetch failed");
    }

    return res.json();
  }
}


