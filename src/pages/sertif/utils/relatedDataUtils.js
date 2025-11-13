import { shuffleArray } from "./searchUtils";

// === Find related skills dengan pengacakan ===
export const findRelatedSkills = (certificateTags, skills) => {
  if (!certificateTags || !skills || skills.length === 0) return [];
  
  // Filter skills yang valid (punya id dan name)
  const validSkills = skills.filter(skill => skill?.id && skill?.name);
  
  // Cari skills yang relevan berdasarkan tag
  const relevantSkills = validSkills.filter(skill => 
    certificateTags.some(tag => 
      skill.name?.toLowerCase().includes(tag.toLowerCase()) ||
      skill.description?.toLowerCase().includes(tag.toLowerCase()) ||
      skill.tags?.some(skillTag => 
        skillTag.toLowerCase().includes(tag.toLowerCase())
      ) ||
      skill.category?.toLowerCase().includes(tag.toLowerCase())
    )
  );

  // Jika ada skills relevan, acak dan batasi jumlahnya
  if (relevantSkills.length > 0) {
    return shuffleArray(relevantSkills).slice(0, 4);
  }
  
  // Jika tidak ada yang relevan, ambil random skills
  return shuffleArray(validSkills).slice(0, 3);
};

// === Find related projects dengan pengacakan ===
export const findRelatedProjects = (certificateTags, projects) => {
  if (!certificateTags || !projects || projects.length === 0) return [];
  
  // Filter projects yang valid (punya id dan title)
  const validProjects = projects.filter(project => project?.id && project?.title);
  
  // Cari projects yang relevan berdasarkan tag
  const relevantProjects = validProjects.filter(project => 
    certificateTags.some(tag => 
      project.title?.toLowerCase().includes(tag.toLowerCase()) ||
      project.description?.toLowerCase().includes(tag.toLowerCase()) ||
      project.category?.toLowerCase().includes(tag.toLowerCase()) ||
      project.tech?.some(tech => 
        tech.toLowerCase().includes(tag.toLowerCase())
      ) ||
      project.tags?.some(projectTag => 
        projectTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  );

  // Jika ada projects relevan, acak dan batasi jumlahnya
  if (relevantProjects.length > 0) {
    return shuffleArray(relevantProjects).slice(0, 3);
  }
  
  // Jika tidak ada yang relevan, ambil random projects
  return shuffleArray(validProjects).slice(0, 2);
};

// === Find related testimonials dengan pengacakan ===
export const findRelatedTestimonials = (certificateTags, testimonials) => {
  if (!certificateTags || !testimonials || testimonials.length === 0) return [];
  
  // Filter testimonials yang valid (punya id dan text)
  const validTestimonials = testimonials.filter(testimonial => testimonial?.id && testimonial?.text);
  
  // Cari testimonials yang relevan berdasarkan tag
  const relevantTestimonials = validTestimonials.filter(testimonial => 
    certificateTags.some(tag => 
      testimonial.text?.toLowerCase().includes(tag.toLowerCase()) ||
      testimonial.title?.toLowerCase().includes(tag.toLowerCase()) ||
      testimonial.project?.toLowerCase().includes(tag.toLowerCase()) ||
      testimonial.tags?.some(testimonialTag => 
        testimonialTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  );

  // Jika ada testimonials relevan, acak dan batasi jumlahnya
  if (relevantTestimonials.length > 0) {
    return shuffleArray(relevantTestimonials).slice(0, 2);
  }
  
  // Jika tidak ada yang relevan, ambil random testimonials
  return shuffleArray(validTestimonials).slice(0, 2);
};