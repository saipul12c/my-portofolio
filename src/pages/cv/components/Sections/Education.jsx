import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import SectionWrapper from '../UI/SectionWrapper';
import { educations } from '../../data/localData';

const Education = () => (
  <SectionWrapper>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        Education
      </h2>
      <Link 
        to="/education"
        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 transition-colors"
      >
        Details →
      </Link>
    </div>
    <div className="space-y-4">
      {educations.map((edu, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-blue-900/40">
          <h3 className="font-semibold text-white text-lg">{edu.degree}</h3>
          <p className="text-cyan-400 text-sm mt-1">{edu.institution}</p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {edu.period}
            </span>
            {edu.gpa && (
              <span className="text-cyan-400 text-sm font-medium bg-cyan-500/20 px-2 py-1 rounded-full">
                GPA: {edu.gpa}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default Education;