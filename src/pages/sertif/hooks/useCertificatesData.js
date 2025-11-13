import { useState, useEffect } from "react";
import certificatesData from "../../../data/sertif/certificates.json";
import softskillsData from "../../../data/skills/softskills.json";
import projectsData from "../../../data/projects.json";
import testimonialsData from "../../../data/testimoni/testimonials.json";

const { certificates, tagColors } = certificatesData;

export const useCertificatesData = () => {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    try {
      if (softskillsData?.skills) {
        setSkills(softskillsData.skills);
      }
      if (projectsData?.projects) {
        setProjects(projectsData.projects);
      }
      if (testimonialsData) {
        setTestimonials(testimonialsData);
      }
    } catch (error) {
      console.error("Error loading additional data:", error);
    }
  }, []);

  return {
    certificates,
    tagColors,
    skills,
    projects,
    testimonials
  };
};