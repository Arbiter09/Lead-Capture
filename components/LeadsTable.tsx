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
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-sm text-gray-500">No leads yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {["Name", "Email", "Company", "Source", "Submitted"].map(
              (header) => (
                <th
                  key={header}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                {lead.full_name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                {lead.email}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {lead.company || (
                  <span className="text-gray-400 italic">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  {lead.source}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                {formatDate(lead.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
