"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Login failed. Check ADMIN_PASSWORD and ADMIN_SESSION_SECRET on the server.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-shell admin-login">
      <form onSubmit={onSubmit}>
        <h1>BNI Anchor Admin</h1>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign in</button>
        {error ? <p className="admin-status">{error}</p> : null}
      </form>
    </div>
  );
}
