import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const pw = 'password';
  const hashed = await bcrypt.hash(pw, 10);

  // Tenants
  const acme = await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      name: 'Acme',
      slug: 'acme',
      plan: 'FREE',
    },
  });

  const globex = await prisma.tenant.upsert({
    where: { slug: 'globex' },
    update: {},
    create: {
      name: 'Globex',
      slug: 'globex',
      plan: 'FREE',
    },
  });

  // Users (admins and members)
  const adminAcme = await prisma.user.upsert({
    where: { email: 'admin@acme.test' },
    update: {},
    create: {
      email: 'admin@acme.test',
      password: hashed,
      role: 'ADMIN',
      tenantId: acme.id,
      name: 'Acme Admin',
    },
  });

  const userAcme = await prisma.user.upsert({
    where: { email: 'user@acme.test' },
    update: {},
    create: {
      email: 'user@acme.test',
      password: hashed,
      role: 'MEMBER',
      tenantId: acme.id,
      name: 'Acme Member',
    },
  });

  const adminGlobex = await prisma.user.upsert({
    where: { email: 'admin@globex.test' },
    update: {},
    create: {
      email: 'admin@globex.test',
      password: hashed,
      role: 'ADMIN',
      tenantId: globex.id,
      name: 'Globex Admin',
    },
  });

  const userGlobex = await prisma.user.upsert({
    where: { email: 'user@globex.test' },
    update: {},
    create: {
      email: 'user@globex.test',
      password: hashed,
      role: 'MEMBER',
      tenantId: globex.id,
      name: 'Globex Member',
    },
  });

  // Notes: create 3 notes for Acme (so Free-limit = 3 is reached)
  const acmeNotes = [
    { title: 'Acme: Welcome', content: 'Welcome to Acme notes!' },
    { title: 'Acme: Meeting notes', content: 'Meeting at 10 AM.' },
    { title: 'Acme: TODO', content: 'Finish the demo app.' },
  ];

  for (const n of acmeNotes) {
    await prisma.note.upsert({
      where: { id: `${acme.id}-${n.title}` },
      update: {},
      create: {
        id: `${acme.id}-${n.title}`,
        title: n.title,
        content: n.content,
        tenantId: acme.id,
        authorId: adminAcme.id,
      },
    });
  }

  // Globex: 1 sample note
  await prisma.note.upsert({
    where: { id: `${globex.id}-welcome` },
    update: {},
    create: {
      id: `${globex.id}-welcome`,
      title: 'Globex: Welcome',
      content: 'Welcome Globex!',
      tenantId: globex.id,
      authorId: adminGlobex.id,
    },
  });

  console.log('✅ Seed finished. Test accounts created:');
  console.log('  admin@acme.test / password (Admin, Acme)');
  console.log('  user@acme.test  / password (Member, Acme)');
  console.log('  admin@globex.test / password (Admin, Globex)');
  console.log('  user@globex.test  / password (Member, Globex)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
