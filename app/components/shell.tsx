import type { ReactNode } from "react";
import { Navbar } from "./navbar";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-12">{children}</main>
    </>
  );
}
