import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNfa } from "../context/NfaContext";
import { FileText, Trash2, Eye } from "lucide-react";
import Loading from "components/Loading";
import Error from "components/Error";

export default function NfaObject({ role }) {
    const { nfaNumber } = useParams();
    const navigate = useNavigate();
    const {
        fetchAllByNfaNumber,
        nfaEventHistory,
        nfaVendorData,
        nfaAttachments,
        nfaComments,
        nfaWorkflowHistory,
        loading,
        error,
        createAttachment,
        deleteAttachment
    } = useNfa();

    const [headerData, setHeaderData] = useState({});
    const [vendorSearch, setVendorSearch] = useState("");
    const [workflowSearch, setWorkflowSearch] = useState("");

    // Fetch all NFA related data
    useEffect(() => {
        fetchAllByNfaNumber(nfaNumber);
    }, [nfaNumber]);

    // Set header data (assuming nfaEventHistory contains main details)
    useEffect(() => {
        if (nfaEventHistory.length) setHeaderData(nfaEventHistory[0]);
    }, [nfaEventHistory]);

    // Retry handler for Error component
    const handleRetry = () => fetchAllByNfaNumber(nfaNumber);

    // Render loading or error
    if (loading) return <Loading />;
    if (error) return <Error message={error.message} onRetry={handleRetry} />;
    if (!headerData.NfaNumber) return <div className="p-10 text-center">NFA not found!</div>;

    const vendors = nfaVendorData.filter((v) =>
        v.VendorName?.toLowerCase().includes(vendorSearch.toLowerCase())
    );

    const workflow = nfaWorkflowHistory.filter((w) =>
        w.EmployeeName?.toLowerCase().includes(workflowSearch.toLowerCase()) ||
        w.Status?.toLowerCase().includes(workflowSearch.toLowerCase())
    );

    // Upload handler for buyer
    const handleAttachmentUpload = async (e) => {
        const files = Array.from(e.target.files);
        for (let file of files) {
            const payload = {
                NfaNumber: headerData.NfaNumber,
                FileName: file.name,
                MediaType: file.type,
                Content: file,
            };
            await createAttachment(payload);
        }
    };

    const handleDeleteAttachment = async (att) => {
        if (window.confirm("Are you sure you want to delete this attachment?")) {
            await deleteAttachment(att.ID, headerData.NfaNumber);
        }
    };

    const renderHeaderCard = (key, value) => (
        <div className="flex flex-col p-4 rounded-lg shadow-lg card" style={{ backgroundColor: "var(--card)" }}>
            <span className="key">{key}</span>
            <span className="value">{value || "-"}</span>
        </div>
    );

    return (
        <div className="p-10 flex flex-col gap-6 relative min-h-screen">
            {/* Top Buttons */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">NFA Details</h3>
                {role === "approver" && (
                    <button
                        className="button-primary button-comparative"
                        onClick={() => navigate(`/approver/comparative/${nfaNumber}`)}
                    >
                        Comparative Statement
                    </button>
                )}
            </div>

            {/* Header Section */}
            <section className="page-section">
                <h3 className="section-title">NFA Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {renderHeaderCard("NFA Number", headerData.NfaNumber)}
                    {renderHeaderCard("Project", headerData.ProjectDescription)}
                    {renderHeaderCard("Status", headerData.Status)}
                    {renderHeaderCard("Risk Category", headerData.RiskCategory)}
                    {renderHeaderCard("Total Spend", headerData.TotalSpend)}
                    {renderHeaderCard("Base Line Spend", headerData.BaseLineSpend)}
                    {renderHeaderCard("Final Proposed Value", headerData.FinalProposedValue)}
                    {renderHeaderCard("Owner", headerData.Owner)}
                </div>
            </section>

            {/* Vendor Section */}
            <section className="page-section">
                <h3 className="section-title">Vendors</h3>
                <input
                    type="text"
                    placeholder="Search Vendor..."
                    className="input mb-2"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                />
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Vendor Name</th>
                                <th>Original Quote</th>
                                <th>Final Quote</th>
                                <th>Awarded Vendor</th>
                                <th>Contract Period</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.length ? vendors.map((v) => (
                                <tr key={v.ProposedVendorCode} className="cursor-pointer hover:bg-gray-100">
                                    <td>{v.VendorName}</td>
                                    <td>{v.OriginalQuote || "-"}</td>
                                    <td>{v.FinalQuote || "-"}</td>
                                    <td>{v.AwardedVendor || "No"}</td>
                                    <td>{v.ContractPeriod || "-"}</td>
                                    <td>
                                        <button className="button-back" onClick={() => navigate(`${window.location.pathname}/vendor/${v.ProposedVendorCode}`)}>&gt;</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="text-center p-4 text-muted">No vendors found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Attachments Section */}
            <section className="page-section">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="section-title">Attachments</h3>
                    {role === "buyer" && (
                        <label className="button-primary cursor-pointer">
                            Upload
                            <input type="file" multiple className="hidden" onChange={handleAttachmentUpload} />
                        </label>
                    )}
                </div>
                <div className="attachment-container">
                    {nfaAttachments.length ? (
                        nfaAttachments.map((att, i) => (
                            <div key={i} className="attachment-row flex items-center justify-between gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                                <div className="flex items-start gap-3 cursor-pointer" onClick={() => window.open(att.Url, "_blank")}>
                                    <FileText size={28} className="text-red-500 mt-1"/>
                                    <div className="flex flex-col">
                                        <span className="attachment-name font-medium text-gray-800">{att.FileName}</span>
                                        <span className="attachment-date text-sm text-gray-500">{new Date(att.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                {role === "buyer" && (
                                    <div className="flex gap-2">
                                        <button onClick={() => window.open(att.Url, "_blank")}><Eye size={18} /></button>
                                        <button onClick={() => handleDeleteAttachment(att)}><Trash2 size={18} /></button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : <div className="attachment-row text-center text-gray-400 py-3">No attachments uploaded.</div>}
                </div>
            </section>

            {/* Comments Section */}
            <section className="page-section">
                <h3 className="section-title">Comments</h3>
                {nfaComments.length ? (
                    <ul className="list-disc pl-6">
                        {nfaComments.map((c) => (
                            <li key={c.ID || c.createdAt}>{c.Comments || c.Content || "-"}</li>
                        ))}
                    </ul>
                ) : <div className="text-gray-400">No comments.</div>}
            </section>

            {/* Workflow Section */}
            <section className="page-section">
                <h3 className="section-title">Workflow History</h3>
                <input type="text" placeholder="Search Workflow..." className="input mb-2" value={workflowSearch} onChange={(e) => setWorkflowSearch(e.target.value)} />
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
                            {workflow.length ? workflow.map((w, i) => (
                                <tr key={i}>
                                    <td>{w.level}</td>
                                    <td>{w.EmployeeName}</td>
                                    <td>{w.Status || "-"}</td>
                                    <td>{w.DaysTaken || "-"}</td>
                                    <td>{w.BeginDateAndTime ? new Date(w.BeginDateAndTime).toLocaleString() : "-"}</td>
                                    <td>{w.EndDateAndTime ? new Date(w.EndDateAndTime).toLocaleString() : "-"}</td>
                                </tr>
                            )) : <tr><td colSpan={6} className="text-center p-4 text-muted">No workflow found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
