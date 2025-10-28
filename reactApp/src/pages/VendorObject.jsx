import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNfa } from "../context/NfaContext"; // NFA context for API calls
import Loading from "components/Loading";
import Error from "components/Error";

export default function VendorObject({ role }) {
  const { vendorCode } = useParams();
  const location = useLocation();

  // Extract NFA Number from route (e.g., /nfa/:nfaNumber/vendor/:vendorCode)
  const nfaNumber = location.pathname.split("/")[2];

  const {
    nfaVendorData,
    nfaWorkflowHistory,
    nfaVendorDueDeligence,
    nfaVendorDueDeligenceGrade,
    fetchAllByNfaNumber,
    loading,
    error,
  } = useNfa();

  const [isEdit, setIsEdit] = useState(false);
  const [vendorData, setVendorData] = useState({});
  const [workflowSearch, setWorkflowSearch] = useState("");
  const [workflowFiltered, setWorkflowFiltered] = useState([]);

  // Fetch all data for this NFA number
  useEffect(() => {
    if (nfaNumber) fetchAllByNfaNumber(nfaNumber);
  }, [nfaNumber]);

  // Filter vendor and workflow
  useEffect(() => {
    if (!nfaVendorData?.length) return;

    const vendor = nfaVendorData.find(
      (v) => v.ProposedVendorCode === vendorCode
    );

    if (vendor) {
      setVendorData(vendor);

      const workflow = nfaWorkflowHistory.filter(
        (w) => w.VendorCode === vendorCode
      );

      setWorkflowFiltered(workflow);
    }
  }, [nfaVendorData, nfaWorkflowHistory, vendorCode]);

  const handleRetry = () => fetchAllByNfaNumber(nfaNumber);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} onRetry={handleRetry} />;
  if (!vendorData.ProposedVendorCode)
    return <div className="p-10 text-center">Vendor not found!</div>;

  const handleChange = (key, value) =>
    setVendorData({ ...vendorData, [key]: value });

  const renderCardItem = (key, value) => (
    <div
      className="flex flex-col p-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:bg-[var(--hover-card)]"
      style={{ backgroundColor: "var(--card)" }}
    >
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
      w.EmployeeName?.toLowerCase().includes(workflowSearch.toLowerCase()) ||
      w.Status?.toLowerCase().includes(workflowSearch.toLowerCase())
  );

  return (
    <div className="p-10 flex flex-col gap-6 relative min-h-screen">
      {/* Header Top Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">Vendor Details</h3>
        {/* <div className="flex gap-4">
          {!isEdit && role === "buyer" && (
            <button
              className="button-secondary button-edit"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div> */}
      </div>

      {/* Vendor Header Section */}
      <section className="page-section">
        <h3 className="section-title">Vendor Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderCardItem("Vendor Name", vendorData.VendorName)}
          {renderCardItem("Original Quote", vendorData.OriginalQuote)}
          {renderCardItem("Final Quote", vendorData.FinalQuote)}
          {renderCardItem(
            "Awarded Vendor",
            vendorData.AwardedVendor ? "Yes" : "No"
          )}
          {renderCardItem("Contract Period", vendorData.ContractPeriod)}
          {renderCardItem("Contract Value", vendorData.ContractValue)}
          {renderCardItem("Budget", vendorData.Budget)}
          {renderCardItem("Delivery Lead Time", vendorData.DeliveryLeadTime)}
        </div>
      </section>


      {/* 🔍 Due Diligence Section */}
      {/* 🔍 Due Diligence Section */}
      <section className="page-section mt-6">
        <h3 className="section-title">Vendor Due Diligence</h3>

        {(() => {
          const due = nfaVendorDueDeligence.filter(
            (d) => d.ProposedVendorCode === vendorCode
          );
          const grade = nfaVendorDueDeligenceGrade.filter(
            (g) => g.ProposedVendorCode === vendorCode
          );

          if (!due.length)
            return (
              <div className="p-6 bg-[var(--card)] rounded-lg shadow-sm text-center text-[var(--text-muted)]">
                No due diligence data available for this vendor.
              </div>
            );

          const d = due[0];

          // Prepare fields to show
          const details = [
            { label: "Company Name", value: d.CompanyName },
            { label: "Company Activity", value: d.CompanyActivity },
            { label: "Company Address", value: d.CompanyAddress },
            { label: "City", value: d.CompanyCity },
            { label: "State", value: d.CompanyState },
            { label: "Country", value: d.CompanyCountry },
            { label: "Pincode", value: d.CompanyPincode },
            { label: "Email", value: d.CompanyEmail },
            { label: "Phone Number", value: d.CompanyNumber },
            { label: "Website", value: d.CompanyWebsite },
            { label: "Class Of Company", value: d.ClassOfCompany },
            { label: "Listing Status", value: d.ListingStatus },
            { label: "Authorized Capital", value: d.AuthorizedCapital },
            { label: "Paid Up Capital", value: d.PaidUpCapital },
            { label: "Age Of Company", value: d.AgeOfCompany },
            { label: "Date Of Incorporation", value: d.DateOfIncorporation },
            { label: "Date Of Last Balance Sheet", value: d.DateOfLastBalanceSheet },
            { label: "Date Of Last AGM", value: d.DateofLastAnnualGeneralMeeting },
            { label: "Management Details", value: d.ManagementDetails },
            { label: "NIC Code", value: d.NICCode },
            { label: "NIC Description", value: d.NICCodeDescription },
            { label: "Risk Grade", value: d.RiskGrade },
            { label: "Risk Score", value: d.RiskScore },
            { label: "Company Status", value: d.CompanyStatus },
            { label: "Description", value: d.Description },
            { label: "Comments", value: d.Comments },
          ];

          return (
            <>
              {/* Summary — match Vendor Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {details.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col p-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:bg-[var(--hover-card)]"
                    style={{ backgroundColor: "var(--card)" }}
                  >
                    <span className="text-[var(--text-muted)] font-semibold">
                      {item.label}
                    </span>
                    <span className="text-[var(--text-primary)]">
                      {item.value && item.value !== "" ? item.value : "-"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Risk Grade Table — match Workflow History */}
              <div className="mt-8">
                <h4 className="font-semibold text-lg mb-3">Risk Grade Details</h4>
                <div className="overflow-x-auto">
                  <table className="tableBtn">
                    <thead>
                      <tr>
                        <th>Min Score</th>
                        <th>Max Score</th>
                        <th>Category</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grade.length > 0 ? (
                        grade.map((g, i) => (
                          <tr key={i}>
                            <td>{g.MinScore}</td>
                            <td>{g.MaxScore}</td>
                            <td>{g.Category}</td>
                            <td>{g.GradeDescription}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center p-4 text-muted">
                            No risk grade details available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          );
        })()}
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
              {workflowToShow.length ? (
                workflowToShow.map((w, i) => (
                  <tr key={i}>
                    <td>{w.Level}</td>
                    <td>{w.EmployeeName}</td>
                    <td>{w.Status}</td>
                    <td>{w.DaysTaken}</td>
                    <td>
                      {w.BeginDate
                        ? new Date(w.BeginDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {w.EndDate
                        ? new Date(w.EndDate).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-muted">
                    No workflow found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>


      {/* Save / Discard Buttons */}
      {isEdit && (
        <div className="fixed bottom-6 right-6 flex gap-4">
          <button
            className="button-primary button-save"
            onClick={() => setIsEdit(false)}
          >
            Save
          </button>
          <button
            className="button-secondary button-discard"
            onClick={() => {
              setVendorData(vendorData);
              setIsEdit(false);
            }}
          >
            Discard
          </button>
        </div>
      )}
    </div>
  );
}
