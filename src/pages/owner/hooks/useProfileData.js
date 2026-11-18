import { useMemo, useState, useEffect } from "react";
import profileData from "../../../data/about/profile.json";
import commitmentsData from "../../../data/helpbutton/komit/commitments.json";
import projectsData from "../../../data/projects.json";
import testimonialsData from "../../../data/testimoni/testimonials.json";
import softSkillsData from "../../../data/skills/softskills.json";
import certificatesData from "../../../data/sertif/certificates.json";
import hobbiesData from "../../../data/hub/hobbiesData.json";
import bahasaData from "../../../data/bahasa/data.json";
import pendidikanData from "../../../data/pendidikan/data.json";
import { fetchAllPosts } from "../../blog/services/blogSupabase";

/**
 * Custom hook to load and provide all profile data
 */
export const useProfileData = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetchAllPosts().then((liveBlogs) => {
      if (isMounted && Array.isArray(liveBlogs) && liveBlogs.length > 0) {
        setBlogs(liveBlogs);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const data = useMemo(() => ({
    profile: profileData || {},
    commitments: (commitmentsData && commitmentsData.commitments) || [],
    projects: (projectsData && projectsData.projects) || [],
    testimonials: testimonialsData || [],
    softSkills: softSkillsData.skills || [],
    blogs: blogs,
    certificates: certificatesData.certificates || [],
    hobbies: hobbiesData || [],
    bahasa: bahasaData,
    pendidikan: pendidikanData
  }), [blogs]);

  return data;
};
