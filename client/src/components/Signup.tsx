import { useState } from "react";
import { postRequest } from "../api/http";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "../types/database";
import { getFullName } from "../types/database";

// Form type that includes confirmPassword for validation
interface SignupForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupForm>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await postRequest("/auth/signup", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      });
      
      // Store token and user data if signup returns auth data
      if (res.token && res.user) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        
        // Log database-aligned user data
        console.log("Signup successful - User data:", res.user);
        console.log("User full name:", getFullName(res.user));
        
        navigate("/dashboard");
      } else {
        setMessage((res as any).message || "Signup successful! Please sign in.");
        navigate("/signin");
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[var(--bg-primary)] transition-colors duration-300 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg glass rounded-2xl p-10 flex flex-col shadow-2xl border border-[var(--glass-border)]"
      >
        <div className="text-center mb-8">
          <h2 className="text-[var(--text-primary)] text-3xl font-bold mb-2">Create an Account</h2>
          <p className="text-[var(--text-muted)] text-sm">Join SkyCompile and start collaborating today.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--text-muted)] text-sm font-medium mb-1">First Name</label>
              <input
                name="firstname"
                type="text"
                placeholder="John"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-[var(--card-surface)] text-[var(--text-primary)] border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] text-sm font-medium mb-1">Last Name</label>
              <input
                name="lastname"
                type="text"
                placeholder="Doe"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-[var(--card-surface)] text-[var(--text-primary)] border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all outline-none"
                required
              />
            </div>
          </div>

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

          <div>
            <label className="block text-[var(--text-muted)] text-sm font-medium mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
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
          Sign Up
        </button>

        {message && (
          <div className={`mt-6 p-3 rounded-lg border text-center ${message.includes("successful") ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-red-500/10 border-red-500/50 text-red-500"}`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
