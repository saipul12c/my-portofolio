import React from 'react';
import { Calendar } from 'lucide-react';
import SectionWrapper from '../UI/SectionWrapper';
import { experiences } from '../../data/localData';

const WorkExperience = () => (
  <SectionWrapper>
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
      Work Experience
    </h2>
    <div className="space-y-8">
      {experiences.map((exp, index) => (
        <div key={index} className="relative pl-8 border-l-2 border-cyan-500/50">
          <div className="absolute -left-2 top-0 w-4 h-4 bg-cyan-500 rounded-full border-4 border-[#0f172a]"></div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-1">{exp.position}</h3>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-cyan-400 font-medium">{exp.company}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {exp.period}
              </span>
            </div>
          </div>
          <ul className="space-y-3">
            {exp.achievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start text-gray-300">
                <span className="text-cyan-400 mr-3 mt-1">✓</span>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default WorkExperience;