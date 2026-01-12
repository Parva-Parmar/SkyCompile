import { useState } from "react";
import { postRequest } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function Signup() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      const res = await postRequest("/auth/signup", formData);
      setMessage(res.message || "Signup successful 🎉");
      navigate("/signin");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex items-center justify-center bg-white"
    >
      <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 flex flex-col">
        <h2 className="text-gray-900 text-lg font-medium mb-5">
          Sign Up
        </h2>

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
      </div>
    </form>
  );
}
