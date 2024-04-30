import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { schema } from "~/actions/create-todo";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { useIsDesktop } from "~/hooks/use-is-desktop";
import { action } from "./route";

export function NewForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isDesktop = useIsDesktop();
  const fetcher = useFetcher<typeof action>();
  const lastResult = fetcher.data?.lastResult
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  useEffect(() => {
    if (lastResult?.status === "success") {
      setOpen(false);
    }
  }, [fetcher.state, lastResult?.status, setOpen]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
          </DialogHeader>
          <InternalForm fetcher={fetcher} form={form} fields={fields} />
          <DialogFooter>
            <Button type="submit" form={form.id}>
              Create task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New task</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <InternalForm fetcher={fetcher} form={form} fields={fields} />
        </div>
        <DrawerFooter className="pt-2">
          <Button type="submit" form={form.id}>
            Create task
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type FormHookReturnType = ReturnType<
  typeof useForm<{ title: string }, { title: string }, string[]>
>;
function InternalForm({
  fetcher,
  form,
  fields,
}: {
  fetcher: ReturnType<typeof useFetcher<typeof action>>;
  form: FormHookReturnType[0];
  fields: FormHookReturnType[1];
}) {
  return (
    <>
      <fetcher.Form method="post" id={form.id} onSubmit={form.onSubmit} />
      <input type="hidden" name="intent" value="create" form={form.id} />
      <div>{form.errors}</div>
      <Input
        placeholder="What needs to be done?"
        name={fields.title.name}
        form={form.id}
      />
      <small>{fields.title.errors}</small>
    </>
  );
}
