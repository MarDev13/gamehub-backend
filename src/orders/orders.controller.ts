import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Body,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Req() req, @Body("total") total: number) {
    const userId = req.user.id;
    return this.ordersService.createOrder(userId, Number(total));
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMyOrders(@Req() req) {
    return this.ordersService.getMyOrders(req.user.id);
  }
}

