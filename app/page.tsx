import LeadForm from "@/components/LeadForm";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
          Get in touch
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Tell us a bit about yourself and we&apos;ll reach out shortly.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-700 dark:bg-gray-800">
        <LeadForm />
      </div>
    </div>
  );
}
