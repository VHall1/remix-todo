import { useFetcher } from "@remix-run/react";
import { useRootData } from "./use-root-data";
import { Theme } from "~/services/theme.server";

export const useTheme = () => {
  const { theme } = useRootData();
  const fetcher = useFetcher();

  const setTheme = (theme: Theme) => {
    fetcher.submit({ theme }, { action: "/set-theme", method: "post" });
  };

  return { theme, setTheme };
};
