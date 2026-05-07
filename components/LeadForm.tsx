"use client";

import { useState } from "react";
import { leadSchema, SOURCE_OPTIONS } from "@/lib/validations";
import FormField from "@/components/FormField";

type FormState = "idle" | "loading" | "success" | "error";

const INITIAL_FORM = {
  full_name: "",
  email: "",
  company: "",
  source: "",
  message: "",
};

type FieldErrors = Partial<Record<keyof typeof INITIAL_FORM, string>>;

export default function LeadForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [globalError, setGlobalError] = useState<string>("");

  function updateField(field: keyof typeof INITIAL_FORM) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    // Client-side validation
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const [key, messages] of Object.entries(
        parsed.error.flatten().fieldErrors
      )) {
        errors[key as keyof FieldErrors] = messages?.[0];
      }
      setFieldErrors(errors);
      return;
    }

    setFormState("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (res.status === 409) {
        setFormState("error");
        setGlobalError(data.error ?? "This email is already registered.");
        return;
      }

      if (!res.ok) {
        setFormState("error");
        setGlobalError(
          data.error ?? "Something went wrong. Please try again."
        );
        return;
      }

      setFormState("success");
    } catch {
      setFormState("error");
      setGlobalError(
        "Network error — please check your connection and try again."
      );
    }
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setFieldErrors({});
    setGlobalError("");
    setFormState("idle");
  }

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Thanks for reaching out!
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We&apos;ve received your message and will be in touch soon.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-sm font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
        >
          Submit another response
        </button>
      </div>
    );
  }

  const isLoading = formState === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {globalError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          {globalError}
        </div>
      )}

      <FormField
        id="full_name"
        label="Full Name"
        required
        value={form.full_name}
        onChange={updateField("full_name")}
        error={fieldErrors.full_name}
        placeholder="Jane Doe"
        disabled={isLoading}
      />
      <FormField
        id="email"
        label="Email Address"
        type="email"
        required
        value={form.email}
        onChange={updateField("email")}
        error={fieldErrors.email}
        placeholder="jane@example.com"
        disabled={isLoading}
      />
      <FormField
        id="company"
        label="Company"
        value={form.company}
        onChange={updateField("company")}
        placeholder="Optional"
        disabled={isLoading}
      />
      <FormField
        id="source"
        label="How did you hear about us?"
        as="select"
        required
        value={form.source}
        onChange={updateField("source")}
        error={fieldErrors.source}
        disabled={isLoading}
      >
        <option value="" disabled>
          Select one…
        </option>
        {SOURCE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </FormField>
      <FormField
        id="message"
        label="Message"
        as="textarea"
        value={form.message}
        onChange={updateField("message")}
        placeholder="Optional — anything you'd like us to know"
        rows={4}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Submitting…
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
