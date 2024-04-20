import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const todos = await tx.todo.findMany();
    if (todos.length === 0) {
      console.log("No todos found in database. Nothing to update.");
      return;
    }

    const user = await tx.user.findFirst();
    if (!user) {
      throw "No users found. At least one user required to assign existing todos.";
    }

    for (const todo of todos) {
      console.log(`Updating todo: ${todo.id}`);
      await tx.todo.update({
        where: { id: todo.id },
        data: {
          userId: user.id,
        },
      });
    }

    console.log(`Updated ${todos.length} todos`);
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
