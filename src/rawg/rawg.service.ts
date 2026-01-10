import { Injectable, HttpException } from "@nestjs/common";

@Injectable()
export class RawgService {
  private readonly BASE_URL = "https://api.rawg.io/api";
  private readonly API_KEY = process.env.RAWG_API_KEY;

  async getRetroCozyGames(page = 1) {
    const url =
      `${this.BASE_URL}/games` +
      `?key=${this.API_KEY}` +
      `&page=${page}` +
      `&page_size=20` +
      `&dates=1980-01-01,2005-12-31` +
      `&tags=relaxing,pixel-art,cute` +
      `&ordering=-rating`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new HttpException("RAWG error", res.status);
    }

    return res.json();
  }
}
