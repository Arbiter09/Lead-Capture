import React from "react";

interface BaseProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
}

interface InputProps extends BaseProps {
  as?: "input";
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface TextareaProps extends BaseProps {
  as: "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

interface SelectProps extends BaseProps {
  as: "select";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

type FormFieldProps = InputProps | TextareaProps | SelectProps;

export default function FormField(props: FormFieldProps) {
  const { id, label, error, required } = props;
  const errorId = `${id}-error`;

  const baseInputClass = `
    block w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900
    placeholder-gray-400 transition-colors focus:outline-none focus:ring-2
    ${
      error
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
    }
    disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
  `;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
      </label>

      {props.as === "textarea" ? (
        <textarea
          id={id}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          rows={props.rows ?? 4}
          disabled={props.disabled}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={baseInputClass}
        />
      ) : props.as === "select" ? (
        <select
          id={id}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`${baseInputClass} bg-white`}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={id}
          type={props.type ?? "text"}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          disabled={props.disabled}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={baseInputClass}
        />
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
