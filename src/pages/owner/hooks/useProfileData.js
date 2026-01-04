import { useMemo } from "react";
import profileData from "../../../components/helpbutton/chat/data/profile.json";
import commitmentsData from "../../../components/helpbutton/komit/data/commitments.json";
import projectsData from "../../../data/projects.json";
import testimonialsData from "../../../data/testimoni/testimonials.json";
import softSkillsData from "../../../data/skills/softskills.json";
import blogData from "../../../data/blog/data.json";
import certificatesData from "../../../data/sertif/certificates.json";
import hobbiesData from "../../../data/hub/hobbiesData.json";
import bahasaData from "../../../data/bahasa/data.json";
import pendidikanData from "../../../data/pendidikan/data.json";

/**
 * Custom hook to load and provide all profile data
 */
export const useProfileData = () => {
  const data = useMemo(() => ({
    profile: profileData || {},
    commitments: (commitmentsData && commitmentsData.commitments) || [],
    projects: (projectsData && projectsData.projects) || [],
    testimonials: testimonialsData || [],
    softSkills: softSkillsData.skills || [],
    blogs: blogData || [],
    certificates: certificatesData.certificates || [],
    hobbies: hobbiesData || [],
    bahasa: bahasaData,
    pendidikan: pendidikanData
  }), []);

  return data;
};
