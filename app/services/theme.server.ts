import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.THEME_SECRET, "THEME_SECRET must be set");

export const themeKeys = ["dark", "light"] as const;
export type Theme = (typeof themeKeys)[number];

export const themeStorage = createCookieSessionStorage<{ theme: Theme }>({
  cookie: {
    name: "remix-todo__theme",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.THEME_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export function getThemeSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return themeStorage.getSession(cookie);
}

export async function getTheme(request: Request) {
  const session = await getThemeSession(request);
  return session.get("theme");
}
