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
  sessionYear: string | null;
  lastDonatedAt: Date | null;
  contactInfo: string | null;
};

export default function SearchClient({ 
  initialUsers, 
  initialQuery, 
  initialEligible 
}: { 
  initialUsers: UserType[], 
  initialQuery: string, 
  initialEligible: boolean 
}) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const updateFilters = (bg: string, eligible: boolean) => {
    const params = new URLSearchParams();
    if (bg) params.set('q', bg);
    if (!eligible) params.set('eligible', 'false');
    
    const search = params.toString();
    router.push(`/search${search ? `?${search}` : ''}`);
  };

  const handleSearch = (bg: string) => {
    setQuery(bg);
    updateFilters(bg, initialEligible);
  };

  const toggleEligible = () => {
    updateFilters(query, !initialEligible);
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      
      {/* Sidebar Filter */}
      <div className="w-full md:w-56 shrink-0 flex flex-col gap-2 sticky top-24">
        <h2 className="font-semibold text-slate-900 text-sm mb-2 font-display">Filters</h2>
        
        {/* Eligibility Toggle */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
           <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Eligible Only</span>
              <div className="relative inline-flex items-center" onClick={toggleEligible}>
                <div className={`w-10 h-5 rounded-full transition-colors ${initialEligible ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${initialEligible ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
           </label>
           <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">Show donors who haven't donated in the last 90 days.</p>
        </div>

        <button 
          onClick={() => handleSearch("")}
          className={`w-full px-3 py-2 text-sm text-left rounded-md transition-colors font-medium border ${
            query === "" 
              ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
              : "text-slate-600 hover:bg-slate-100 border-transparent"
          }`}
        >
          All Records
        </button>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          {bloodGroups.map(bg => (
             <button
              key={bg}
              onClick={() => handleSearch(bg)}
              className={`py-2 px-2 text-sm text-center rounded-md font-bold transition-all border ${
                query === bg 
                  ? "bg-white text-red-600 border-red-200 shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]" 
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
          <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">
            {initialUsers.length} Found
          </span>
        </div>

        {initialUsers.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-4">
            {initialUsers.map(user => {
              const isEligible = !user.lastDonatedAt || new Date(user.lastDonatedAt) <= ninetyDaysAgo;
              
              return (
                <div key={user.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all flex flex-col hover:shadow-md group">
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 shrink-0 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-lg uppercase overflow-hidden border border-slate-200 group-hover:scale-105 transition-transform">
                      {user.image ? (
                        <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user.name?.[0] || 'U'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 truncate tracking-tight">{user.name}</h3>
                      {(user.department || user.sessionYear) ? (
                        <div className="flex items-center gap-1.5 text-[13px] text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {user.department || "No Dept"} {user.sessionYear ? `• ${user.sessionYear}` : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic block mt-1">No academic info</span>
                      )}
                    </div>
                    
                    {/* Eligibility Badge */}
                    <div className={`shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                      isEligible 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}>
                      {isEligible ? "Safe to Donate" : "On Recovery"}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-[13px] text-slate-700">
                        {user.contactInfo ? (
                          <>
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {user.contactInfo}
                          </>
                        ) : (
                          <span className="text-slate-400 italic text-[13px]">No contact info</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                         <span className="font-bold uppercase tracking-tight">Last Donated:</span>
                         <span>{user.lastDonatedAt ? new Date(user.lastDonatedAt).toLocaleDateString() : 'Never'}</span>
                      </div>
                    </div>
                    
                    {user.bloodGroup && (
                      <div className="flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-md border border-red-100 font-bold text-sm shadow-sm" title={`Blood Group: ${user.bloodGroup}`}>
                         <Droplet className="w-3.5 h-3.5 fill-current" />
                        {user.bloodGroup}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-900 mb-1">No donors found</h3>
            <p className="text-slate-500 text-sm">Adjustment your filters to see more results.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
