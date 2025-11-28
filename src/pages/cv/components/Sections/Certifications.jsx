import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import SectionWrapper from '../UI/SectionWrapper';

const Certifications = ({ certificates }) => (
  <SectionWrapper>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        Certifications
      </h2>
      <Link 
        to="/certificates"
        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 transition-colors"
      >
        View All →
      </Link>
    </div>
    <div className="space-y-4">
      {certificates.slice(0, 3).map((cert, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-blue-900/40 hover:border-cyan-400/30 transition-all">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm">{cert.title}</h3>
              <p className="text-gray-300 text-xs mt-1">{cert.issuer}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-xs">{cert.year}</span>
                <span className="text-cyan-400 text-xs font-medium bg-cyan-500/20 px-2 py-1 rounded-full">
                  {cert.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default Certifications;