import React from 'react';
import { BusinessLead } from '../types';
import { Star, MapPin, ExternalLink, Download, Globe } from 'lucide-react';

interface ResultsTableProps {
  leads: BusinessLead[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ leads }) => {
  const downloadCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ["Company Name", "Rating", "Reviews", "Phone", "Address", "Postal Code", "Maps URL", "Website Status"];
    const csvContent = [
      headers.join(","),
      ...leads.map(lead => [
        `"${lead.name}"`,
        lead.rating,
        lead.reviews,
        `"${lead.phone}"`,
        `"${lead.address}"`,
        `"${lead.postalCode}"`,
        `"${lead.mapsUrl}"`,
        lead.hasWebsite ? lead.website : "No Website"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 h-64 flex flex-col items-center justify-center text-slate-400">
        <MapPin size={48} className="mb-4 text-slate-200" />
        <p>No qualified leads found yet.</p>
        <p className="text-sm">Start a scan to begin populating this table.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="font-semibold text-slate-800">Qualified Leads</h3>
          <p className="text-sm text-slate-500">{leads.length} businesses found matching criteria</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Business Name</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Details</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{lead.name}</div>
                  <div className="text-xs text-slate-500">{lead.type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-orange-400 text-orange-400" />
                    <span className="font-semibold text-slate-700">{lead.rating}</span>
                    <span className="text-slate-400 text-xs">({lead.reviews})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-700">{lead.phone}</span>
                    {lead.hasWebsite && lead.website ? (
                       <a href={lead.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                         <Globe size={12} /> Website
                       </a>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 w-fit">
                        No Website
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs truncate" title={lead.address}>
                  {lead.address}
                </td>
                <td className="px-6 py-4">
                  <a 
                    href={lead.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 text-xs font-medium"
                  >
                    View Map <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;