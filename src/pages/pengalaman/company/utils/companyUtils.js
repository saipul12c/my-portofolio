import testimonialsData from "../../../../data/testimoni/testimonials.json";

export const createCompanySlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export const processCompanyData = (testimonials) => {
  const firstTestimonial = testimonials[0];
  const totalTestimonials = testimonials.length;
  const avgRating = (
    testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / totalTestimonials
  ).toFixed(1);

  const technologiesSet = new Set();
  const locationsSet = new Set();
  const projectsSet = new Set();
  const budgetRanges = [];
  let totalTeamMembers = 0;
  let totalProjectDuration = 0;

  testimonials.forEach((t) => {
    if (t.technologies_used) {
      t.technologies_used.forEach((tech) => technologiesSet.add(tech));
    }
    if (t.location) locationsSet.add(t.location);
    if (t.project) projectsSet.add(t.project);
    if (t.budget_range) budgetRanges.push(t.budget_range);
    if (t.team_size) totalTeamMembers += t.team_size;
    if (t.project_duration) {
      const duration = parseInt(t.project_duration) || 0;
      totalProjectDuration += duration;
    }
  });

  const avgBudget = budgetRanges.length > 0 
    ? budgetRanges[Math.floor(budgetRanges.length / 2)] 
    : "Tidak tersedia";

  const avgProjectDuration = totalProjectDuration > 0 
    ? Math.round(totalProjectDuration / testimonials.length) 
    : 0;

  return {
    name: firstTestimonial.company,
    location: firstTestimonial.location,
    totalTestimonials,
    avgRating,
    technologies: Array.from(technologiesSet),
    locations: Array.from(locationsSet),
    projects: Array.from(projectsSet),
    totalTeamMembers: Math.ceil(totalTeamMembers / totalTestimonials),
    avgBudget,
    avgProjectDuration,
    budgetRanges
  };
};

export const generateAnalytics = (testimonials) => {
  const totalRevenue = testimonials.reduce((sum, t) => {
    const budget = t.budget_range ? parseInt(t.budget_range.replace(/[^\d]/g, '')) || 0 : 0;
    return sum + budget;
  }, 0);

  const successRate = testimonials.reduce((sum, t) => {
    const rating = t.rating || 0;
    return sum + (rating >= 4 ? 1 : 0);
  }, 0) / testimonials.length * 100;

  return {
    totalRevenue,
    successRate,
    clientSatisfaction: testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length,
    projectCompletion: testimonials.filter(t => t.follow_up?.status === 'completed').length / testimonials.length * 100
  };
};

export const generateCompanyTimeline = (testimonials) => {
  return testimonials
    .map(t => ({
      date: t.date,
      event: t.project,
      description: t.highlight,
      type: 'project'
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const generateTeamMembers = (testimonials) => {
  const uniqueMembers = new Map();
  
  testimonials.forEach(t => {
    if (!uniqueMembers.has(t.name)) {
      uniqueMembers.set(t.name, {
        name: t.name,
        role: t.role,
        image: t.image,
        projects: 1,
        technologies: t.technologies_used || []
      });
    } else {
      const member = uniqueMembers.get(t.name);
      member.projects += 1;
    }
  });

  return Array.from(uniqueMembers.values());
};

export const generatePortfolio = (testimonials) => {
  return testimonials.map(t => ({
    id: t.id,
    title: t.title,
    description: t.text,
    image: t.image,
    technologies: t.technologies_used,
    budget: t.budget_range,
    duration: t.project_duration,
    rating: t.rating
  }));
};

export const findRelatedCompanies = (currentCompany) => {
  const currentTech = new Set();
  testimonialsData
    .filter(t => t.company === currentCompany)
    .forEach(t => {
      if (t.technologies_used) {
        t.technologies_used.forEach(tech => currentTech.add(tech));
      }
    });

  const related = testimonialsData
    .filter(t => t.company !== currentCompany)
    .map(t => {
      let score = 0;
      if (t.technologies_used) {
        t.technologies_used.forEach(tech => {
          if (currentTech.has(tech)) score++;
        });
      }
      return { ...t, relevanceScore: score };
    })
    .filter(t => t.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 4);

  return related;
};