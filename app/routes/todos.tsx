import { ActionFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { prisma } from "~/services/database.server";
import { cn } from "~/utils/cn";

export default function Todos() {
  const { todos, itemsLeft } = useLoaderData<typeof loader>();
  const toggleFetcher = useFetcher();

  return (
    <div className="container max-w-screen-2xl">
      <h1 className="pb-2 text-center text-3xl font-semibold tracking-tight">
        Todos
      </h1>

      <Card>
        <CardHeader>
          <Input placeholder="What needs to be done?" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {todos.map((todo) => (
              <toggleFetcher.Form method="post" key={todo.id}>
                <input type="hidden" name="id" value={todo.id} />
                <input
                  type="hidden"
                  name="completed"
                  value={todo.completed.toString()}
                />
                <Button
                  variant="ghost"
                  type="submit"
                  className={cn("w-full", { "line-through": todo.completed })}
                >
                  {todo.content}
                </Button>
              </toggleFetcher.Form>
            ))}
          </div>
        </CardContent>
        <CardFooter>{itemsLeft} items left!</CardFooter>
      </Card>
    </div>
  );
}

export const loader = async () => {
  const todos = await prisma.todo.findMany();
  const itemsLeft = todos.filter((todo) => !todo.completed).length;
  return { todos, itemsLeft };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // TODO: validate input
  const formData = await request.formData();
  const id = formData.get("id")?.toString();
  await prisma.todo.update({
    where: { id },
    data: { completed: !(formData.get("completed") == "true") },
  });
  return json({ ok: true });
};
