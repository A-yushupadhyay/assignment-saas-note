"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-2 text-center text-purple-700">
          SaaS Notes Login
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Multi-tenant demo — use test accounts
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </motion.div>

          {/* Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Login
            </button>
          </motion.div>
        </form>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-medium">🔑 Test Accounts:</p>
          <ul className="list-disc list-inside">
            <li>admin@acme.test / password</li>
            <li>user@acme.test / password</li>
            <li>admin@globex.test / password</li>
            <li>user@globex.test / password</li>
          </ul>
        </div>

        {/* Can't register? Signup */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Can’t register?{" "}
          <Link
            href="/"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
