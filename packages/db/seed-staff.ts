import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create an Owner
  await prisma.user.upsert({
    where: { phone: '8888888888' },
    update: { role: 'OWNER', name: 'Admin Boss' },
    create: { phone: '8888888888', role: 'OWNER', name: 'Admin Boss' },
  });

  // Create a Chef
  await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: { role: 'CHEF', name: 'Head Chef' },
    create: { phone: '9999999999', role: 'CHEF', name: 'Head Chef' },
  });

  console.log('Seed completed: 8888888888 (OWNER) and 9999999999 (CHEF)');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
