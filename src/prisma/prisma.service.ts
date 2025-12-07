import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await (this.$connect as () => Promise<void>)(); // Conecta con la base de datos
    console.log('✅ Prisma conectada correctamente a la base de datos');
  }

  async onModuleDestroy(): Promise<void> {
    await (this.$disconnect as () => Promise<void>)(); // Desconecta al cerrar la app
  }
}
