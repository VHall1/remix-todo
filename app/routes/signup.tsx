import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Prisma, User } from "@prisma/client";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { hashPassword } from "~/services/crypto.server";
import { prisma } from "~/services/database.server";
import { createUserSession } from "~/services/session.server";

export default function Signup() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <div className="pt-12">
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
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
                <Label htmlFor={fields.password.id}>Password</Label>
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
                Create an account
              </Button>
              <small className="text-destructive text-center">
                {form.errors}
              </small>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Sign in
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
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const { email, password } = submission.value;
  const passwordHash = await hashPassword(password);

  let user: User;
  try {
    user = await prisma.user.create({
      data: { email, password: { create: { hash: passwordHash } } },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
      // (Unique constraint failed)
      // https://www.prisma.io/docs/orm/reference/error-reference#p2002
    ) {
      return json(
        submission.reply({
          formErrors: ["This email address is not available"],
        })
      );
    }

    throw error;
  }

  return createUserSession(request, user.id);
};
