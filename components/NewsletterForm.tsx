"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("ok");
        setMessage("You're in. Watch your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong — please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong — please try again.");
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", gap: 10, maxWidth: 440, margin: "0 auto" }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          className="input-pill"
          style={{ flex: 1, minWidth: 0, padding: "14px 22px", fontSize: 13 }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-ink"
          style={{ padding: "14px 26px", fontSize: 13 }}
        >
          {status === "sending" ? "..." : "SUBSCRIBE"}
        </button>
      </form>
      {message && (
        <div
          className="mono"
          role="status"
          style={{
            marginTop: 14,
            fontSize: 11,
            letterSpacing: "0.14em",
            color: status === "ok" ? "#141414" : "#C9661A",
          }}
        >
          {message}
        </div>
      )}
    </>
  );
}
