import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    console.log("Attempting login with:", { email: formData.email, password: "***" });
    console.log("API Base URL:", import.meta.env.VITE_USE_SPRING_BOOT === 'true' ? "http://localhost:8081/api/v1" : "http://localhost:3000/api/v1");

    try {
      const response = await fetch(`${import.meta.env.VITE_USE_SPRING_BOOT === 'true' ? "http://localhost:8081/api/v1" : "http://localhost:3000/api/v1"}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const data: AuthResponse = await response.json();
      console.log("Login successful:", data);
      
      // Store database-aligned user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Log full name for debugging
      console.log("User full name:", getFullName(data.user));
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex items-center justify-center bg-white"
    >
      <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 flex flex-col">
        <h2 className="text-gray-900 text-lg font-medium mb-5">
          Sign In
        </h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="mb-3 p-2 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="mb-4 p-2 rounded"
        />

        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
        >
          Sign In
        </button>

        {error && (
          <p className="mt-4 text-sm text-center text-red-600">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
