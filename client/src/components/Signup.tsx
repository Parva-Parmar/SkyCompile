import { useState } from "react";
import { postRequest } from "../api/http";
import { useNavigate } from "react-router-dom";
import type { AuthResponse, SignupRequest } from "../types/database";
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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-96"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

      <input
        name="firstname"
        placeholder="First Name"
        onChange={handleChange}
        className="mb-3 p-2 rounded"
      />

      <input
        name="lastname"
        placeholder="Last Name"
        onChange={handleChange}
        className="mb-3 p-2 rounded"
      />

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
        className="mb-3 p-2 rounded"
      />

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        onChange={handleChange}
        className="mb-4 p-2 rounded"
      />

      <button
        type="submit"
        className="bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
      >
        Sign Up
      </button>

      {message && (
        <p className="mt-4 text-sm text-center text-red-600">
          {message}
        </p>
      )}
    </form>
  );
}
