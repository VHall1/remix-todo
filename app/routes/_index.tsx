import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUser } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) return redirect("/todos");
  else return redirect("/login");
}
