import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { ReactNode } from "react";
import { getUser } from "./services/session.server";
import { getTheme } from "./services/theme.server";
import "./tailwind.css";
import { cn } from "./utils/cn";

export function Layout({ children }: { children: ReactNode }) {
  const { sha, theme } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className={cn({ dark: theme !== "light" })}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen" suppressHydrationWarning>
        <div id="git-revision" className="hidden">
          {sha}
        </div>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const meta: MetaFunction = () => {
  return [{ title: "Remix TodoMVC" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [user, theme] = await Promise.all([
    getUser(request),
    getTheme(request),
  ]);
  return json({ user, theme, sha: process.env.GIT_REVISION });
};
