import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
 
  constructor(private readonly prisma: PrismaService){}

  getHello(): string {
    return 'Hola a la mejor desarrolladora 💛';
  }

  async dbHealth(){
    const users = await this.prisma.user.count();
    const roles = await this.prisma.role.count();
    const sessions = await this.prisma.session.count();

    return {
      ok: true,
      users,
      roles,
      sessions
    };
  }
}
