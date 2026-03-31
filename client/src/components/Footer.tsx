import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)] text-[var(--text-muted)] border-t border-[var(--card-border)] transition-colors duration-300">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <Link to="/" className="flex font-sans font-medium items-center md:justify-start justify-center text-[var(--text-primary)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            className="w-8 h-8 text-white p-1.5 bg-[var(--accent)] rounded-lg shadow-sm"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="ml-3 text-xl font-semibold tracking-tight">SkyCompile</span>
        </Link>

        <p className="text-sm sm:ml-4 sm:pl-4 sm:border-l sm:border-[var(--card-border)] sm:py-2 sm:mt-0 mt-4">
          © {new Date().getFullYear()} SkyCompile — Building the future collaboratively.
        </p>

        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <a className="hover:text-[var(--accent)] cursor-pointer transition-colors">
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>
          <a className="ml-3 hover:text-[var(--accent)] cursor-pointer transition-colors">
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </a>
        </span>
      </div>
    </footer>
  );
}
