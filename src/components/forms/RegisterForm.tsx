"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CommonTextField from "../common/formHelpers/CommonTextField";
import CommonButton from "../common/buttons/CommonButton";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/"); // replace to prevent back navigation
    }
  }, [router]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // ✅ start loading

    try {
      const res = await dispatch(registerUser({ username, email, password }));
      if (res.payload?.success) {
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => router.push("/"), 2000);
      } else {
        toast.error(res.payload || "Registration failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Register error:", err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <CommonTextField
            label="Username"
            placeholder="Enter username"
            value={username}
            onValueChange={(value) => setUsername(value)}
            icon={<AccountCircleIcon fontSize="small" />}
            required
          />
          <CommonTextField
            label="Email"
            placeholder="Enter email"
            type="email"
            value={email}
            onValueChange={(value) => setEmail(value)}
            icon={<EmailIcon fontSize="small" />}
            required
          />
          <CommonTextField
            label="Password"
            placeholder="Enter password"
            type="password"
            value={password}
            onValueChange={(value) => setPassword(value)}
            icon={<LockIcon fontSize="small" />}
            required
          />
          <CommonButton
            label="Register"
            type="submit"
            loading={loading}
            width="100%"
            className="button_fill rounded-lg"
          />
        </form>
        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
