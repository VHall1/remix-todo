import {
  DiscIcon,
  GitHubLogoIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { useTheme } from "~/hooks/use-theme";
import { useUser } from "~/hooks/use-user";
import { Button } from "./ui/button";

export function Navbar() {
  // TODO: use fetcher forms instead of onClick for these
  // so they can still work without javascript enabled
  const { theme, setTheme } = useTheme();
  const { user, logout } = useUser();

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
        <div className="ml-auto flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <GitHubLogoIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {ThemeIcon}
          </Button>
          {user ? (
            <Button variant="ghost" onClick={() => logout()}>
              Logout
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
