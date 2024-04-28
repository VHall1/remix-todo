import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { prisma } from "~/services/database.server";
import { requireUser } from "~/services/session.server";

export const schema = z.object({
  title: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id: userId } = await requireUser(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const title = submission.value.title;
  await prisma.todo.create({ data: { userId, title } });
  return submission.reply();
};
