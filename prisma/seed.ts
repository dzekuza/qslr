import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main () {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminEmail = 'admin@solar.com'
  const adminPassword = 'Admin123!'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date()
    }
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'monocrystalline' },
      update: {},
      create: {
        name: 'Monocrystalline',
        slug: 'monocrystalline',
        description: 'High-efficiency monocrystalline solar panels'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'polycrystalline' },
      update: {},
      create: {
        name: 'Polycrystalline',
        slug: 'polycrystalline',
        description: 'Cost-effective polycrystalline solar panels'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'thin-film' },
      update: {},
      create: {
        name: 'Thin-Film',
        slug: 'thin-film',
        description: 'Flexible thin-film solar panels'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'mounting' },
      update: {},
      create: {
        name: 'Mounting & Installation',
        slug: 'mounting',
        description: 'Mounting systems and installation equipment'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'inverters' },
      update: {},
      create: {
        name: 'Inverters',
        slug: 'inverters',
        description: 'Solar inverters and power electronics'
      }
    })
  ])

  console.log('✅ Categories created:', categories.map(c => c.name).join(', '))

  console.log('🌱 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
