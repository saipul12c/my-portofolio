import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionWrapper from '../UI/SectionWrapper';

const FeaturedProjects = ({ projects }) => (
  <SectionWrapper>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        Featured Projects
      </h2>
      <Link 
        to="/projects"
        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 transition-colors"
      >
        View All Projects →
      </Link>
    </div>
    <div className="grid gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-blue-900/40 hover:border-cyan-400/30 transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center bg-yellow-500/20 text-yellow-300 text-sm px-3 py-1 rounded-full">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {project.rating}
            </div>
          </div>
          <p className="text-gray-300 mb-4">{project.description}</p>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-200 mb-3">Technologies Used:</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, idx) => (
                <span key={idx} className="bg-cyan-500/20 text-cyan-300 text-sm px-3 py-1 rounded-full border border-cyan-500/30">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-200 mb-3">Key Features:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-300 text-sm">
                  <span className="text-cyan-400 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  </SectionWrapper>
);

export default FeaturedProjects;