import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import hobbiesData from "../../../data/hub/hobbiesData.json";
import { generateSlug } from "../utils/hobbyUtils";

export default function useHobbyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find hobby by slug with useMemo for performance
  const hobby = useMemo(() => {
    return hobbiesData.find(h => generateSlug(h.title) === slug);
  }, [slug]);

  // Navigation handlers
  const handleBack = () => navigate(-1);
  const handleGoToHobbies = () => navigate('/hobbies');

  // Action handlers
  const handleStartActivity = () => {
    console.log(`Starting activity: ${hobby?.title}`);
    // TODO: Implement start activity logic
    // Could include analytics, state management, etc.
  };

  const handleSaveForLater = () => {
    console.log(`Saving for later: ${hobby?.title}`);
    // TODO: Implement save logic
    // Could include local storage, API calls, etc.
  };

  const handleAddToFavorites = () => {
    console.log(`Adding to favorites: ${hobby?.title}`);
    // TODO: Implement favorite logic
  };

  return {
    hobby,
    isHobbyFound: !!hobby,
    // Navigation
    handleBack,
    handleGoToHobbies,
    // Actions
    handleStartActivity,
    handleSaveForLater,
    handleAddToFavorites
  };
}