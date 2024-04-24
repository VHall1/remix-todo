import { ActionFunctionArgs } from "@remix-run/node";
import {
  getThemeSession,
  themeKeys,
  themeStorage,
  type Theme,
} from "~/services/theme.server";
import { safeRedirect } from "~/utils/http.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const theme = formData.get("theme");

  // @ts-expect-error check if string is valid
  if (!theme || !themeKeys.includes(theme.toString()))
    return new Response(undefined, { status: 400 });
  const typedTheme = theme as Theme;

  const session = await getThemeSession(request);
  session.set("theme", typedTheme);
  return safeRedirect(formData.get("returnTo"), {
    headers: {
      "Set-Cookie": await themeStorage.commitSession(session),
    },
  });
};
