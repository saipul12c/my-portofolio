import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { filterSpamContacts } from "../utils/filterContacts";

const CACHE_KEY = "cached_sheetdb_contacts_v1";
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 menit

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL;

  // Parse timestamp dari berbagai format
  const parseTimestamp = (contact) => {
    const timestamp = contact.timestamp || contact.date || contact.created_at || contact.createdAt;
    if (!timestamp) return 0;
    
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  };

  // Helper untuk membaca cache
  const getCachedData = () => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed;
      }
    } catch {
      // Ignore cache parse error
    }
    return null;
  };

  // Helper untuk menyimpan cache
  const setCachedData = (sortedContacts, total) => {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          contacts: sortedContacts,
          totalContacts: total,
          timestamp: Date.now(),
        })
      );
    } catch {
      // Storage quota or disabled
    }
  };

  // Enhanced fetch data dengan caching dan abort handling
  const fetchContacts = useCallback(async (retryCount = 0, forceRefresh = false) => {
    try {
      setError(null);
      
      // Jika bukan force refresh, cek cache terlebih dahulu
      if (!forceRefresh && retryCount === 0) {
        const cached = getCachedData();
        if (cached) {
          setContacts(cached.contacts);
          setTotalContacts(cached.totalContacts);
          setLoadingContacts(false);
          return;
        }
      }

      if (!SHEETDB_URL) {
        setContacts([]);
        setTotalContacts(0);
        setLoadingContacts(false);
        return;
      }

      // Abort controller untuk request yang aman
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const res = await fetch(SHEETDB_URL, { signal: controller.signal });
      
      if (!res.ok) {
        throw new Error(`Gagal fetch data: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Handle SheetDB response format: { value: [...], Count: N }
      let dataArray = data;
      if (data && typeof data === 'object' && data.value && Array.isArray(data.value)) {
        dataArray = data.value;
      } else if (!Array.isArray(data)) {
        setContacts([]);
        setTotalContacts(0);
        setLoadingContacts(false);
        return;
      }

      // Set total contacts (including spam)
      const total = dataArray.length;
      setTotalContacts(total);

      // Filter spam emails (using 'lenient' mode untuk portfolio site)
      const filteredData = filterSpamContacts(dataArray, 'lenient');
      
      // Sort berdasarkan timestamp terbaru
      const sortedData = filteredData.sort((a, b) => {
        return parseTimestamp(b) - parseTimestamp(a);
      });
      
      setContacts(sortedData);
      setCachedData(sortedData, total);
      
      toast.dismiss();
      if (forceRefresh || retryCount > 0) {
        toast.success("Data berhasil diperbarui! ✨", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Request dibatalkan saat unmount, bukan error
      }
      
      setError(err.message);
      
      if (retryCount < 2) {
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = setTimeout(() => fetchContacts(retryCount + 1, forceRefresh), 2000);
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
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchContacts]);

  const handleRefreshContacts = async () => {
    setRefreshLoading(true);
    toast.info("Memperbarui pesan...", {
      position: "bottom-center",
    });
    await fetchContacts(0, true);
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
