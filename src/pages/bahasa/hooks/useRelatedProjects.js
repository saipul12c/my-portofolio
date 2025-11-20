import { useMemo } from "react";
import projectsData from "../../../data/projects.json";

/**
 * Hook untuk menemukan project yang menggunakan teknologi tertentu
 * @param {string} techName - Nama teknologi/bahasa pemrograman
 * @returns {Array} - Array projects yang menggunakan teknologi tersebut
 */
export const useRelatedProjects = (techName) => {
  return useMemo(() => {
    if (!techName || !projectsData.projects) return [];

    const relatedProjects = projectsData.projects.filter(project => {
      // Cek di array tech
      if (project.tech && project.tech.includes(techName)) {
        return true;
      }
      // Cek di framework jika ada
      if (project.framework && project.framework.includes(techName)) {
        return true;
      }
      // Cek di description
      if (project.description && project.description.toLowerCase().includes(techName.toLowerCase())) {
        return true;
      }
      return false;
    });

    return relatedProjects.slice(0, 3).map(project => ({
      ...project,
      link: `/project-detail/${project.id}`,
      relevance: "tinggi"
    }));
  }, [techName]);
};
