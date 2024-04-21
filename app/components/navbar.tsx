import { DiscIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { useTheme } from "~/hooks/use-theme";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  let ThemeIcon = <MoonIcon className="w-5 h-5" />;
  if (theme === "light") {
    ThemeIcon = <SunIcon className="w-5 h-5" />;
  }

  return (
    <header className="sticky top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-2xl h-14 flex items-center">
        <Link to="/" className="flex items-center text-lg font-semibold">
          <DiscIcon className="w-6 h-6 mr-1.5" />
          TodoMVC
        </Link>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {ThemeIcon}
          </Button>
        </div>
      </div>
    </header>
  );
}
