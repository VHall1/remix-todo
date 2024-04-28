import {
  CheckIcon,
  MixerHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import * as React from "react";
import { Fragment } from "react";
import { Shell } from "~/components/shell";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { prisma } from "~/services/database.server";
import { requireUser } from "~/services/session.server";
import { NewForm } from "./new-form";
import { TodoItem } from "./todo-item";
import { Filter } from "./types";

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
      <div className="container md:max-w-xl">
        <div className="flex items-center sticky top-[calc(3.5rem+1px)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <Button size="sm" onClick={() => setOpen(true)}>
              <PlusIcon className="h-4 w-4 md:mr-1.5" />
              <span className="hidden md:inline">New todo</span>
            </Button>
          </div>
        </div>

        <div className="py-6 grid gap-2">
          {todos.map((todo) => (
            <Fragment key={`todo-${todo.id}`}>
              <TodoItem todo={todo} filter={filter} />
              <Separator className="my-1" />
            </Fragment>
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
      const title = formData.get("title")?.toString() || "";
      const todo = await prisma.todo.create({ data: { userId, title } });
      return json({ todo }, 201);
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
