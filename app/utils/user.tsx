import { useFetcher } from "@remix-run/react";
import { ReactNode } from "react";
import { useRootData } from "~/hooks/use-root-data";

export const useUser = () => {
  const { user } = useRootData();
  return user;
};

export const LogoutForm = ({ children }: { children: ReactNode }) => {
  const fetcher = useFetcher();
  return (
    <fetcher.Form action="/logout" method="post">
      {children}
    </fetcher.Form>
  );
};
