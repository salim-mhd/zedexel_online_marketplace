"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import validator from "validator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CommonTextField from "../common/formHelpers/CommonTextField";
import CommonButton from "../common/buttons/CommonButton";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/"); // Replace to prevent back navigation
    }
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }
    
    if (!validator.isEmail(email)) {
      setError("Please enter a valid email");
      toast.error("Please enter a valid email", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username); // Store username
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => router.push("/"), 1000);
      } else {
        setError(data.error || "Login failed");
        toast.error(data.error || "Login failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Login error:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <CommonTextField
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onValueChange={(value) => setEmail(value)}
            icon={<EmailIcon fontSize="small" />}
            error={error && (!email || !validator.isEmail(email)) ? error : ""}
            disabled={isLoading}
            required
          />
          <CommonTextField
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onValueChange={(value) => setPassword(value)}
            icon={<LockIcon fontSize="small" />}
            error={error && !password ? error : ""}
            disabled={isLoading}
            required
          />
          <CommonButton
            label="Login"
            type="submit"
            loading={isLoading}
            width="100%"
            className="button_fill rounded-lg"
          />
        </form>
        <p className="mt-5 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
