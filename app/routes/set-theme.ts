import { LoaderFunctionArgs } from "@remix-run/node";
import {
  getThemeSession,
  themeKeys,
  themeStorage,
  type Theme,
} from "~/services/theme.server";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const theme = formData.get("theme");

  // @ts-expect-error check if string is valid
  if (!theme || !themeKeys.includes(theme.toString()))
    return new Response(undefined, { status: 400 });
  const typedTheme = theme as Theme;

  const session = await getThemeSession(request);
  session.set("theme", typedTheme);
  return new Response(undefined, {
    headers: { "Set-Cookie": await themeStorage.commitSession(session) },
    status: 204,
  });
};
