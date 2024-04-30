import {
  CheckIcon,
  MixerHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import * as React from "react";
import { Shell } from "~/components/shell";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { prisma } from "~/services/database.server";
import { requireUser } from "~/services/session.server";
import { NewForm } from "./new-form";
import { TodoItem } from "./todo-item";
import { Filter } from "./types";
import { createTodo } from "~/actions/create-todo.server";

export default function Todos() {
  const [open, setOpen] = React.useState(false);
  const { todos } = useLoaderData<typeof loader>();
  const location = useLocation();

  const filter: Filter = location.pathname.endsWith("/completed")
    ? "completed"
    : location.pathname.endsWith("/active")
    ? "active"
    : "all";

  return (
    <Shell>
      <div className="container max-w-xl">
        <div className="flex items-center">
          <h1 className="text-3xl font-semibold tracking-tight">Todos</h1>
          <div className="ml-auto flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="border-dashed">
                  <MixerHorizontalIcon className="h-4 w-4 md:mr-1.5" />
                  <span className="hidden md:inline">Filters</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="grid">
                <Link
                  to="."
                  prefetch="render"
                  className="flex items-center gap-2 py-1.5"
                >
                  {location.pathname.endsWith("/todos") ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : null}
                  All
                </Link>
                <Link
                  to="active"
                  prefetch="render"
                  className="flex items-center gap-2 py-1.5"
                >
                  {location.pathname.endsWith("/active") ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : null}
                  Active
                </Link>
                <Link
                  to="completed"
                  prefetch="render"
                  className="flex items-center gap-2 py-1.5"
                >
                  {location.pathname.endsWith("/completed") ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : null}
                  Completed
                </Link>
              </PopoverContent>
            </Popover>
            <Button
              size="sm"
              onClick={() => setOpen(true)}
              className="noscript-hidden"
            >
              <PlusIcon className="h-4 w-4 md:mr-1.5" />
              <span className="hidden md:inline">New todo</span>
            </Button>
            <noscript>
              <Button size="sm" asChild>
                <Link to="/todos/new">
                  <PlusIcon className="h-4 w-4 md:mr-1.5" />
                  <span className="hidden md:inline">New todo</span>
                </Link>
              </Button>
            </noscript>
          </div>
        </div>

        <div className="pt-6 pb-3 grid gap-2">
          {todos.map((todo) => (
            <TodoItem todo={todo} filter={filter} key={`todo-${todo.id}`} />
          ))}
        </div>
      </div>

      <NewForm open={open} setOpen={setOpen} />
    </Shell>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { id: userId } = await requireUser(request);
  const todos = await prisma.todo.findMany({ where: { userId } });
  return json({ todos });
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
      const { form, data } = await createTodo(formData, { userId });
      if (!data) {
        return json({ lastResult: form });
      }
      return json({ todo: data.todo }, 201);
    }
    case "delete": {
      const id = formData.get("id")?.toString();
      await prisma.todo.delete({ where: { id, userId } });
      return new Response(undefined, { status: 204 });
    }
    default:
      return new Response(undefined, { status: 422 });
  }
};
