"use client";

import { useState, FormEvent } from "react";

/**
 * Free-tier friendly: wire NEXT_PUBLIC_NEWSLETTER_ENDPOINT to a free form backend
 * (e.g. a Formspree or Buttondown endpoint) via an environment variable in Vercel.
 * With no endpoint configured, the form degrades gracefully to a confirmation message.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (!endpoint) {
      setStatus("success");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="text-accent" role="status">Thanks for subscribing — check your inbox soon!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-full border border-black/10 bg-transparent px-4 py-3 text-sm
                   focus-visible:outline-2 focus-visible:outline-accent dark:border-white/15"
      />
      <button type="submit" className="pill-btn" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p role="alert" className="sr-only">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
