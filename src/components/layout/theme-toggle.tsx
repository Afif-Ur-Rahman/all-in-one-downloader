"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components";

export const ThemeToggle = () => {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // storage unavailable (private mode), the toggle still works for this visit
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      icon={
        <>
          <Sun className="hidden dark:block" />
          <Moon className="dark:hidden" />
        </>
      }
    />
  );
};
