import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

// https://github.com/Xiphe/remix-island

startTransition(() => {
  hydrateRoot(
    document.getElementById("root")!,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
