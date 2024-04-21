import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { comparePassword } from "~/services/crypto.server";
import { prisma } from "~/services/database.server";
import { createUserSession } from "~/services/session.server";

export default function Login() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <div className="pt-12">
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={fields.email.id}>Email</Label>
                <Input
                  id={fields.email.id}
                  name={fields.email.name}
                  type="email"
                />
                <small className="text-destructive">
                  {fields.email.errors}
                </small>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor={fields.password.id}>Password</Label>
                  {/* TODO: forgot password logic */}
                  {/* <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link> */}
                </div>
                <Input
                  id={fields.password.id}
                  name={fields.password.name}
                  type="password"
                />
                <small className="text-destructive">
                  {fields.password.errors}
                </small>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <small className="text-destructive text-center">
                {form.errors}
              </small>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const { email, password } = submission.value;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { password: { select: { hash: true } } },
  });

  if (!user || !user.password) {
    return json(
      submission.reply({
        formErrors: ["Email or password invalid"],
      })
    );
  }

  const isPasswordCorrect = await comparePassword(password, user.password.hash);
  if (!isPasswordCorrect) {
    return json(
      submission.reply({
        formErrors: ["Email or password invalid"],
      })
    );
  }

  return createUserSession(request, user.id);
};
