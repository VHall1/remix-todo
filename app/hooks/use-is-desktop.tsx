import { useMediaQuery } from "react-responsive";

export function useIsDesktop() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  return isDesktop;
}
