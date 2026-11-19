import { useState, useEffect } from "react";

const STORAGE_KEY = "zodiak_multi_profiles";

export const useSavedProfiles = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProfiles(parsed);
        }
      }
    } catch (err) {
      console.error("Gagal memuat profil tersimpan:", err);
    }
  }, []);

  const saveProfile = (newProfile) => {
    if (!newProfile || !newProfile.nama || !newProfile.zodiak) return;
    try {
      setProfiles((prev) => {
        // Cek apakah sudah ada profil dengan nama yang sama
        const filtered = prev.filter((p) => p.nama.toLowerCase() !== newProfile.nama.toLowerCase());
        const updated = [
          {
            id: newProfile.id || `prof_${Date.now()}`,
            nama: newProfile.nama,
            tanggalLahir: newProfile.tanggalLahir,
            zodiak: newProfile.zodiak,
            simbol: newProfile.simbol || "✨",
            elemen: newProfile.elemen || "Api",
            savedAt: new Date().toISOString()
          },
          ...filtered
        ].slice(0, 8); // Maksimal simpan 8 profil

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
    }
  };

  const deleteProfile = (id) => {
    try {
      setProfiles((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Gagal menghapus profil:", err);
    }
  };

  return { profiles, saveProfile, deleteProfile };
};
