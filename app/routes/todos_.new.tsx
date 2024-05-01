import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createTodo, schema } from "~/actions/create-todo";
import { Shell } from "~/components/shell";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { requireUser } from "~/services/session.server";

export default function TodosNew() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Shell>
      <div className="container max-w-xl">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1.5">
              <Input
                placeholder="What needs to be done?"
                name={fields.title.name}
              />
              <small>{fields.title.errors}</small>
            </div>
            <Button type="submit" className="mr-auto">
              Create task
            </Button>
          </div>
        </Form>
      </div>
    </Shell>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id: userId } = await requireUser(request);
  const formData = await request.formData();
  const { form, data } = await createTodo(formData, { userId });
  if (!data) {
    return form;
  }
  return redirect("/todos");
};
