import { ActionFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { prisma } from "~/services/database.server";
import { TodoItem } from "./todo-item";

export default function Todos() {
  const { todos, itemsLeft } = useLoaderData<typeof loader>();
  const createFetcher = useFetcher();

  return (
    <div className="container max-w-screen-2xl">
      <h1 className="text-center text-3xl font-semibold tracking-tight">
        Todos
      </h1>

      <Card className="md:max-w-xl mx-auto mt-6">
        <CardHeader>
          <createFetcher.Form method="post">
            <input type="hidden" name="intent" value="create" />
            <Input placeholder="What needs to be done?" name="content" />
          </createFetcher.Form>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {todos.map((todo) => (
              <Fragment key={`todo-${todo.id}`}>
                <TodoItem todo={todo} />
              </Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-1 items-center justify-between">
            <span>{itemsLeft} items left!</span>
            <ToggleGroup type="single">
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="active">Active</ToggleGroupItem>
              <ToggleGroupItem value="completed">Completed</ToggleGroupItem>
            </ToggleGroup>
            <Button variant="ghost">Clear completed</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export const loader = async () => {
  const todos = await prisma.todo.findMany();
  const itemsLeft = todos.filter((todo) => !todo.completed).length;
  return json({ todos, itemsLeft });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const intent = formData.get("intent");
  switch (intent) {
    case "toggle": {
      const id = formData.get("id")?.toString();
      const todo = await prisma.todo.update({
        where: { id },
        data: { completed: formData.get("next") === "true" },
      });
      return json({ todo });
    }
    case "create": {
      const content = formData.get("content")?.toString() || "";
      const todo = await prisma.todo.create({ data: { content } });
      return json({ todo }, 201);
    }
    case "delete": {
      const id = formData.get("id")?.toString();
      await prisma.todo.delete({ where: { id } });
      return new Response(undefined, { status: 204 });
    }
    default:
      return new Response(undefined, { status: 422 });
  }

  return null;
};
