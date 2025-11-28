import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, FileText } from 'lucide-react';
import SectionWrapper from '../UI/SectionWrapper';
import { additionalInfo } from '../../data/localData';

const iconMap = {
  Award: Award,
  Users: Users,
  FileText: FileText
};

const AdditionalInfo = () => (
  <SectionWrapper>
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
      Additional Information
    </h2>
    <div className="space-y-4">
      {additionalInfo.map((info, index) => {
        const IconComponent = iconMap[info.icon];
        const content = (
          <div className="flex items-center text-gray-300 p-3 bg-white/5 rounded-xl border border-blue-900/40 hover:border-cyan-400/30 transition-all hover:text-cyan-300">
            <IconComponent className="w-5 h-5 text-cyan-400 mr-3" />
            <span className="text-sm">{info.text}</span>
          </div>
        );

        return info.link ? (
          <Link key={index} to={info.link}>
            {content}
          </Link>
        ) : (
          <div key={index}>
            {content}
          </div>
        );
      })}
    </div>
  </SectionWrapper>
);

export default AdditionalInfo;