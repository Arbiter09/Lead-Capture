import { supabaseServer } from "@/lib/supabase-server";
import LeadsTable from "@/components/LeadsTable";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { data, error } = await supabaseServer
    .from("leads")
    .select("id, full_name, email, company, source, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          Submitted Leads
        </h1>
        {!error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {data?.length === 1
              ? "1 lead submitted"
              : `${data?.length ?? 0} leads submitted`}
            , sorted most recent first.
          </p>
        )}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            Could not load leads. Please try again later.
          </p>
        </div>
      ) : (
        <LeadsTable leads={(data as Lead[]) ?? []} />
      )}
    </div>
  );
}
