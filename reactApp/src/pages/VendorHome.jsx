// VendorHome.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNfa } from "../context/NfaContext"; // Your NfaContext for API calls
import Loading from "../components/Loading";

export default function VendorHome() {
  const { nfaNumber } = useParams();
  const navigate = useNavigate();
  const { nfaDetails, fetchNfaDetails, loading, error } = useNfa();

  const [searchTerm, setSearchTerm] = useState("");
  const [awardFilter, setAwardFilter] = useState("");
  const [roundFilter, setRoundFilter] = useState("");

  // Fetch NFA details on mount
  useEffect(() => {
    fetchNfaDetails();
  }, [fetchNfaDetails]);

  // Get current NFA
  const nfa = useMemo(
    () => nfaDetails.find((item) => item.complaintno === nfaNumber),
    [nfaDetails, nfaNumber]
  );

  // Get unique vendors filtered by latest round + search + filters
  const vendors = useMemo(() => {
    if (!nfa || !nfa.vendors) return [];

    const uniqueMap = {};
    nfa.vendors.forEach((v) => {
      if (!uniqueMap[v.vendorCode] || uniqueMap[v.vendorCode].round < v.round) {
        uniqueMap[v.vendorCode] = v;
      }
    });

    let result = Object.values(uniqueMap);

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((v) => v.vendorName.toLowerCase().includes(lower));
    }

    if (awardFilter) {
      result = result.filter((v) =>
        awardFilter === "awarded" ? v.awarded : !v.awarded
      );
    }

    if (roundFilter) {
      result = result.filter((v) => v.round === Number(roundFilter));
    }

    return result;
  }, [nfa, searchTerm, awardFilter, roundFilter]);

  // Available rounds for filter dropdown
  const availableRounds = useMemo(() => {
    if (!nfa || !nfa.vendors) return [];
    return [...new Set(nfa.vendors.map((v) => v.round))];
  }, [nfa]);

  // Handle loading and error states
  if (loading) return <Loading message="Fetching vendors..." />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  if (!nfa) return <div className="p-10 text-center">NFA not found!</div>;

  return (
    <div className="flex flex-col gap-6 px-10 py-6 min-h-screen">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Search Vendor..."
          className="input flex-[0_0_60%]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2 flex-[0_0_40%]">
          <select
            className="select flex-1"
            value={awardFilter}
            onChange={(e) => setAwardFilter(e.target.value)}
          >
            <option value="">All Vendors</option>
            <option value="awarded">Awarded</option>
            <option value="not-awarded">Not Awarded</option>
          </select>
          <select
            className="select flex-1"
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
          >
            <option value="">All Rounds</option>
            {availableRounds.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendor Table */}
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="table w-full text-sm">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2 text-left">Vendor Code</th>
              <th className="px-4 py-2 text-left">Vendor Name</th>
              <th className="px-4 py-2 text-left">Latest Round</th>
              <th className="px-4 py-2 text-left">Final Quote</th>
              <th className="px-4 py-2 text-left">Awarded Vendor</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {vendors.length ? (
              vendors.map((v) => (
                <tr
                  key={v.vendorCode}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    navigate(`${window.location.pathname}/vendor/${v.vendorCode}`)
                  }
                >
                  <td className="px-4 py-2">{v.vendorCode}</td>
                  <td className="px-4 py-2">{v.vendorName}</td>
                  <td className="px-4 py-2">{v.round}</td>
                  <td className="px-4 py-2">{v.finalQuote}</td>
                  <td className="px-4 py-2">{v.awarded ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">
                    <button
                      className="button-back"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${window.location.pathname}/vendor/${v.vendorCode}`);
                      }}
                    >
                      &gt;
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
