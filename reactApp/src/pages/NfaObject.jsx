import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNfa } from "../context/NfaContext";
import { FileText, Trash2, Eye, MessageSquare, UserCircle, X } from "lucide-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Loading from "components/Loading";
import Error from "components/Error";

export default function NfaObject({ role }) {
  const { nfaNumber } = useParams();
  const navigate = useNavigate();

  const {
    fetchAllByNfaNumber,
    oneNfa, // single NFA record from context
    nfaEventHistory,
    nfaVendorData,
    nfaAttachments,
    nfaComments,
    nfaWorkflowHistory,
    loading,
    error,
    createAttachment,
    deleteAttachment,
    createComment,
  } = useNfa();

  const [vendorSearch, setVendorSearch] = useState("");
  const [workflowSearch, setWorkflowSearch] = useState("");
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showHeaderDetails, setShowHeaderDetails] = useState(true);

  // Fetch all NFA related data
  useEffect(() => {
    fetchAllByNfaNumber(nfaNumber);
  }, [nfaNumber]);

  const handleRetry = () => fetchAllByNfaNumber(nfaNumber);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} onRetry={handleRetry} />;
  if (!oneNfa) return <div className="p-10 text-center">NFA not found!</div>;

  // Filter vendors by search text
  const filteredVendors = nfaVendorData.filter((v) =>
    v.VendorName?.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  // Keep unique vendors by ProposedVendorCode
  const vendors = Object.values(
    filteredVendors.reduce((acc, curr) => {
      acc[curr.ProposedVendorCode] = curr;
      return acc;
    }, {})
  );

  const workflow = nfaWorkflowHistory.filter(
    (w) =>
      w.EmployeeName?.toLowerCase().includes(workflowSearch.toLowerCase()) ||
      w.Status?.toLowerCase().includes(workflowSearch.toLowerCase())
  );

  const handleAttachmentUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (let file of files) {
      const payload = {
        NfaNumber: oneNfa.NfaNumber,
        FileName: file.name,
        MediaType: file.type,
        Content: file,
      };
      await createAttachment(payload);
    }
  };

  const handleDeleteAttachment = async (att) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      await deleteAttachment(att.ID, oneNfa.NfaNumber);
    }
  };

  const renderHeaderCard = (key, value) => (
    <div
      key={key}
      className="flex flex-col justify-between p-4 rounded-xl border border-gray-200 bg-white shadow-sm 
        hover:shadow-md hover:border-gray-300 transition-all duration-200"
    >
      <span className="text-sm font-medium text-gray-500 tracking-wide">{key}</span>
      <span className="text-base font-semibold text-gray-800 mt-1 truncate">
        {value && value !== "" ? value : "-"}
      </span>
    </div>
  );

  const handleCreateComment = async () => {
    const email = localStorage.getItem("email") || null;
    const payload = {
      Comments: newComment || "",
      NfaNumber: oneNfa.NfaNumber,
      Status: null,
      User: email,
      createdAt: new Date().toISOString(),
      createdBy: email || "privileged",
      modifiedAt: new Date().toISOString(),
      modifiedBy: email || "privileged",
      HasActiveEntity: false,
      HasDraftEntity: false,
      IsActiveEntity: true,
    };

    try {
      await createComment(payload);
      setNewComment("");
      setIsCommentDialogOpen(false);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-6 relative min-h-screen">
      {/* Header Buttons */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">NFA Details</h3>
        {role === "approver" && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate(`/approver/comparative/${nfaNumber}`)}
          >
            Comparative Statement
          </button>
        )}
      </div>

      {/* Collapsible NFA Header Info */}
      <section className="page-section">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowHeaderDetails(!showHeaderDetails)}
        >
          <h3 className="text-2xl font-bold flex items-center gap-2 text-black-700">
            NFA Header Details{" "}
            {showHeaderDetails ? <FaChevronUp /> : <FaChevronDown />}
          </h3>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 overflow-hidden ${
            showHeaderDetails ? "max-h-[2000px]" : "max-h-0"
          }`}
        >
          {oneNfa ? (
            <>
              {renderHeaderCard("NFA Number", oneNfa.NfaNumber)}
              {renderHeaderCard("Status", oneNfa.Status)}
              {renderHeaderCard("Owner", oneNfa.Owner)}
              {renderHeaderCard("Created By", oneNfa.CreatedBy)}
              {renderHeaderCard("Approving Plant", oneNfa.ApprovingPlant)}
              {renderHeaderCard("Base Language", oneNfa.BaseLanguage)}
              {renderHeaderCard("Base Line Spend", oneNfa.BaseLineSpend)}
              {renderHeaderCard("Final Proposed Value", oneNfa.FinalProposedValue)}
              {renderHeaderCard("Total Spend", oneNfa.TotalSpend)}
              {renderHeaderCard("Target Savings", oneNfa.TargetSavings)}
              {renderHeaderCard(
                "Savings Achieved (Initial vs Final)",
                oneNfa.SavingsAchievedBtwInitialAndFinalQuote
              )}
              {renderHeaderCard("Commodity", oneNfa.Commodity)}
              {renderHeaderCard("Departments", oneNfa.Departments)}
              {renderHeaderCard("Regions", oneNfa.Regions)}
              {renderHeaderCard("SBU Unit Location", oneNfa.SBUUnitLocation)}
              {renderHeaderCard(
                "Project Currency",
                oneNfa.ProjectCurrencyORBaseCurrency
              )}
              {renderHeaderCard("Risk Category", oneNfa.RiskCategory)}
              {renderHeaderCard(
                "Subject of Proposal / Order",
                oneNfa.SubjectofProposalOROrder
              )}
              {renderHeaderCard("RFP Number", oneNfa.RfpNumber)}
              {renderHeaderCard("RFP Publish Date", oneNfa.RfpPublishDate)}
              {renderHeaderCard("Workflow ID", oneNfa.WorkFlowId)}
              {renderHeaderCard("Task ID", oneNfa.TaskId)}
              {renderHeaderCard("Due Diligence Origin", oneNfa.DueDeligenceOrigin)}
              {renderHeaderCard(
                "Due Diligence Status",
                oneNfa.DueDeligenceStatus ? "Yes" : "No"
              )}
              {renderHeaderCard("Auction Done", oneNfa.AuctionDone ? "Yes" : "No")}
              {renderHeaderCard(
                "Anticipated Contract Effective Date",
                oneNfa.AnticipatedContractEffectiveDate
              )}
              {renderHeaderCard("Version", oneNfa.Version)}
              {renderHeaderCard("Max Round", oneNfa.maxRound)}
              {renderHeaderCard(
                "Last Modified",
                oneNfa.LastModified
                  ? new Date(oneNfa.LastModified).toLocaleString()
                  : "-"
              )}
            </>
          ) : (
            <div className="text-gray-500 text-center col-span-full py-4">
              No NFA header details available
            </div>
          )}
        </div>
      </section>

      {/* Vendors */}
      <section className="page-section">
        <h3 className="section-title mb-2">Vendors</h3>
        <input
          type="text"
          placeholder="Search Vendor..."
          className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={vendorSearch}
          onChange={(e) => setVendorSearch(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="table w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
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
              {vendors.length ? (
                vendors.map((v) => (
                  <tr
                    key={v.ProposedVendorCode}
                    className="cursor-pointer hover:bg-gray-100 transition"
                    onClick={() =>
                      navigate(`${window.location.pathname}/vendor/${v.ProposedVendorCode}`)
                    }
                  >
                    <td>{v.VendorName}</td>
                    <td>{v.OriginalQuote || "-"}</td>
                    <td>{v.FinalQuote || "-"}</td>
                    <td>
                      <span
                        className={`${
                          v.AwardedVendor === "Yes"
                            ? "text-green-600 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {v.AwardedVendor || "No"}
                      </span>
                    </td>
                    <td>{v.ContractPeriod || "-"}</td>
                    <td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-muted">
                    No vendors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Attachments */}
      <section className="page-section">
        <div className="flex justify-between items-center mb-2">
          <h3 className="section-title">Attachments</h3>
          {role === "buyer" && (
            <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
              Upload
              <input type="file" multiple className="hidden" onChange={handleAttachmentUpload} />
            </label>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {nfaAttachments.length ? (
            nfaAttachments.map((att, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => window.open(att.Url, "_blank")}
                >
                  <FileText size={24} className="text-red-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">{att.FileName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(att.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {role === "buyer" && (
                  <div className="flex gap-2">
                    <button onClick={() => window.open(att.Url, "_blank")}>
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDeleteAttachment(att)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-3">No attachments uploaded.</div>
          )}
        </div>
      </section>

      {/* Comments */}
      <section className="page-section">
        <div className="flex justify-between items-center mb-2">
          <h3 className="section-title">Comments</h3>
          <button
            onClick={() => setIsCommentDialogOpen(true)}
            className="bg-blue-600 text-white px-4 py-2  rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <MessageSquare size={16} /> Create
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {nfaComments.length ? (
            nfaComments.map((c, i) => (
              <div
                key={i}
                className="p-1 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="ml-5 flex justify-start gap-2 text-gray-800">
                  <UserCircle size={22} className="text-gray-500" />
                  <div className="flex gap-1">
                    <span className="font-medium">{c.User || "Anonymous"}</span>
                    <span className="text-sm text-gray-500">
                      ({c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : new Date().toLocaleString()}
                      )
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mt-1 italic ml-6">{c.Comments || "-"}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-400 py-3">No comments yet.</div>
          )}
        </div>
      </section>

      {/* Workflow */}
      <section className="page-section">
        <h3 className="section-title mb-2">Workflow History</h3>
        <input
          type="text"
          placeholder="Search Workflow..."
          className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={workflowSearch}
          onChange={(e) => setWorkflowSearch(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="tableBtn w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">Level</th>
                <th>Employee Name</th>
                <th>Status</th>
                <th>Days Taken</th>
                <th>Begin Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {workflow.length ? (
                workflow.map((w, i) => (
                  <tr key={i}>
                    <td className="p-2">{w.level}</td>
                    <td>{w.EmployeeName}</td>
                    <td>{w.Status || "-"}</td>
                    <td>{w.DaysTaken || "-"}</td>
                    <td>
                      {w.BeginDateAndTime
                        ? new Date(w.BeginDateAndTime).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {w.EndDateAndTime
                        ? new Date(w.EndDateAndTime).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 p-4">
                    No workflow found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Comment Modal */}
      {isCommentDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsCommentDialogOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Comment</h2>
            <textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCommentDialogOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
