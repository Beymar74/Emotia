import "dotenv/config";
import prisma from "../src/lib/prisma";
import { seedCategorias } from "./seeds/categorias";

async function main() {
  console.log("🌱 Insertando categorías base...");
  await seedCategorias(prisma);
  console.log("✅ Categorías listas");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });