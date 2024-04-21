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
import "./tailwind.css";

export function Layout({ children }: { children: ReactNode }) {
  const { sha } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="dark">
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
  return (
    <main className="pt-12 h-full">
      <Outlet />
    </main>
  );
}

export const meta: MetaFunction = () => {
  return [{ title: "Remix TodoMVC" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return json({ user, sha: process.env.GIT_REVISION });
};
