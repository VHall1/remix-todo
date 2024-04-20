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
import { createHead } from "remix-island";
import { getUser } from "./services/session.server";
import "./tailwind.css";

export const Head = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta />
    <Links />
  </>
));

export function Layout({ children }: { children: ReactNode }) {
  const { sha } = useLoaderData<typeof loader>();

  return (
    <>
      <Head />
      <div id="git-revision" className="hidden">
        {sha}
      </div>
      {children}
      <ScrollRestoration />
      <Scripts />
    </>
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
