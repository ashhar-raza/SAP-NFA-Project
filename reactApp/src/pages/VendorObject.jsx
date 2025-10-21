import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNfa } from "../context/NfaContext"; // Your NfaContext for API calls

export default function VendorObject({ role }) {
  const { vendorCode } = useParams();
  const { nfaDetails, fetchNfaDetails, loading, error } = useNfa();

  const [isEdit, setIsEdit] = useState(false);
  const [vendorData, setVendorData] = useState({});
  const [workflowSearch, setWorkflowSearch] = useState([]);
  const [workflowFiltered, setWorkflowFiltered] = useState([]);

  // Fetch API data if not already fetched
  useEffect(() => {
    fetchNfaDetails();
  }, []);

  // Set vendorData and workflow based on vendorCode
  useEffect(() => {
    if (!nfaDetails.length) return;

    // Find the vendor
    const vendor = nfaDetails.flatMap(n => n.vendors || [])
      .find(v => v.vendorCode === vendorCode);

    if (vendor) {
      setVendorData(vendor);

      // Set workflow history for this vendor
      const workflow = nfaDetails.flatMap(n => n.workflow || [])
        .filter(w => w.vendorCode === vendorCode);

      setWorkflowFiltered(workflow);
    }
  }, [nfaDetails, vendorCode]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error.message}</div>;
  if (!vendorData.vendorCode) return <div className="p-10 text-center">Vendor not found!</div>;

  const handleChange = (key, value) =>
    setVendorData({ ...vendorData, [key]: value });

  const renderCardItem = (key, value) => (
    <div className="flex flex-col p-4 rounded-lg shadow-lg" style={{ backgroundColor: "var(--card)" }}>
      <span className="text-[var(--text-muted)] font-semibold">{key}</span>
      {isEdit ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          className="input mt-1 w-full"
        />
      ) : (
        <span className="text-[var(--text-primary)]">{value}</span>
      )}
    </div>
  );

  // Filter workflow dynamically
  const workflowToShow = workflowFiltered.filter(
    (w) =>
      w.employeeName.toLowerCase().includes(workflowSearch.toLowerCase()) ||
      w.status.toLowerCase().includes(workflowSearch.toLowerCase())
  );

  return (
    <div className="p-10 flex flex-col gap-6 relative min-h-screen">

      {/* Header Top Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">Vendor Details</h3>
        <div className="flex gap-4">
          {!isEdit && role === 'buyer' && (
            <button className="button-secondary button-edit" onClick={() => setIsEdit(true)}>Edit</button>
          )}
        </div>
      </div>

      {/* Vendor Header Section */}
      <section className="page-section">
        <h3 className="section-title">Vendor Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderCardItem("Vendor Name", vendorData.vendorName)}
          {renderCardItem("Original Quote", vendorData.originalQuote)}
          {renderCardItem("Final Quote", vendorData.finalQuote)}
          {renderCardItem("Awarded Vendor", vendorData.awarded ? "Yes" : "No")}
          {renderCardItem("Contract Period", vendorData.contractPeriod + " months")}
          {renderCardItem("Contract Value", vendorData.contractValue)}
          {renderCardItem("Budget", vendorData.budget)}
          {renderCardItem("Delivery Lead Time", vendorData.deliveryLeadTime)}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="page-section mt-6">
        <h3 className="section-title">Vendor Workflow History</h3>
        <input
          type="text"
          placeholder="Search Workflow..."
          className="input mb-2"
          value={workflowSearch}
          onChange={(e) => setWorkflowSearch(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="tableBtn">
            <thead>
              <tr>
                <th>Level</th>
                <th>Employee Name</th>
                <th>Status</th>
                <th>Days Taken</th>
                <th>Begin Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {workflowToShow.length ? workflowToShow.map((w, i) => (
                <tr key={i}>
                  <td>{w.level}</td>
                  <td>{w.employeeName}</td>
                  <td>{w.status}</td>
                  <td>{w.daysTaken}</td>
                  <td>{new Date(w.beginDate).toLocaleDateString()}</td>
                  <td>{new Date(w.endDate).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-muted">No workflow found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Save / Discard Buttons */}
      {isEdit && (
        <div className="fixed bottom-6 right-6 flex gap-4">
          <button className="button-primary button-save" onClick={() => setIsEdit(false)}>Save</button>
          <button className="button-secondary button-discard" onClick={() => {
            setVendorData(vendorData); // reset to original API data if needed
            setIsEdit(false);
          }}>Discard</button>
        </div>
      )}

    </div>
  );
}
