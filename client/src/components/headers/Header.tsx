
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto flex flex-wrap p-4 flex-row items-center justify-between">
        <Link to="/" className="flex font-sans font-medium items-center text-[var(--text-primary)] hover:opacity-80 transition-opacity">
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
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-2xl font-bold tracking-tight">SkyCompile</span>
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
              <Moon className="w-5 h-5 text-[var(--accent)]" />
            )}
          </button>
          
          <Link
            to="/signin"
            className="inline-flex items-center justify-center font-medium text-[var(--text-primary)] hover:text-[var(--accent)] hover:opacity-80 transition-colors px-4 py-2 sm:ml-2"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="inline-flex items-center justify-center font-medium bg-[var(--accent)] text-white border-0 py-2 px-6 focus:outline-none hover:bg-[var(--accent-hover)] rounded-full text-sm shadow-md transition-all sm:ml-4"
          >
            Get Started
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
