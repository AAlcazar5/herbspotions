"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export function ThemeToggleShadcn() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initialTheme: "light" | "dark";
    try {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        initialTheme = "dark";
      } else if (storedTheme === "light") {
        initialTheme = "light";
      } else {
        initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
    } catch (error) {
       console.error("Error accessing theme preference:", error);
       initialTheme = "light";
    }

    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
       console.error("Error saving theme preference:", error);
    }
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
     return (
        <Button variant="outline" size="icon" className="cursor-pointer" disabled>
           <div className="h-[1.2rem] w-[1.2rem]" />
        </Button>
     );
  }

  return (
    <Button variant="outline" size="icon" className="cursor-pointer" onClick={toggleTheme}>
      <FontAwesomeIcon
        icon={faSun}
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <FontAwesomeIcon
        icon={faMoon}
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}