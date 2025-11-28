import React from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper from '../UI/SectionWrapper';
import { languages } from '../../data/localData';

const Languages = () => (
  <SectionWrapper>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        Languages
      </h2>
      <Link 
        to="/bahasa"
        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 transition-colors"
      >
        Details →
      </Link>
    </div>
    <div className="space-y-4">
      {languages.map((lang, index) => (
        <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-blue-900/40">
          <div>
            <div className="font-semibold text-white">{lang.language}</div>
            <div className="text-gray-400 text-sm">{lang.proficiency}</div>
          </div>
          <div className="text-right">
            <div className="w-20 bg-gray-700/50 rounded-full h-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full"
                style={{ width: `${lang.level}%` }}
              ></div>
            </div>
            <div className="text-gray-400 text-xs mt-1">{lang.level}%</div>
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default Languages;