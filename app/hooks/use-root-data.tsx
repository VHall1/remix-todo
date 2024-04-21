import { useRouteLoaderData } from "@remix-run/react";
import { loader as rootLoader } from "~/root";

export const useRootData = () => useRouteLoaderData<typeof rootLoader>("root")!;
