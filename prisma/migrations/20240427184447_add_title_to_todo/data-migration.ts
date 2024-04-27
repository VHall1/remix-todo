import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const todos = await tx.todo.findMany();
    if (todos.length === 0) {
      console.log("No todos found in database. Nothing to update.");
      return;
    }

    for (const todo of todos) {
      console.log(`Updating todo: ${todo.id}`);
      await tx.todo.update({
        where: { id: todo.id },
        data: {
          title: todo.content,
          content: null,
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
