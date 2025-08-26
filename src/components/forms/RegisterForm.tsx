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
import { isAxiosError } from "axios";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await dispatch(registerUser({ username, email, password }));

      // `res` is a Redux action, so type-guard with `registerUser.fulfilled.match`
      if (registerUser.fulfilled.match(res)) {
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => router.push("/"), 2000);
      } else {
        toast.error((res.payload as string) || "Registration failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Server error", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("Register axios error:", err.response?.data);
      } else if (err instanceof Error) {
        toast.error(err.message, { position: "top-right", autoClose: 3000 });
        console.error("Register error:", err.message);
      } else {
        toast.error("An unexpected error occurred.", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("Unknown register error:", err);
      }
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
            onValueChange={setUsername}
            icon={<AccountCircleIcon fontSize="small" />}
            required
          />
          <CommonTextField
            label="Email"
            placeholder="Enter email"
            type="email"
            value={email}
            onValueChange={setEmail}
            icon={<EmailIcon fontSize="small" />}
            required
          />
          <CommonTextField
            label="Password"
            placeholder="Enter password"
            type="password"
            value={password}
            onValueChange={setPassword}
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
          <span
            onClick={() => router.replace("/login")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
