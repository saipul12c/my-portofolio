import React from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper from '../UI/SectionWrapper';

const TechnicalSkills = ({ skills }) => (
  <SectionWrapper>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        Technical Skills
      </h2>
      <Link 
        to="/SoftSkills"
        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 transition-colors"
      >
        Details →
      </Link>
    </div>
    <div className="space-y-4">
      {skills.map((skill, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-200 font-medium flex items-center gap-2">
              {skill.icon} {skill.name}
            </span>
            <span className="text-gray-400 text-sm">{skill.level}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default TechnicalSkills;