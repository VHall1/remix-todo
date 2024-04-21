import { ActionFunctionArgs } from "@remix-run/node";
import { logout } from "~/services/session.server";

export const action = async ({ request }: ActionFunctionArgs) =>
  logout(request);
