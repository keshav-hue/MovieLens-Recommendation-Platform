const prisma = require("../src/prisma");

async function main() {
  const users = [];

  for (let i = 1; i <= 610; i++) {
    users.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@movielens.com`,
      password_hash: "dummy",
    });
  }

  await prisma.User.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("Users imported");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());