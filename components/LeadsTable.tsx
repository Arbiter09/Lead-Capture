import type { Lead } from "@/lib/types";

interface LeadsTableProps {
  leads: Lead[];
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-600 dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">No leads yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {["Name", "Email", "Company", "Source", "Submitted"].map(
              (header) => (
                <th
                  key={header}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {leads.map((lead) => (
            <tr key={lead.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white">
                {lead.full_name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                {lead.email}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {lead.company || (
                  <span className="italic text-gray-400 dark:text-gray-500">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {lead.source}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                {formatDate(lead.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
