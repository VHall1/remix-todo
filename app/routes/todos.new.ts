import { SubmissionResult } from "@conform-to/react";
import { Todo } from "@prisma/client";
import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/node";
import { createTodo } from "~/actions/create-todo.server";
import { requireUser } from "~/services/session.server";

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<
  TypedResponse<{
    lastResult: SubmissionResult<string[]>;
    todo?: Todo;
  }>
> => {
  const { id: userId } = await requireUser(request);
  const formData = await request.formData();
  const { form, data } = await createTodo(formData, { userId });
  if (!data) {
    return json({ lastResult: form });
  }
  return json({ todo: data.todo, lastResult: form }, 201);
};
