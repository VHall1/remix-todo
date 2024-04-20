import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "./database.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage<{ userId: string }>({
  cookie: {
    name: "remix-todo__session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    // 7 days
    maxAge: 60 * 60 * 24 * 7,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request) {
  const session = await getSession(request);
  return session.get("userId");
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function requireUserId(request: Request): Promise<string> {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/login");
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const logoutResponse = await logout(request);
    throw logoutResponse;
  }
  return user;
}

export async function createUserSession(request: Request, userId: string) {
  const session = await getSession(request);
  session.set("userId", userId);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}


