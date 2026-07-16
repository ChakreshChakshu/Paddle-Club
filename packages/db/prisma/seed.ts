import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create a hardcoded Test User (for our V1 flows)
  const testUser = await prisma.user.upsert({
    where: { phone: '1234567890' },
    update: {},
    create: {
      phone: '1234567890',
      name: 'Test Player',
      email: 'test@paddleclub.com',
      role: 'CUSTOMER',
    },
  });
  console.log(`Created test user with id: ${testUser.id}`);

  // 2. Create an Admin/Owner user
  const adminUser = await prisma.user.upsert({
    where: { phone: '0987654321' },
    update: {},
    create: {
      phone: '0987654321',
      name: 'Club Owner',
      email: 'admin@paddleclub.com',
      role: 'OWNER',
    },
  });
  console.log(`Created admin user with id: ${adminUser.id}`);

  // 3. Wipe and Seed Courts
  await prisma.booking.deleteMany();
  await prisma.court.deleteMany();

  const courts = [
    { name: 'The Paddle Court', sportType: 'PICKLEBALL', surface: 'Aesthetic Acrylic', hourlyRate: 400, lighting: true },
  ];

  for (const courtData of courts) {
    // We don't have a unique field like name, so we just clear courts later or use a different approach.
    // For simplicity, let's just create them if there are no courts.
    const existingCourts = await prisma.court.findFirst({ where: { name: courtData.name } });
    if (!existingCourts) {
      const court = await prisma.court.create({ data: courtData });
      console.log(`Created court: ${court.name}`);
    } else {
      console.log(`Court already exists: ${existingCourts.name}`);
    }
  }

  // 4. Seed Cafe Brio Menu Items
  const menuItems = [
    { name: 'Iced Latte', category: 'Coffee', price: 150, available: true, description: 'Chilled espresso with milk over ice.' },
    { name: 'Hot Cappuccino', category: 'Coffee', price: 120, available: true, description: 'Classic espresso with steamed milk foam.' },
    { name: 'Avocado Toast', category: 'Snacks', price: 250, available: true, description: 'Smashed avocado on sourdough bread.' },
    { name: 'Protein Smoothie', category: 'Smoothies', price: 200, available: true, description: 'Post-match recovery smoothie.' },
    { name: 'Truffle Fries', category: 'Snacks', price: 180, available: true, description: 'Crispy fries with truffle oil and parmesan.' },
    { name: 'Seasonal Fruit Bowl', category: 'Snacks', price: 150, available: false, description: 'Freshly cut seasonal fruits.' },
  ];

  for (const itemData of menuItems) {
    const existingItem = await prisma.menuItem.findFirst({ where: { name: itemData.name } });
    if (!existingItem) {
      const item = await prisma.menuItem.create({ data: itemData });
      console.log(`Created menu item: ${item.name}`);
    } else {
      console.log(`Menu item already exists: ${existingItem.name}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
