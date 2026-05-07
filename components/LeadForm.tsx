"use client";

import { SOURCE_OPTIONS } from "@/lib/validations";
import FormField from "@/components/FormField";

const INITIAL_FORM = {
  full_name: "",
  email: "",
  company: "",
  source: "" as string,
  message: "",
};

type FormState = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  return (
    <form className="flex flex-col gap-5">
      <FormField
        id="full_name"
        label="Full Name"
        required
        value={INITIAL_FORM.full_name}
        onChange={() => {}}
      />
      <FormField
        id="email"
        label="Email Address"
        type="email"
        required
        value={INITIAL_FORM.email}
        onChange={() => {}}
      />
      <FormField
        id="company"
        label="Company"
        value={INITIAL_FORM.company}
        onChange={() => {}}
        placeholder="Optional"
      />
      <FormField
        id="source"
        label="How did you hear about us?"
        as="select"
        required
        value={INITIAL_FORM.source}
        onChange={() => {}}
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
        value={INITIAL_FORM.message}
        onChange={() => {}}
        placeholder="Optional — anything you'd like us to know"
        rows={4}
      />
      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Submit
      </button>
    </form>
  );
}
