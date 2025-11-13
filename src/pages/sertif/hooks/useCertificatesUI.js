import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useCertificatesUI = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const closePopup = useCallback(() => setSelected(null), []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
  }, [selected]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && closePopup();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closePopup]);

  const handleSkillClick = useCallback((skillId) => {
    if (!skillId) return;
    closePopup();
    navigate(`/SoftSkills/${skillId}`);
  }, [closePopup, navigate]);

  const handleProjectClick = useCallback((projectId) => {
    if (!projectId) return;
    closePopup();
    navigate(`/projects/${projectId}`);
  }, [closePopup, navigate]);

  const handleTestimonialClick = useCallback((testimonialId) => {
    if (!testimonialId) return;
    closePopup();
    navigate(`/testimoni/${testimonialId}`);
  }, [closePopup, navigate]);

  return {
    selected,
    setSelected,
    closePopup,
    handleSkillClick,
    handleProjectClick,
    handleTestimonialClick
  };
};