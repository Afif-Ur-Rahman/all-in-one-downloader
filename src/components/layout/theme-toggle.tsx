"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components";
import { toggleTheme } from "@/lib/theme";

export const ThemeToggle = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      icon={
        <>
          <Sun className="hidden animate-scale-in dark:block" />
          <Moon className="animate-scale-in dark:hidden" />
        </>
      }
    />
  );
};
