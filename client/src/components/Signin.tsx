import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api/http";
import type { AuthResponse, SigninRequest } from "../types/database";
import { getFullName } from "../types/database";

export default function Signin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SigninRequest>({
    email: "test@user.com",
    password: "password123",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data: AuthResponse = await postRequest("/auth/signin", formData);
      
      // Store database-aligned user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[var(--bg-primary)] transition-colors duration-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md glass rounded-2xl p-10 flex flex-col shadow-2xl border border-[var(--glass-border)]"
      >
        <div className="text-center mb-8">
          <h2 className="text-[var(--text-primary)] text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-[var(--text-muted)] text-sm">Sign in to sync your collaborative environment.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[var(--text-muted)] text-sm font-medium mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@company.com"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[var(--card-surface)] text-[var(--text-primary)] border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[var(--text-muted)] text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[var(--card-surface)] text-[var(--text-primary)] border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-[var(--accent)] text-white font-bold py-3 px-4 rounded-lg hover:bg-[var(--accent-hover)] transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/50"
        >
          Sign In
        </button>

        {error && (
          <div className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-center">
            <p className="text-sm text-red-500 font-medium">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
