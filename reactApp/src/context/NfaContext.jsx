import React, { createContext, useContext, useState } from "react";
import { getEntityData, postEntityData, deleteEntityData } from "../api/sapApi"; 

const NfaContext = createContext();

export const NfaProvider = ({ children }) => {
  const [nfaDetails, setNfaDetails] = useState([]);
  const [nfaEventHistory, setNfaEventHistory] = useState([]);
  const [nfaVendorData, setNfaVendorData] = useState([]);
  const [nfaVendorItems, setNfaVendorItems] = useState([]);
  const [nfaVendorDueDeligence, setNfaVendorDueDeligence] = useState([]);
  const [nfaVendorDueDeligenceGrade, setNfaVendorDueDeligenceGrade] = useState([]);
  const [nfaAttachments, setNfaAttachments] = useState([]);
  const [nfaComments, setNfaComments] = useState([]);
  const [nfaWorkflowHistory, setNfaWorkflowHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------
  // 🔹 Fetch all NFAs for list
  // -------------------------
  const fetchAllNfas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEntityData("NfaDetails"); // replace with your entity name
      setNfaDetails(data || []);
    } catch (err) {
      console.error("Failed to fetch NFAs:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // 🔹 Fetch single NFA by number
  // -------------------------
  const fetchAllByNfaNumber = async (nfaNumber) => {
    setLoading(true);
    setError(null);
    try {
      const [
        events,
        vendors,
        items,
        dueDeligence,
        dueDeligenceGrade,
        attachments,
        comments,
        workflow
      ] = await Promise.all([
        getEntityData("NfaEventHistory", { $filter: `NfaNumber eq '${nfaNumber}'` }),
        getEntityData("NfaVendorData", { $filter: `NfaNumber eq '${nfaNumber}'` }),
        getEntityData("NfaVendorItemsDetails", { $filter: `NfaNumber eq '${nfaNumber}'` }),
        getEntityData("NfaVendorDueDeligenceDetails", { $filter: `NfaNumber eq '${nfaNumber}'` }),
        getEntityData("NfaVendorDueDeligenceDetailsGrade", { $filter: `NfaNumber eq '${nfaNumber}'` }),
        getEntityData("NfaAttachments", { $filter: `NfaNumber eq '${nfaNumber}'` }),
        getEntityData("NfaCommentsHistory", { $filter: `NfaNumber eq '${nfaNumber}'` }),
        getEntityData("NfaWorkflowHistory", { $filter: `NfaNumber eq '${nfaNumber}'` })
      ]);

      setNfaEventHistory(events);
      setNfaVendorData(vendors);
      setNfaVendorItems(items);
      setNfaVendorDueDeligence(dueDeligence);
      setNfaVendorDueDeligenceGrade(dueDeligenceGrade);
      setNfaAttachments(attachments);
      setNfaComments(comments);
      setNfaWorkflowHistory(workflow);
    } catch (err) {
      console.error("Failed to fetch NFA data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // 🔹 Attachments CRUD
  // -------------------------
  const createAttachment = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const created = await postEntityData("NfaAttachments", payload);
      await fetchAllByNfaNumber(payload.NfaNumber);
      return created;
    } catch (err) {
      console.error("Failed to create attachment:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAttachment = async (attachmentId, nfaNumber) => {
    setLoading(true);
    setError(null);
    try {
      await deleteEntityData(`NfaAttachments('${attachmentId}')`);
      await fetchAllByNfaNumber(nfaNumber);
    } catch (err) {
      console.error("Failed to delete attachment:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // 🔹 Comments create only
  // -------------------------
  const createComment = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const created = await postEntityData("NfaCommentsHistory", payload);
      await fetchAllByNfaNumber(payload.NfaNumber);
      return created;
    } catch (err) {
      console.error("Failed to create comment:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    nfaDetails,
    nfaEventHistory,
    nfaVendorData,
    nfaVendorItems,
    nfaVendorDueDeligence,
    nfaVendorDueDeligenceGrade,
    nfaAttachments,
    nfaComments,
    nfaWorkflowHistory,
    loading,
    error,
    fetchAllNfas,          // <-- for Home list
    fetchAllByNfaNumber,   // <-- for single NFA
    createAttachment,
    deleteAttachment,
    createComment,
  };

  return <NfaContext.Provider value={value}>{children}</NfaContext.Provider>;
};

export const useNfa = () => useContext(NfaContext);
