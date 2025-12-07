import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando roles iniciales...');

  await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  });

  await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  console.log('Roles creados ✔️');

  console.log('🌱 Creando usuario admin...');

  const hashedPassword = await bcrypt.hash('admin1234', 10);

  await prisma.user.upsert({
    where: { email: 'admin@matchxp.com' },
    update: {},
    create: {
      email: 'admin@matchxp.com',
      password: hashedPassword,
      userName: 'admin',

 
      firstName: 'Admin',
      lastName: 'User',

 
      role: { connect: { name: 'ADMIN' } },
    },
  });

  console.log('Admin creado ✔️');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
