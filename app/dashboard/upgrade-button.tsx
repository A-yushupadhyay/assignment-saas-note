"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function UpgradeButton() {
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [error, setError] = useState("");

  // 🔑 Parse JWT from localStorage → extract tenantSlug
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setTenantSlug(payload.tenantSlug);
    } catch (e) {
      console.error("Invalid token", e);
    }
  }, []);

  async function handleUpgrade() {
    if (!tenantSlug) {
      setError("Tenant not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tenants/${tenantSlug}/upgrade`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upgrade failed");
      }

      setUpgraded(true);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!tenantSlug) return null;

  return (
    <div className="p-4 border border-indigo-200 bg-indigo-50 rounded-xl flex flex-col items-center shadow-md">
      {upgraded ? (
        <p className="text-green-600 font-semibold">
          ✅ You’re now upgraded to Pro!
        </p>
      ) : (
        <>
          <p className="text-gray-700 mb-3 text-center">
            You’ve reached the free note limit. Upgrade to unlock unlimited
            notes.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpgrade}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Upgrading..." : "🚀 Upgrade to Pro"}
          </motion.button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
