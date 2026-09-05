"use client";

import { useState, FormEvent } from "react";

/**
 * Free-tier friendly: set NEXT_PUBLIC_CONTACT_FORM_ENDPOINT to a free form
 * backend (e.g. Formspree's free tier) in Vercel's environment variables.
 * Without one configured, the form still validates and shows a friendly
 * confirmation — swap in the endpoint whenever you're ready.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!endpoint) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field id="name" label="Your Name" name="name" required />
      <Field id="email" label="Your Email" name="email" type="email" required />
      <Field id="subject" label="Subject" name="subject" />
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm
                     focus-visible:outline-2 focus-visible:outline-accent dark:border-white/15"
        />
      </div>
      <button type="submit" className="pill-btn" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
      {status === "success" && (
        <p role="status" className="text-sm text-accent">
          Thanks for reaching out — we&rsquo;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm text-red-500">
          Something went wrong. Please email us directly instead.
        </p>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  required
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm
                   focus-visible:outline-2 focus-visible:outline-accent dark:border-white/15"
      />
    </div>
  );
}
