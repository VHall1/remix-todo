import { parseWithZod } from "@conform-to/zod";
import { serverOnly$ } from "vite-env-only";
import { z } from "zod";
import { prisma } from "~/services/database.server";

export const schema = z.object({
  title: z.string(),
});

export const createTodo = serverOnly$(
  async (formData: FormData, { userId }: { userId: string }) => {
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
  }
)!;
