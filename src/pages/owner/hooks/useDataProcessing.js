import { useMemo } from "react";
import { 
  getRecentItems, 
  getRecentItemsByYear, 
  getTopItemsByExperience,
  getItemsByPriority,
  calculateBlogStats,
  calculateTotalImpact 
} from "../utils/helpers";
import { SLICE_LIMITS } from "../utils/constants";

/**
 * Custom hook to process and derive data from raw profile data
 */
export const useDataProcessing = (data) => {
  const {
    projects,
    testimonials,
    softSkills,
    blogs,
    certificates,
    hobbies
  } = data;

  const processedData = useMemo(() => {
    // Process recent projects
    const recentProjects = getRecentItems(projects, SLICE_LIMITS.recentProjects);

    // Process recent testimonials
    const recentTestimonials = getRecentItems(testimonials, SLICE_LIMITS.recentTestimonials);

    // Process top soft skills
    const topSoftSkills = getTopItemsByExperience(softSkills, 85, SLICE_LIMITS.topSoftSkills);

    // Process recent blogs
    const recentBlogs = getRecentItems(blogs, SLICE_LIMITS.recentBlogs);

    // Process recent certificates
    const recentCertificates = getRecentItemsByYear(certificates, SLICE_LIMITS.recentCertificates);

    // Process top hobbies
    const topHobbies = getItemsByPriority(hobbies, "High", SLICE_LIMITS.topHobbies);

    // Calculate blog statistics
    const blogStats = calculateBlogStats(blogs);

    // Calculate total impact
    const totalImpact = calculateTotalImpact(projects);

    return {
      recentProjects,
      recentTestimonials,
      topSoftSkills,
      recentBlogs,
      recentCertificates,
      topHobbies,
      blogStats,
      totalImpact,
      projectsCount: projects.length,
      testimonialsCount: testimonials.length
    };
  }, [projects, testimonials, softSkills, blogs, certificates, hobbies]);

  return processedData;
};
