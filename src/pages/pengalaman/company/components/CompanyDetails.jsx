import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Building2, Zap } from "lucide-react";
import ExpandableSection from "./ExpandableSection";
import { createCompanySlug } from "../utils/companyUtils";
import { containerVariants } from "../animations/variants";

const CompanyDetails = ({ info, expandedSection, toggleSection, relatedCompanies }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Technologies Section */}
      {info.technologies.length > 0 && (
        <ExpandableSection
          title="Teknologi yang Digunakan"
          count={info.technologies.length}
          icon={Zap}
          color="blue"
          isExpanded={expandedSection === "tech"}
          onToggle={() => toggleSection("tech")}
        >
          <div className="flex flex-wrap gap-2">
            {info.technologies.map((tech, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm font-medium border border-blue-500/30"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </ExpandableSection>
      )}

      {/* Projects Section */}
      {info.projects.length > 0 && (
        <ExpandableSection
          title="Proyek yang Dikerjakan"
          count={info.projects.length}
          icon={Building2}
          color="purple"
          isExpanded={expandedSection === "projects"}
          onToggle={() => toggleSection("projects")}
        >
          <ul className="space-y-3">
            {info.projects.map((project, idx) => (
              <motion.li 
                key={idx} 
                className="flex items-start gap-3 text-sm"
                whileHover={{ x: 4 }}
              >
                <span className="text-purple-400 font-bold mt-0.5 flex-shrink-0">•</span>
                <span className="text-gray-300">{project}</span>
              </motion.li>
            ))}
          </ul>
        </ExpandableSection>
      )}

      {/* Locations Section */}
      {info.locations.length > 0 && (
        <ExpandableSection
          title="Lokasi"
          count={info.locations.length}
          icon={MapPin}
          color="green"
          isExpanded={expandedSection === "locations"}
          onToggle={() => toggleSection("locations")}
        >
          <ul className="space-y-3">
            {info.locations.map((location, idx) => (
              <motion.li 
                key={idx} 
                className="flex items-center gap-3 text-sm"
                whileHover={{ x: 4 }}
              >
                <MapPin size={16} className="text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{location}</span>
              </motion.li>
            ))}
          </ul>
        </ExpandableSection>
      )}

      {/* Related Companies */}
      {relatedCompanies.length > 0 && (
        <motion.div
          variants={containerVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4">Perusahaan Terkait</h3>
          <div className="space-y-3">
            {relatedCompanies.map((company, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => navigate(`/testimoni/companies/${createCompanySlug(company.company)}`)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Building2 size={20} className="text-white/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{company.company}</p>
                  <p className="text-xs text-gray-400">Relevansi: {company.relevanceScore}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CompanyDetails;