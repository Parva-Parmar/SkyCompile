import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api/http";

export default function Signin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const data = await postRequest("/auth/signin", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
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
