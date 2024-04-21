import { useFetcher } from "@remix-run/react";
import { useRootData } from "./use-root-data";

export const useUser = () => {
  const { user } = useRootData();
  const fetcher = useFetcher();

  const logout = () => {
    fetcher.submit({}, { action: "/logout", method: "post" });
  };

  return { user, logout };
};
