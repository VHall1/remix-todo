import { parseWithZod } from "@conform-to/zod";
import { prisma } from "~/services/database.server";
import { schema } from "./create-todo";

export const createTodo = async (
  formData: FormData,
  { userId }: { userId: string }
) => {
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return { form: submission.reply() };
  }

  const title = submission.value.title;
  const todo = await prisma.todo.create({ data: { userId, title } });
  return {
    data: { todo },
    form: submission.reply(),
  };
};
