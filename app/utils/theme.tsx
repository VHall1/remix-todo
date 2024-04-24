import { useFetcher, useLocation } from "@remix-run/react";
import { ReactNode } from "react";
import { useRootData } from "~/hooks/use-root-data";

export const useTheme = () => {
  const { theme } = useRootData();
  return theme;
};

export const ThemeForm = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const fetcher = useFetcher();
  return (
    <fetcher.Form action="/set-theme" method="post">
      <input
        type="hidden"
        name="returnTo"
        value={location.pathname + location.search}
      />
      {children}
    </fetcher.Form>
  );
};
