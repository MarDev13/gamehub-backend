import { Body, Controller, Post, UseGuards, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ApiBody, ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('register')
  @ApiBody({
    schema: {
      example: {
        email: "user@example.com",
        password: "Password123!",
        username: "pepe123",
        firstName: "Pepe",
        lastName: "García",
      }
    }
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  @ApiBody({
    schema: {
      example: {
        email: "user@example.com",
        password: "Password123!"
      }
    }
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  getMe(@Req() req) {
    return req.user;
  }
}