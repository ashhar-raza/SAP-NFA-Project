import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useNfa } from "../../context/NfaContext";
import Loading from "components/Loading";
import Error from "components/Error";

export default function ComparativeScreen3() {
  const { nfaNumber } = useParams();
  const {
    fetchAllByNfaNumber,
    oneNfa,
    nfaVendorData = [],
    nfaVendorItems = [],
    loading,
    error,
  } = useNfa();
  const [showNfaDetails, setShowNfaDetails] = useState(true);
  const [showAwardedVendor, setShowAwardedVendor] = useState(true);
  const [showVendorCards, setShowVendorCards] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // 🎨 Theme
  const theme = {
    background: "#E4E4E1",
    card: "#FFFFFF",
    primary: "#1D74DE",
    primaryLight: "#04A4FF",
    textPrimary: "#1E1E1E",
    textSecondary: "#3B3B3B",
    border: "#DAD8D4",
  };

  // 🔄 Fetch NFA data once
  useEffect(() => {
    fetchAllByNfaNumber(nfaNumber);
  }, [nfaNumber]);

  // 📊 Derived Data
  const maxRound = Math.max(...nfaVendorItems.map((i) => i.round || 0), 0);

  const uniqueVendors = [
    ...new Map(nfaVendorData.map((v) => [v.ProposedVendorCode, v])).values(),
  ];

  const getVendorItemsByRound = (code, round) =>
    nfaVendorItems.filter(
      (i) => i.ProposedVendorCode === code && i.round === round
    );

  const getVendorRounds = (code) => [
    ...new Set(
      nfaVendorItems
        .filter((i) => i.ProposedVendorCode === code)
        .map((i) => i.round)
    ),
  ];

  // 🕑 Loading and Error
  if (loading)
    return (<Loading />)
  if (error) return <Error message={error.message} onRetry={() => fetchAllByNfaNumber(nfaNumber)} />;

  console.log(nfaVendorData);
  console.log(nfaVendorItems);

  // 🏆 Filter only awarded vendors (unique ProposedVendorCode)
  const awardedVendors = Object.values(
    nfaVendorData
      .filter((v) => v.AwardedVendor === "Yes")
      .reduce((acc, v) => {
        if (!acc[v.ProposedVendorCode]) {
          acc[v.ProposedVendorCode] = {
            VendorName: v.VendorName,
            ProposedVendorCode: v.ProposedVendorCode,
            Amount: v.OrderAmountOrSplitOrderAmount || "-",
            Rounds: new Set([v.round]),
          };
        } else {
          acc[v.ProposedVendorCode].Rounds.add(v.round);
        }
        return acc;
      }, {})
  ).map((v) => ({
    ...v,
    Rounds: Array.from(v.Rounds).sort((a, b) => a - b),
  }));

  // 🧩 Reusable Header Card
  const renderHeaderCard = (label, value) => (
    <div
      key={label}
      style={{
        background: theme.card,
        borderColor: theme.border,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
      className="p-4 rounded-lg border"
    >
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <p className="text-gray-800 font-semibold">{value || "-"}</p>
    </div>
  );

  return (
    <div className="p-6" style={{ background: theme.background }}>
      {/* =============== 🔹 NFA Header Section =============== */}
      <section className="page-section mb-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowNfaDetails(!showNfaDetails)}
        >
          <h3
            style={{ color: theme.primary }}
            className="text-2xl font-bold flex items-center gap-2"
          >
            NFA Header Details{" "}
            {showNfaDetails ? <FaChevronUp /> : <FaChevronDown />}
          </h3>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 overflow-hidden ${showNfaDetails ? "max-h-[1000px]" : "max-h-0"
            }`}
        >
          {Object.keys(oneNfa || {}).length > 0 ? (
            <>
              {renderHeaderCard("NFA Number", oneNfa.NfaNumber)}
              {renderHeaderCard("Status", oneNfa.Status)}
              {renderHeaderCard("Owner", oneNfa.Owner)}
              {renderHeaderCard("Created By", oneNfa.CreatedBy)}
              {renderHeaderCard("Approving Plant", oneNfa.ApprovingPlant)}
              {renderHeaderCard("Commodity", oneNfa.Commodity)}
              {renderHeaderCard("Departments", oneNfa.Departments)}
              {renderHeaderCard("Regions", oneNfa.Regions)}
              {renderHeaderCard("Final Proposed Value", oneNfa.FinalProposedValue)}
              {renderHeaderCard("Target Savings", oneNfa.TargetSavings)}
              {renderHeaderCard("Total Spend", oneNfa.TotalSpend)}
              {renderHeaderCard("Risk Category", oneNfa.RiskCategory)}
              {renderHeaderCard("RFP Number", oneNfa.RfpNumber)}
              {renderHeaderCard("RFP Publish Date", oneNfa.RfpPublishDate)}
              {renderHeaderCard("Version", oneNfa.Version)}
              {renderHeaderCard("Max Round", oneNfa.maxRound)}
            </>
          ) : (
            <div className="col-span-full text-center text-gray-500 py-4">
              No NFA details available
            </div>
          )}
        </div>
      </section>

      {/* =============== 🏆 Awarded Vendors Section =============== */}
      <section className="page-section mt-8">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowAwardedVendor(!showAwardedVendor)}
        >
          <h3
            style={{ color: theme.primary }}
            className="text-2xl font-bold flex items-center gap-2"
          >
            Awarded Vendors{" "}
            {showAwardedVendor ? <FaChevronUp /> : <FaChevronDown />}
          </h3>
        </div>

        <div
          className={`transition-all duration-500 overflow-hidden ${showAwardedVendor ? "max-h-[800px] mt-4" : "max-h-0"
            }`}
        >
          <div
            className="overflow-x-auto rounded-xl border shadow-md"
            style={{ background: theme.card, borderColor: theme.border }}
          >
            <table className="w-full text-left border-collapse text-sm">
              <thead
                className="bg-gray-100 text-gray-700"
                style={{ backgroundColor: theme.primaryLight, color: "white" }}
              >
                <tr>
                  <th className="p-3 border border-gray-200">#</th>
                  <th className="p-3 border border-gray-200">Vendor Name</th>
                  <th className="p-3 border border-gray-200">Vendor Code</th>
                  <th className="p-3 border border-gray-200">Amount</th>
                  <th className="p-3 border border-gray-200">Rounds Participated</th>
                </tr>
              </thead>
              <tbody>
                {awardedVendors.length > 0 ? (
                  awardedVendors.map((v, i) => (
                    <tr
                      key={v.ProposedVendorCode}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="p-3 border border-gray-200">{i + 1}</td>
                      <td className="p-3 border border-gray-200 font-medium text-gray-800">
                        {v.VendorName}
                      </td>
                      <td className="p-3 border border-gray-200 text-gray-600">
                        {v.ProposedVendorCode}
                      </td>
                      <td className="p-3 border border-gray-200 text-green-600 font-semibold">
                        {v.Amount}
                      </td>
                      <td className="p-3 border border-gray-200 text-gray-700">
                        {v.Rounds.join(", ")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-400 p-6 italic"
                    >
                      No awarded vendors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>



      {/* =============== 🧾 Vendor Cards Section =============== */}
      {/* =============== 🧾 Vendor Cards Section =============== */}
      <section className="page-section mt-5">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowVendorCards(!showVendorCards)}
        >
          <h3
            style={{ color: theme.primary }}
            className="text-2xl font-bold flex items-center gap-2"
          >
            Vendor Comparative View{" "}
            {showVendorCards ? <FaChevronUp /> : <FaChevronDown />}
          </h3>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 transition-all duration-500 overflow-hidden ${showVendorCards ? "max-h-[2000px]" : "max-h-0"
            }`}
        >
          {uniqueVendors.map((v) => {
            const lastRoundItems = getVendorItemsByRound(v.ProposedVendorCode, maxRound);
            const isAwarded = v.AwardedVendor === "Yes";

            return (
              <div
                key={v.ProposedVendorCode}
                className="rounded-xl border p-4 shadow-md flex flex-col justify-between"
                style={{ background: theme.card, borderColor: theme.border }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-lg text-left">{v.VendorName}</p>
                  <button
                    onClick={() => setSelectedVendor(v)}
                    className="text-sm px-3 py-1 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    All Rounds
                  </button>
                </div>

                {isAwarded && (
                  <p className="text-sm text-green-600 font-medium mb-3">
                    🏆 Awarded Vendor
                  </p>
                )}

                {lastRoundItems.length > 0 ? (
                  <>
                    <p className="font-semibold mb-2 text-sm text-gray-800">
                      Round: {maxRound}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-300 rounded-lg text-sm">
                        <tbody>
                          <tr className="bg-gray-100">
                            <th className="text-left p-2 border-r sticky left-0 z-10 bg-gray-100">
                              Item
                            </th>
                            {lastRoundItems.map((item, idx) => (
                              <td key={idx} className="p-2 border-r">
                                {item.Name} ({item.ItemCode})
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th className="text-left p-2 border-r bg-gray-50 sticky left-0 z-10">
                              Unit Price
                            </th>
                            {lastRoundItems.map((item, idx) => (
                              <td key={idx} className="p-2 border-r">
                                {item.UnitPrice}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th className="text-left p-2 border-r bg-gray-50 sticky left-0 z-10">
                              Quantity
                            </th>
                            {lastRoundItems.map((item, idx) => (
                              <td key={idx} className="p-2 border-r">
                                {item.Quantity}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th className="text-left p-2 border-r bg-gray-50 sticky left-0 z-10">
                              Savings
                            </th>
                            {lastRoundItems.map((item, idx) => (
                              <td key={idx} className="p-2 border-r">
                                {item.Savings} INR ({item.SavingsPercent}%)
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th className="text-left p-2 border-r bg-gray-50 sticky left-0 z-10">
                              Total
                            </th>
                            {lastRoundItems.map((item, idx) => (
                              <td key={idx} className="p-2 border-r">
                                {(
                                  parseFloat(item.UnitPrice || 0) *
                                  parseFloat(item.Quantity || 0)
                                ).toFixed(2)}
                              </td>
                            ))}
                          </tr>
                        </tbody>

                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-red-600 text-sm mt-3">
                    Vendor did not participate in round {maxRound}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* 🔹 Modal for All Rounds */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-2 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              All Rounds - {selectedVendor.VendorName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getVendorRounds(selectedVendor.ProposedVendorCode).map((r) => {
                const items = getVendorItemsByRound(selectedVendor.ProposedVendorCode, r);
                return (
                  <div
                    key={r}
                    className="border p-1 rounded-lg bg-gray-50 shadow-sm"
                  >
                    <p className="font-semibold mb-2 text-gray-800 text-center">
                      Round {r}
                    </p>
                    {items.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 rounded-lg text-sm">
                          <tbody>
                            <tr className="bg-gray-100">
                              <th className="text-left p-2 border-r">Item</th>
                              {items.map((item, idx) => (
                                <td key={idx} className="p-2 border-r">
                                  {item.Name} ({item.ItemCode})
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <th className="text-left p-2 border-r bg-gray-50">Unit Price</th>
                              {items.map((item, idx) => (
                                <td key={idx} className="p-2 border-r">
                                  {item.UnitPrice}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <th className="text-left p-2 border-r bg-gray-50">Quantity</th>
                              {items.map((item, idx) => (
                                <td key={idx} className="p-2 border-r">
                                  {item.Quantity}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <th className="text-left p-2 border-r bg-gray-50">Savings</th>
                              {items.map((item, idx) => (
                                <td key={idx} className="p-2 border-r">
                                  {item.Savings} INR ({item.SavingsPercent}%)
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <th className="text-left p-2 border-r bg-gray-50">Total</th>
                              {items.map((item, idx) => (
                                <td key={idx} className="p-2 border-r">
                                  {(
                                    parseFloat(item.UnitPrice || 0) *
                                    parseFloat(item.Quantity || 0)
                                  ).toFixed(2)}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-red-500 text-sm text-center">
                        Not participated
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setSelectedVendor(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
