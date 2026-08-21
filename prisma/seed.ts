import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { TEMPLATES } from "../src/data/templates";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const template of TEMPLATES) {
    await prisma.template.upsert({
      where: { code: template.code },
      update: { name: template.name, category: template.category, isActive: true },
      create: {
        code: template.code,
        name: template.name,
        category: template.category,
      },
    });
  }

  console.log(`Seed: ${TEMPLATES.length} ta shablon yozildi.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
