import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const solarPanelsCategory = await prisma.category.upsert({
    where: { slug: 'solar-panels' },
    update: {},
    create: {
      name: 'Solar Panels',
      slug: 'solar-panels',
      description: 'High-efficiency solar panels for residential and commercial use',
    },
  });

  const invertersCategory = await prisma.category.upsert({
    where: { slug: 'inverters' },
    update: {},
    create: {
      name: 'Inverters',
      slug: 'inverters',
      description: 'Power inverters to convert DC to AC electricity',
    },
  });

  const batteryStorageCategory = await prisma.category.upsert({
    where: { slug: 'battery-storage' },
    update: {},
    create: {
      name: 'Solar Battery Storage',
      slug: 'battery-storage',
      description: 'Energy storage solutions for solar systems',
    },
  });

  // Create a test vendor
  const testUser = await prisma.user.upsert({
    where: { email: 'vendor@test.com' },
    update: {},
    create: {
      email: 'vendor@test.com',
      name: 'Test Vendor',
      role: 'VENDOR',
    },
  });

  const testVendor = await prisma.vendor.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      businessName: 'SolarTech Solutions',
      businessEmail: 'vendor@test.com',
      businessPhone: '+1234567890',
      status: 'APPROVED',
      approvedAt: new Date(),
    },
  });

  // Create sample products
  const products = [
    {
      sku: 'JA-SOLAR-375W-001',
      name: 'JA Solar JAM60S20 375/MR 365-390 1000V Silver Frame QC 4.10',
      slug: 'ja-solar-jam60s20-375-mr-365-390-1000v-silver-frame-qc-4-10',
      description: 'High-efficiency JA Solar panel with 375W power output, featuring silver frame and QC 4.10 connectors. Perfect for residential and commercial installations.',
      shortDescription: '375W JA Solar panel with silver frame',
      price: 25.88,
      stock: 806,
      wattage: 375,
      voltage: 1000,
      panelType: 'Monofacial, P-Type',
      efficiency: 20.2,
      warranty: 25,
      dimensions: '1052 x 1769 x 35',
      weight: 20.5,
      images: ['/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png'],
      thumbnail: '/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png',
      status: 'ACTIVE' as const,
      publishedAt: new Date(),
      categoryIds: [solarPanelsCategory.id],
    },
    {
      sku: 'JA-SOLAR-380W-001',
      name: 'JA Solar JAM60S20 380/MR 365-390 1000V Silver Frame QC 4.10',
      slug: 'ja-solar-jam60s20-380-mr-365-390-1000v-silver-frame-qc-4-10',
      description: 'High-efficiency JA Solar panel with 380W power output, featuring silver frame and QC 4.10 connectors. Ideal for maximizing energy production.',
      shortDescription: '380W JA Solar panel with silver frame',
      price: 26.20,
      stock: 1200,
      wattage: 380,
      voltage: 1000,
      panelType: 'Monofacial, P-Type',
      efficiency: 20.4,
      warranty: 25,
      dimensions: '1052 x 1769 x 35',
      weight: 20.5,
      images: ['/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png'],
      thumbnail: '/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png',
      status: 'ACTIVE' as const,
      publishedAt: new Date(),
      categoryIds: [solarPanelsCategory.id],
    },
    {
      sku: 'JA-SOLAR-365W-001',
      name: 'JA Solar JAM60S20 365/MR 365-390 1000V Silver Frame QC 4.10',
      slug: 'ja-solar-jam60s20-365-mr-365-390-1000v-silver-frame-qc-4-10',
      description: 'High-efficiency JA Solar panel with 365W power output, featuring silver frame and QC 4.10 connectors. Excellent value for money.',
      shortDescription: '365W JA Solar panel with silver frame',
      price: 25.20,
      stock: 500,
      wattage: 365,
      voltage: 1000,
      panelType: 'Monofacial, P-Type',
      efficiency: 19.8,
      warranty: 25,
      dimensions: '1052 x 1769 x 35',
      weight: 20.5,
      images: ['/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png'],
      thumbnail: '/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png',
      status: 'ACTIVE' as const,
      publishedAt: new Date(),
      categoryIds: [solarPanelsCategory.id],
    },
    {
      sku: 'SOLAREDGE-SE5000-001',
      name: 'SolarEdge SE5000 Power Optimizer Inverter',
      slug: 'solaredge-se5000-power-optimizer-inverter',
      description: 'SolarEdge SE5000 power optimizer inverter with advanced monitoring capabilities and high efficiency conversion.',
      shortDescription: '5000W SolarEdge power optimizer inverter',
      price: 850.00,
      stock: 50,
      wattage: 5000,
      voltage: 400,
      panelType: 'Power Optimizer',
      efficiency: 99.5,
      warranty: 12,
      dimensions: '400 x 300 x 150',
      weight: 8.5,
      images: ['/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png'],
      thumbnail: '/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png',
      status: 'ACTIVE' as const,
      publishedAt: new Date(),
      categoryIds: [invertersCategory.id],
    },
    {
      sku: 'TESLA-POWERWALL-001',
      name: 'Tesla Powerwall 2 Home Battery Storage',
      slug: 'tesla-powerwall-2-home-battery-storage',
      description: 'Tesla Powerwall 2 home battery storage system with 13.5kWh capacity and integrated inverter.',
      shortDescription: '13.5kWh Tesla Powerwall 2 battery storage',
      price: 8500.00,
      stock: 25,
      wattage: 5000,
      voltage: 400,
      panelType: 'Lithium-ion Battery',
      efficiency: 90.0,
      warranty: 10,
      dimensions: '1150 x 755 x 155',
      weight: 114,
      images: ['/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png'],
      thumbnail: '/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png',
      status: 'ACTIVE' as const,
      publishedAt: new Date(),
      categoryIds: [batteryStorageCategory.id],
    },
  ];

  for (const productData of products) {
    const { categoryIds, ...productInfo } = productData;
    
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: {
        ...productInfo,
        vendor: {
          connect: { id: testVendor.id }
        },
        categories: {
          connect: categoryIds.map(id => ({ id })),
        },
      },
    });

    console.log(`✅ Created product: ${product.name}`);
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });