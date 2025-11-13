import { m, AnimatePresence } from "framer-motion";
import { 
  X, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Star,
  Zap,
  Rocket,
  Code,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState, useEffect } from "react";
import { findRelatedSkills, findRelatedProjects, findRelatedTestimonials } from "../utils/relatedDataUtils";

const CertificateModal = ({
  selected,
  tagColors,
  skills,
  projects,
  testimonials,
  closePopup,
  handleSkillClick,
  handleProjectClick,
  handleTestimonialClick,
  renderStars
}) => {
  // Semua React Hook harus dipanggil di awal, sebelum conditional return
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset active section when modal opens
  useEffect(() => {
    if (isMobile && selected) {
      setActiveSection('details');
    }
  }, [isMobile, selected]);

  // Conditional return harus setelah semua hook
  if (!selected) return null;

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const relatedSkills = findRelatedSkills(selected.tags, skills);
  const relatedProjects = findRelatedProjects(selected.tags, projects);
  const relatedTestimonials = findRelatedTestimonials(selected.tags, testimonials);

  const sectionContent = {
    details: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <Clock size={16} className="text-cyan-400 flex-shrink-0" />
          <span>{selected.duration}</span>
          <span>•</span>
          <span className="capitalize">{selected.difficulty}</span>
          {selected.verified && (
            <>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={16} /> Verified
              </span>
            </>
          )}
        </div>

        {selected.rating && (
          <div className="flex items-center gap-2">
            {renderStars(selected.rating)}
            <span className="text-sm text-gray-400">
              ({selected.rating})
            </span>
          </div>
        )}

        <p className="text-gray-200 leading-relaxed">
          {selected.description || "Tidak ada deskripsi."}
        </p>

        <div className="flex gap-2 flex-wrap">
          {selected.tags?.map((tag, i) => (
            <span
              key={`${tag}-${selected.id}-${i}`}
              className={`px-3 py-1 text-xs rounded-full border border-white/10 ${
                tagColors[(i + selected.id) % tagColors.length] || 
                "bg-cyan-500/20 text-cyan-300"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={selected.urlCertificate}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-cyan-600 hover:bg-cyan-700 transition-all rounded-xl py-3 font-semibold text-white text-center flex items-center justify-center gap-2 mt-4"
        >
          <ExternalLink size={18} />
          Lihat Sertifikat Lengkap
        </a>
      </div>
    ),
    skills: (
      <div className="space-y-3">
        {relatedSkills.length > 0 ? (
          relatedSkills.map((skill) => (
            skill?.id && skill?.name && (
              <m.div
                key={skill.id}
                className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-cyan-400/30"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSkillClick(skill.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-white line-clamp-1">
                    {skill.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {skill.level || "Mahir"}
                  </span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </div>
              </m.div>
            )
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            <Code className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm">Tidak ada skills terkait yang ditemukan</p>
          </div>
        )}
      </div>
    ),
    projects: (
      <div className="space-y-3">
        {relatedProjects.length > 0 ? (
          relatedProjects.map((project) => (
            project?.id && project?.title && (
              <m.div
                key={project.id}
                className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-purple-400/30"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={project.image || "/placeholder.jpg"}
                    alt={project.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                      {project.overview || project.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-cyan-400">
                        {project.category || "Web App"}
                      </span>
                      <ArrowRight className="w-3 h-3 text-purple-400" />
                    </div>
                  </div>
                </div>
              </m.div>
            )
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            <Rocket className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm">Tidak ada proyek terkait yang ditemukan</p>
          </div>
        )}
      </div>
    ),
    testimonials: (
      <div className="space-y-3">
        {relatedTestimonials.length > 0 ? (
          relatedTestimonials.map((testimonial) => (
            testimonial?.id && testimonial?.text && (
              <m.div
                key={testimonial.id}
                className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-green-400/30"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleTestimonialClick(testimonial.id)}
              >
                <p className="text-sm text-gray-200 line-clamp-3">"{testimonial.text}"</p>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={testimonial.image || "/placeholder.jpg"}
                    alt={testimonial.name}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-cyan-400 block">{testimonial.name}</span>
                    <span className="text-xs text-gray-500 block">{testimonial.role}</span>
                  </div>
                  {testimonial.rating && (
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  )}
                  <ArrowRight className="w-3 h-3 text-green-400 flex-shrink-0" />
                </div>
              </m.div>
            )
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            <MessageCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm">Tidak ada testimoni terkait yang ditemukan</p>
          </div>
        )}
      </div>
    )
  };

  // Mobile Accordion View
  if (isMobile) {
    return (
      <AnimatePresence>
        {selected && (
          <>
            <m.div
              className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
            />
            <m.div
              className="fixed inset-x-0 bottom-0 lg:inset-auto z-50 flex items-end lg:items-center justify-center lg:inset-0 lg:p-4"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="bg-[#1e293b] border border-white/10 rounded-t-3xl lg:rounded-2xl shadow-2xl w-full lg:w-[95vw] lg:max-w-[1200px] max-h-[95vh] lg:max-h-[90vh] overflow-hidden flex flex-col relative"
                style={{
                  borderColor: selected.themeColor,
                  boxShadow: `0 0 40px -5px ${selected.themeColor || '#22d3ee'}60`,
                }}
              >
                {/* Close Button */}
                <button
                  onClick={closePopup}
                  className="absolute top-4 right-4 z-10 bg-black/40 rounded-full p-2 hover:bg-black/60 transition text-gray-300 hover:text-white"
                >
                  <X size={20} />
                </button>

                {/* Header Image */}
                <div className="p-4 lg:p-6">
                  <img
                    src={selected.image || "/placeholder.jpg"}
                    alt={selected.title}
                    className="w-full h-48 lg:h-64 object-cover rounded-xl"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-6">
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">
                    {selected.title}
                  </h2>
                  <p className="text-cyan-300 text-sm mb-4">
                    {selected.issuer} · {selected.year}
                  </p>

                  {/* Mobile Accordion Sections */}
                  <div className="space-y-2">
                    {/* Details Section */}
                    <div className="border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection('details')}
                        className="w-full px-4 py-3 bg-white/5 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold text-white">Detail Sertifikat</span>
                        </div>
                        {activeSection === 'details' ? 
                          <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      {activeSection === 'details' && (
                        <div className="px-4 py-3 border-t border-white/10">
                          {sectionContent.details}
                        </div>
                      )}
                    </div>

                    {/* Skills Section */}
                    <div className="border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection('skills')}
                        className="w-full px-4 py-3 bg-white/5 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-white">Skills Terkait</span>
                          {relatedSkills.length > 0 && (
                            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs">
                              {relatedSkills.length}
                            </span>
                          )}
                        </div>
                        {activeSection === 'skills' ? 
                          <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      {activeSection === 'skills' && (
                        <div className="px-4 py-3 border-t border-white/10">
                          {sectionContent.skills}
                        </div>
                      )}
                    </div>

                    {/* Projects Section */}
                    <div className="border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection('projects')}
                        className="w-full px-4 py-3 bg-white/5 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Rocket className="w-4 h-4 text-purple-400" />
                          <span className="font-semibold text-white">Proyek Terkait</span>
                          {relatedProjects.length > 0 && (
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                              {relatedProjects.length}
                            </span>
                          )}
                        </div>
                        {activeSection === 'projects' ? 
                          <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      {activeSection === 'projects' && (
                        <div className="px-4 py-3 border-t border-white/10">
                          {sectionContent.projects}
                        </div>
                      )}
                    </div>

                    {/* Testimonials Section */}
                    <div className="border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection('testimonials')}
                        className="w-full px-4 py-3 bg-white/5 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-green-400" />
                          <span className="font-semibold text-white">Testimoni Terkait</span>
                          {relatedTestimonials.length > 0 && (
                            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                              {relatedTestimonials.length}
                            </span>
                          )}
                        </div>
                        {activeSection === 'testimonials' ? 
                          <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      {activeSection === 'testimonials' && (
                        <div className="px-4 py-3 border-t border-white/10">
                          {sectionContent.testimonials}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Layout
  return (
    <AnimatePresence>
      {selected && (
        <>
          <m.div
            className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          />
          <m.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-[95vw] max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col relative"
              style={{
                borderColor: selected.themeColor,
                boxShadow: `0 0 40px -5px ${selected.themeColor || '#22d3ee'}60`,
              }}
            >
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-10 bg-black/40 rounded-full p-2 hover:bg-black/60 transition text-gray-300 hover:text-white"
              >
                <X size={20} />
              </button>

              {/* Content Container */}
              <div className="flex flex-col lg:flex-row max-h-[90vh]">
                {/* Left Column - Certificate Image & Details */}
                <div className="lg:w-2/5 p-4 lg:p-6 flex flex-col">
                  <img
                    src={selected.image || "/placeholder.jpg"}
                    alt={selected.title}
                    className="w-full h-48 lg:h-64 xl:h-80 object-cover rounded-xl mb-4 flex-shrink-0"
                  />
                  
                  <div className="flex-1 overflow-y-auto">
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">
                      {selected.title}
                    </h2>
                    <p className="text-cyan-300 text-sm mb-4">
                      {selected.issuer} · {selected.year}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-gray-300 mb-4 flex-wrap">
                      <Clock size={16} className="text-cyan-400 flex-shrink-0" />
                      <span>{selected.duration}</span>
                      <span>•</span>
                      <span className="capitalize">{selected.difficulty}</span>
                      {selected.verified && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <ShieldCheck size={16} /> Verified
                          </span>
                        </>
                      )}
                    </div>

                    {selected.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        {renderStars(selected.rating)}
                        <span className="text-sm text-gray-400">
                          ({selected.rating})
                        </span>
                      </div>
                    )}

                    <p className="text-gray-200 leading-relaxed mb-4 text-sm lg:text-base">
                      {selected.description || "Tidak ada deskripsi."}
                    </p>

                    <div className="flex gap-2 flex-wrap mb-6">
                      {selected.tags?.map((tag, i) => (
                        <span
                          key={`${tag}-${selected.id}-${i}`}
                          className={`px-3 py-1 text-xs rounded-full border border-white/10 ${
                            tagColors[(i + selected.id) % tagColors.length] || 
                            "bg-cyan-500/20 text-cyan-300"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={selected.urlCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-cyan-600 hover:bg-cyan-700 transition-all rounded-xl py-3 font-semibold text-white text-center flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Lihat Sertifikat Lengkap
                    </a>
                  </div>
                </div>

                {/* Right Column - Related Content */}
                <div className="lg:w-3/5 bg-[#0f172a] p-4 lg:p-6 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-6 lg:space-y-8">
                    {/* Related Skills Section */}
                    {relatedSkills.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-2 mb-3 lg:mb-4">
                          <Zap className="w-5 h-5 text-amber-400" />
                          <h3 className="text-lg font-bold text-white">Skills Terkait</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {relatedSkills.map((skill) => (
                            skill?.id && skill?.name && (
                              <m.div
                                key={skill.id}
                                className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-cyan-400/30"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleSkillClick(skill.id)}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Code className="w-4 h-4 text-cyan-400" />
                                  <span className="text-sm font-medium text-white line-clamp-1">
                                    {skill.name}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">
                                    {skill.level || "Mahir"}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                                </div>
                              </m.div>
                            )
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-4">
                        <Code className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm">Tidak ada skills terkait yang ditemukan</p>
                      </div>
                    )}

                    {/* Related Projects Section */}
                    {relatedProjects.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-2 mb-3 lg:mb-4">
                          <Rocket className="w-5 h-5 text-purple-400" />
                          <h3 className="text-lg font-bold text-white">Proyek Terkait</h3>
                        </div>
                        <div className="space-y-3">
                          {relatedProjects.map((project) => (
                            project?.id && project?.title && (
                              <m.div
                                key={project.id}
                                className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-purple-400/30"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleProjectClick(project.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <img
                                    src={project.image || "/placeholder.jpg"}
                                    alt={project.title}
                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-white line-clamp-1">
                                      {project.title}
                                    </h4>
                                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                      {project.overview || project.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-cyan-400">
                                        {project.category || "Web App"}
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-purple-400" />
                                    </div>
                                  </div>
                                </div>
                              </m.div>
                            )
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-4">
                        <Rocket className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm">Tidak ada proyek terkait yang ditemukan</p>
                      </div>
                    )}

                    {/* Related Testimonials Section */}
                    {relatedTestimonials.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-2 mb-3 lg:mb-4">
                          <MessageCircle className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold text-white">Testimoni Terkait</h3>
                        </div>
                        <div className="space-y-3">
                          {relatedTestimonials.map((testimonial) => (
                            testimonial?.id && testimonial?.text && (
                              <m.div
                                key={testimonial.id}
                                className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-green-400/30"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleTestimonialClick(testimonial.id)}
                              >
                                <p className="text-sm text-gray-200 line-clamp-3">"{testimonial.text}"</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <img
                                    src={testimonial.image || "/placeholder.jpg"}
                                    alt={testimonial.name}
                                    className="w-6 h-6 rounded-full flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-xs text-cyan-400 block">{testimonial.name}</span>
                                    <span className="text-xs text-gray-500 block">{testimonial.role}</span>
                                  </div>
                                  {testimonial.rating && (
                                    <div className="flex items-center gap-1">
                                      {renderStars(testimonial.rating)}
                                    </div>
                                  )}
                                  <ArrowRight className="w-3 h-3 text-green-400 flex-shrink-0" />
                                </div>
                              </m.div>
                            )
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-4">
                        <MessageCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm">Tidak ada testimoni terkait yang ditemukan</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;