"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Phone, Droplet } from "lucide-react";

type UserType = {
  id: string;
  name: string;
  image: string | null;
  bloodGroup: string | null;
  department: string | null;
  contactInfo: string | null;
};

export default function SearchClient({ initialUsers, initialQuery }: { initialUsers: UserType[], initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (bg: string) => {
    setQuery(bg);
    if (bg) {
      router.push(`/search?q=${encodeURIComponent(bg)}`);
    } else {
      router.push('/search');
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      
      {/* Sidebar Filter */}
      <div className="w-full md:w-56 shrink-0 flex flex-col gap-2 sticky top-24">
        <h2 className="font-semibold text-slate-900 text-sm mb-2">Filters</h2>
        <button 
          onClick={() => handleSearch("")}
          className={`w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
            query === "" 
              ? "bg-slate-900 text-white font-medium" 
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All Records
        </button>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          {bloodGroups.map(bg => (
             <button
              key={bg}
              onClick={() => handleSearch(bg)}
              className={`py-2 px-2 text-sm text-center rounded-md font-medium transition-colors border ${
                query === bg 
                  ? "bg-red-50 text-red-700 border-red-200" 
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 w-full space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium text-slate-900 text-sm">
            Results {query ? `for ${query}` : ""}
          </h2>
          <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
            {initialUsers.length} Found
          </span>
        </div>

        {initialUsers.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-4">
            {initialUsers.map(user => (
              <div key={user.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors flex flex-col">
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 shrink-0 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-semibold text-lg uppercase overflow-hidden border border-slate-200">
                    {user.image ? (
                      <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.name?.[0] || 'U'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-slate-900 truncate tracking-tight">{user.name}</h3>
                    {user.department ? (
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{user.department}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 italic block mt-1">No department</span>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    {user.contactInfo ? (
                      <>
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {user.contactInfo}
                      </>
                    ) : (
                      <span className="text-slate-400 italic text-sm">No contact provided</span>
                    )}
                  </div>
                  
                  {user.bloodGroup && (
                    <div className="flex items-center justify-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 font-semibold text-xs" title={`Blood Group: ${user.bloodGroup}`}>
                       <Droplet className="w-3 h-3 fill-current" />
                      {user.bloodGroup}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center flex flex-col items-center">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">No matching records</h3>
            <p className="text-slate-500 text-sm">No donors registered with this blood group.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
