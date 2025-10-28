import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNfa } from "../context/NfaContext";
import Loading from "../components/Loading";

export default function VendorHome() {
  const { nfaNumber } = useParams();
  const navigate = useNavigate();
  const {
    nfaVendorData,
    fetchAllByNfaNumber,
    loading,
    error,
  } = useNfa();

  const [searchTerm, setSearchTerm] = useState("");
  const [awardFilter, setAwardFilter] = useState("");
  const [roundFilter, setRoundFilter] = useState("");

  // Fetch vendor data for this NFA
  useEffect(() => {
    if (nfaNumber) fetchAllByNfaNumber(nfaNumber);
  }, [nfaNumber]);

  // Filter vendor data
  const vendors = useMemo(() => {
    let result = nfaVendorData.filter(
      (v) => v.NfaNumber === nfaNumber
    );


    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((v) =>
        v.VendorName?.toLowerCase().includes(lower)
      );
    }

    if (awardFilter) {
      result = result.filter((v) =>
        awardFilter === "awarded" ? v.AwardedVendor : !v.AwardedVendor
      );
    }

    if (roundFilter) {
      result = result.filter((v) => String(v.RoundNo) === roundFilter);
    }

    return result;
  }, [nfaVendorData, searchTerm, awardFilter, roundFilter, nfaNumber]);

  console.log(vendors);

  // Extract unique rounds for dropdown
  const availableRounds = useMemo(() => {
    const rounds = nfaVendorData
      .filter((v) => v.NfaNumber === nfaNumber)
      .map((v) => v.RoundNo)
      .filter(Boolean);
    return [...new Set(rounds)];
  }, [nfaVendorData, nfaNumber]);

  // Handle states
  if (loading) return <Loading message="Fetching vendor data..." />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Error: {error.message}
      </div>
    );
  if (!vendors.length)
    return (
      <div className="p-10 text-center text-gray-500">
        No vendors found for this NFA.
      </div>
    );

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
                Round {r}
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
              <th className="px-4 py-2 text-left">Round</th>
              <th className="px-4 py-2 text-left">Final Quote</th>
              <th className="px-4 py-2 text-left">Awarded Vendor</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr
                key={v.ProposedVendorCode}
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() =>
                  navigate(`${window.location.pathname}/vendor/${v.ProposedVendorCode}`)
                }
              >
                <td className="px-4 py-2">{v.ProposedVendorCode}</td>
                <td className="px-4 py-2">{v.VendorName}</td>
                <td className="px-4 py-2">{v.round || "-"}</td>
                <td className="px-4 py-2">{v.FinalQuote || "-"}</td>
                <td className="px-4 py-2">{v.AwardedVendor || "-"}</td>
                <td className="px-4 py-2">
                  <button
                    className="button-back"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`${window.location.pathname}/vendor/${v.ProposedVendorCode}`);
                    }}
                  >
                    &gt;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
