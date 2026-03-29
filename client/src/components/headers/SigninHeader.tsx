import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function SigninHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass sticky top-0 z-50 transition-colors duration-300 border-b border-[var(--glass-border)]">
      <div className="container mx-auto flex flex-wrap p-4 flex-row items-center justify-between">
        <Link
          to="/"
          className="flex font-sans font-medium items-center text-[var(--text-primary)] hover:opacity-80 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-[var(--accent)] rounded-lg shadow-lg flex-shrink-0"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="ml-3 text-2xl font-bold tracking-tight hidden sm:block">SkyCompile</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--glass-border)] transition-colors focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
