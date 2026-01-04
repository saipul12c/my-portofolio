import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { filterSpamContacts } from "../utils/filterContacts";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState(null);

  const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL;

  // Parse timestamp dari berbagai format
  const parseTimestamp = (contact) => {
    const timestamp = contact.timestamp || contact.date || contact.created_at || contact.createdAt;
    if (!timestamp) return 0;
    
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  };

  // Enhanced fetch data dengan retry logic
  const fetchContacts = useCallback(async (retryCount = 0) => {
    try {
      setError(null);
      
      if (!SHEETDB_URL) {
        console.warn("⚠️ SHEETDB_URL tidak dikonfigurasi");
        setContacts([]);
        setTotalContacts(0);
        setLoadingContacts(false);
        return;
      }

      const res = await fetch(SHEETDB_URL);
      if (!res.ok) throw new Error(`Gagal fetch data: ${res.status}`);
      const data = await res.json();
      
      // Validasi data
      if (!Array.isArray(data)) {
        console.warn("⚠️ Data bukan array:", data);
        setContacts([]);
        setTotalContacts(0);
        return;
      }

      // Set total contacts (including spam)
      setTotalContacts(data.length);

      // Filter spam emails
      const filteredData = filterSpamContacts(data);
      
      // Sort berdasarkan timestamp terbaru
      const sortedData = filteredData.sort((a, b) => {
        return parseTimestamp(b) - parseTimestamp(a);
      });
      
      setContacts(sortedData);
      
      toast.dismiss();
      if (retryCount > 0) {
        toast.success("Data berhasil diperbarui! ✨", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      console.error("❌ Error fetch contacts:", err);
      setError(err.message);
      
      if (retryCount < 3) {
        toast.warning(`Mencoba lagi... (${retryCount + 1}/3)`, {
          position: "bottom-center",
        });
        setTimeout(() => fetchContacts(retryCount + 1), 2000);
      } else {
        toast.error("Gagal memuat pesan masuk", {
          position: "bottom-center",
        });
      }
    } finally {
      setLoadingContacts(false);
      setRefreshLoading(false);
    }
  }, [SHEETDB_URL]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleRefreshContacts = async () => {
    setRefreshLoading(true);
    toast.info("Memperbarui pesan...", {
      position: "bottom-center",
    });
    await fetchContacts();
  };

  return {
    contacts,
    totalContacts,
    loadingContacts,
    refreshLoading,
    error,
    handleRefreshContacts,
  };
};