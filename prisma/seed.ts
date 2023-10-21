import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const saltRounds = 10;

async function main() {
  const passwordDelv = await bcrypt.hash('password-delv', saltRounds);
  const passwordTest = await bcrypt.hash('password-test', saltRounds);
  const user1 = await prisma.user.upsert({
    where: { email: 'delvoid.dev@gmail.com' },
    update: {
      password: passwordDelv,
    },
    create: {
      email: 'delvoid.dev@gmail.com',
      name: 'Delvoid',
      password: passwordDelv,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {
      password: passwordTest,
    },
    create: {
      email: 'test@example.com',
      name: 'Delvoid Test',
      password: passwordTest,
    },
  });

  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
      authorId: user1.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {
      authorId: user2.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
      authorId: user2.id,
    },
  });

  console.log({ post1, post2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
