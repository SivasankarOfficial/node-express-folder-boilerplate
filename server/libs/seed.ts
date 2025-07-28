import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
