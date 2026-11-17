export const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle("dark");

  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {
    // storage unavailable (private mode), the toggle still works for this visit
  }
};
