import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { Fragment } from "react";
import { Shell } from "~/components/shell";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Toggle } from "~/components/ui/toggle";
import { prisma } from "~/services/database.server";
import { requireUser } from "~/services/session.server";
import { TodoItem } from "./todo-item";
import { Filter } from "./types";

export default function Todos() {
  const { todos, itemsLeft } = useLoaderData<typeof loader>();
  const location = useLocation();
  const createFetcher = useFetcher();
  const clearCompletedFetcher = useFetcher();

  const filter: Filter = location.pathname.endsWith("/completed")
    ? "completed"
    : location.pathname.endsWith("/active")
    ? "active"
    : "all";

  return (
    <Shell>
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
                  <TodoItem todo={todo} filter={filter} />
                  <Separator className="my-1" />
                </Fragment>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-1 items-center justify-between">
              <span>{itemsLeft} items left!</span>

              <div>
                <Toggle pressed={location.pathname.endsWith("/todos")} asChild>
                  <Link to="." prefetch="render">
                    All
                  </Link>
                </Toggle>
                <Toggle pressed={location.pathname.endsWith("/active")} asChild>
                  <Link to="active" prefetch="render">
                    Active
                  </Link>
                </Toggle>
                <Toggle
                  pressed={location.pathname.endsWith("/completed")}
                  asChild
                >
                  <Link to="completed" prefetch="render">
                    Completed
                  </Link>
                </Toggle>
              </div>

              <clearCompletedFetcher.Form method="post">
                <Button variant="ghost" name="intent" value="clearCompleted">
                  Clear completed
                </Button>
              </clearCompletedFetcher.Form>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Shell>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { id: userId } = await requireUser(request);
  const todos = await prisma.todo.findMany({ where: { userId } });
  const itemsLeft = await prisma.todo.count({
    where: { userId, completed: false },
  });

  return json({ todos, itemsLeft });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id: userId } = await requireUser(request);
  const formData = await request.formData();

  const intent = formData.get("intent");
  switch (intent) {
    case "toggle": {
      const id = formData.get("id")?.toString();
      const todo = await prisma.todo.update({
        where: { id, userId },
        data: { completed: formData.get("next") === "true" },
      });
      return json({ todo });
    }
    case "create": {
      const content = formData.get("content")?.toString() || "";
      const todo = await prisma.todo.create({ data: { userId, content } });
      return json({ todo }, 201);
    }
    case "delete": {
      const id = formData.get("id")?.toString();
      await prisma.todo.delete({ where: { id, userId } });
      return new Response(undefined, { status: 204 });
    }
    case "clearCompleted": {
      await prisma.todo.deleteMany({ where: { userId, completed: true } });
      return new Response(undefined, { status: 204 });
    }
    default:
      return new Response(undefined, { status: 422 });
  }
};
