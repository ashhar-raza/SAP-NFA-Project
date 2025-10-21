import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ComparativeScreen4Compact() {
  const { nfaNumber } = useParams();
  const [nfa, setNfa] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [vendorItems, setVendorItems] = useState([]);
  const [expandedVendors, setExpandedVendors] = useState(false);
  const [showNfaDetails, setShowNfaDetails] = useState(true);
  const [showAwardedVendor, setShowAwardedVendor] = useState(true);
  const [loading, setLoading] = useState(true);

  const theme = {
    background: "#E4E4E1",
    backgroundAlt: "#ECECE9",
    card: "#FFFFFF",
    primary: "#1D74DE",
    primaryLight: "#04A4FF",
    border: "#DAD8D4",
    textPrimary: "#1E1E1E",
    textSecondary: "#3B3B3B",
    accent: "#F0F9FF",
    accentForeground: "#1D4ED8"
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch NFA Details
        const nfaRes = await axios.get(`/api/nfa/${nfaNumber}`);
        setNfa(nfaRes.data);

        // Fetch Vendors
        const vendorRes = await axios.get(`/api/nfa/${nfaNumber}/vendors`);
        setVendors(vendorRes.data);

        // Fetch Vendor Items
        const itemsRes = await axios.get(`/api/nfa/${nfaNumber}/vendor-items`);
        setVendorItems(itemsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nfaNumber]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700">Loading NFA data...</p>
      </div>
    );
  }

  if (!nfa) return <div className="p-6 text-center">NFA not found!</div>;

  const uniqueVendors = [...new Map(vendors.map(v => [v.ProposedVendorCode, v])).values()];

  const getRounds = (vendorCode) => {
    return [...new Set(
      vendorItems.filter(i => i.ProposedVendorCode === vendorCode)
        .map(i => i.round)
    )].sort((a, b) => a - b);
  };

  const getVendorItemsByRound = (vendorCode, round) =>
    vendorItems.filter(i => i.ProposedVendorCode === vendorCode && i.round === round);

  return (
    <div style={{ background: theme.backgroundAlt }} className="p-4 min-h-screen text-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          {/* NFA Details */}
          <section>
            <div className="flex justify-between items-center cursor-pointer mb-1" onClick={() => setShowNfaDetails(!showNfaDetails)}>
              <h3 style={{ color: theme.primary }} className="font-semibold text-lg flex items-center gap-1">
                NFA Details {showNfaDetails ? <FaChevronUp /> : <FaChevronDown />}
              </h3>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 transition-all overflow-hidden ${showNfaDetails ? "max-h-[1000px]" : "max-h-0"}`}>
              {[
                { label: "Project Description", value: nfa.ProjectDescription },
                { label: "Subject of Proposal/Order", value: nfa.SubjectofProposalOROrder },
                { label: "Base Line Spend", value: nfa.BaseLineSpend },
                { label: "Final Proposed Value", value: nfa.FinalProposedValue },
                { label: "RFP Number", value: nfa.RfpNumber },
                { label: "SBU Unit Location", value: nfa.SBUUnitLocation },
                { label: "Status", value: nfa.Status },
              ].map((field, idx) => (
                <div key={idx} style={{ background: theme.card, borderColor: theme.border }} className="p-2 rounded border">
                  <p style={{ color: theme.primaryLight, fontWeight: 600 }} className="text-xs">{field.label}</p>
                  <p style={{ color: theme.textPrimary }} className="text-sm truncate">{field.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Awarded Vendor */}
          <section>
            <div className="flex justify-between items-center cursor-pointer mb-1" onClick={() => setShowAwardedVendor(!showAwardedVendor)}>
              <h3 style={{ color: theme.primary }} className="font-semibold text-lg flex items-center gap-1">
                Awarded Vendor {showAwardedVendor ? <FaChevronUp /> : <FaChevronDown />}
              </h3>
            </div>
            <div className={`overflow-x-auto border rounded transition-all ${showAwardedVendor ? "max-h-[400px]" : "max-h-0"}`} style={{ background: theme.card, borderColor: theme.border }}>
              <table className="w-full text-xs border-collapse">
                <thead className="bg-blue-100 text-blue-800">
                  <tr>
                    <th className="px-2 py-1 text-left">Vendor Name</th>
                    <th className="px-2 py-1 text-left">Vendor Code</th>
                    <th className="px-2 py-1 text-left">Rounds</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {uniqueVendors.filter(v => v.AwardedVendor).map(v => {
                    const rounds = getRounds(v.ProposedVendorCode);
                    return (
                      <tr key={v.ProposedVendorCode} className="hover:bg-blue-50">
                        <td className="px-2 py-1">{v.VendorName}</td>
                        <td className="px-2 py-1">{v.ProposedVendorCode}</td>
                        <td className="px-2 py-1">{rounds.join(", ")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 style={{ color: theme.primary }} className="font-semibold text-lg">All Vendors</h3>
              <button className={expandedVendors ? "button-logout" : "button-back"} onClick={() => setExpandedVendors(!expandedVendors)}>
                {expandedVendors ? "Collapse" : "Expand"}
              </button>
            </div>
            <div className={`grid gap-3 transition-all ${expandedVendors ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
              {uniqueVendors.map(vendor => {
                const rounds = getRounds(vendor.ProposedVendorCode);
                return (
                  <div key={vendor.ProposedVendorCode} style={{ background: theme.card, borderColor: theme.border }} className="p-2 rounded border">
                    <p style={{ color: theme.primary }} className="font-semibold text-sm">Vendor: {vendor.VendorName}</p>
                    <p style={{ color: theme.primaryLight }} className="font-semibold text-xs mb-2">Code: {vendor.ProposedVendorCode}</p>

                    {/* Extra fields */}
                    <div className={`overflow-hidden transition-all ${expandedVendors ? "max-h-[500px] mb-2" : "max-h-0"}`}>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div style={{ background: theme.accent }} className="p-1 rounded">
                          <p style={{ color: theme.primary }} className="font-semibold">Awarded</p>
                          <p>{vendor.AwardedVendor ? "Yes" : "No"}</p>
                        </div>
                        <div style={{ background: theme.accent }} className="p-1 rounded">
                          <p style={{ color: theme.primary }} className="font-semibold">Email</p>
                          <p>{vendor.Email || "N/A"}</p>
                        </div>
                        <div style={{ background: theme.accent }} className="p-1 rounded">
                          <p style={{ color: theme.primary }} className="font-semibold">Phone</p>
                          <p>{vendor.Phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Rounds */}
                    <div className={`flex gap-2 overflow-x-auto`}>
                      {rounds.map(round => {
                        const items = getVendorItemsByRound(vendor.ProposedVendorCode, round);
                        return (
                          <div key={round} style={{ minWidth: '200px', background: theme.accent }} className="p-1 rounded border">
                            <p style={{ color: theme.primary }} className="text-center text-xs font-semibold mb-1">Round {round}</p>
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr>
                                  <th className="border px-1 py-0.5">Unit</th>
                                  <th className="border px-1 py-0.5">Qty</th>
                                  <th className="border px-1 py-0.5">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="border px-1 py-0.5 text-center">{item.UnitPrice}</td>
                                    <td className="border px-1 py-0.5 text-center">{item.Quantity}</td>
                                    <td className="border px-1 py-0.5 text-center">{(item.Quantity * parseFloat(item.UnitPrice || 0)).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
