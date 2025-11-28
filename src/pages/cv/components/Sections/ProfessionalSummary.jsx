import React from 'react';
import SectionWrapper from '../UI/SectionWrapper';

const ProfessionalSummary = () => (
  <SectionWrapper>
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
      Professional Summary
    </h2>
    <p className="text-gray-300 leading-relaxed text-lg">
      Experienced Full Stack Developer and EduTech Specialist with 3+ years of expertise in building 
      modern web applications, educational platforms, and digital learning solutions. Proven track 
      record in developing interactive learning experiences, AI-powered educational tools, and 
      scalable EdTech platforms. Passionate about creating digital products that make real impact 
      in education and empower learners through technology.
    </p>
  </SectionWrapper>
);

export default ProfessionalSummary;