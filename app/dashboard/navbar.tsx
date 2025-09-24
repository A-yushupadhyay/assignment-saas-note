"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  email: string;
  tenant: string;
}

export default function Navbar() {
  const [tenant, setTenant] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded: DecodedToken = jwtDecode(token);
      setTenant(decoded.tenant || decoded.email || "Guest");
    } catch {
      setTenant("Guest");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center rounded-lg mb-6">
      <h1 className="text-lg font-semibold text-gray-800">
        👋 Welcome, <span className="text-purple-600">{tenant}</span>
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
      >
        Logout
      </button>
    </nav>
  );
}
