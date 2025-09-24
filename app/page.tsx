"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, tenantName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      setMessage("✅ Account created! Redirecting to login...");
      setTimeout(() => router.push("/dashboard"), 1500); // redirect after 1.5 sec
    } catch (err: unknown) {
      setMessage("❌ " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🚀 Create an Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Tenant / Workspace Name"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        {/* Already registered? */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already registered?{" "}
          <a
            href="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
