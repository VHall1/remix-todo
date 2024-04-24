import {
  DiscIcon,
  GitHubLogoIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { ThemeForm, useTheme } from "~/utils/theme";
import { LogoutForm, useUser } from "~/utils/user";
import { Button } from "./ui/button";

export function Navbar() {
  const theme = useTheme();
  const user = useUser();

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
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/vhall1/remix-todo">
              <GitHubLogoIcon className="w-5 h-5" />
            </a>
          </Button>
          <ThemeForm>
            <input
              type="hidden"
              name="theme"
              value={theme === "light" ? "dark" : "light"}
            />
            <Button variant="ghost" size="icon" type="submit">
              {ThemeIcon}
            </Button>
          </ThemeForm>
          {user ? (
            <LogoutForm>
              <Button variant="ghost" type="submit">
                Logout
              </Button>
            </LogoutForm>
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
