import { Todo } from "@prisma/client";
import { TrashIcon } from "@radix-ui/react-icons";
import { SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/utils/cn";
import { Filter } from "./types";

export function TodoItem({ todo, filter }: TodoItemProps) {
  const toggleFetcher = useFetcher();
  const deleteFetcher = useFetcher();

  const shouldRender =
    filter === "all" ||
    (filter === "completed" && todo.completed) ||
    (filter === "active" && !todo.completed);
  if (!shouldRender) return null;

  const toggleFormId = `toggle-form-${todo.id}`;
  const deleteFormId = `delete-form-${todo.id}`;

  const completed = toggleFetcher.formData
    ? toggleFetcher.formData.get("next") === "true"
    : todo.completed;

  return (
    <>
      <toggleFetcher.Form id={toggleFormId} method="post" />
      <deleteFetcher.Form id={deleteFormId} method="post" />

      <input type="hidden" name="intent" value="toggle" form={toggleFormId} />
      <input type="hidden" name="id" value={todo.id} form={toggleFormId} />
      <input
        type="hidden"
        name="next"
        value={(!completed).toString()}
        form={toggleFormId}
      />

      <div className="flex items-center">
        <label
          htmlFor={`task-${todo.id}`}
          className={cn("flex items-center flex-1", {
            "line-through": completed,
          })}
        >
          <Checkbox
            id={`task-${todo.id}`}
            defaultChecked={completed}
            className="mr-2"
            type="submit"
            form={toggleFormId}
          />
          {todo.content}
        </label>

        <input type="hidden" name="intent" value="delete" form={deleteFormId} />
        <input type="hidden" name="id" value={todo.id} form={deleteFormId} />
        <Button size="icon" variant="ghost" form={deleteFormId}>
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}

interface TodoItemProps {
  todo: SerializeFrom<Todo>;
  filter: Filter;
}
