import React, { useState } from 'react';
import { motion } from "framer-motion";

// Hooks
import useCountdown from './hooks/useCountdown';
import useConfig from './config/useConfig';

// Components
import BackgroundEffects from './components/common/BackgroundEffects';
import ConfigSelector from './components/common/ConfigSelector';
import NavigationTabs from './components/common/NavigationTabs';
import ContactInfo from './components/common/ContactInfo';
import SocialLinks from './components/common/SocialLinks';
import MainContent from './components/pages/MainContent';
import CommunityPage from './components/pages/CommunityPage';
import LivestreamPage from './components/pages/LivestreamPage';

const ComingSoon = () => {
  const { currentConfig, handleConfigChange, configList } = useConfig();
  const [activeTab, setActiveTab] = useState('main');
  const [email, setEmail] = useState('');

  const launchDate = new Date(currentConfig.launchDate).getTime();
  const { days, hours, minutes, seconds } = useCountdown(launchDate);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'community':
        return <CommunityPage currentConfig={currentConfig} />;
      case 'livestream':
        return <LivestreamPage currentConfig={currentConfig} />;
      default:
        return (
          <MainContent
            currentConfig={currentConfig}
            days={days}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            email={email}
            setEmail={setEmail}
            handleNewsletterSubmit={handleNewsletterSubmit}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col px-6 sm:px-10 md:px-20 relative overflow-hidden py-20">
      <BackgroundEffects />

      <div className="max-w-6xl mx-auto w-full">
        <ConfigSelector
          configList={configList}
          currentConfig={currentConfig}
          handleConfigChange={handleConfigChange}
        />

        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-red-400 to-purple-500 bg-clip-text text-transparent">
            {currentConfig.brand.name}
          </h1>
          <p className="text-gray-400 mt-2 text-lg">{currentConfig.brand.slogan}</p>
        </motion.div>

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentConfig={currentConfig}
        />

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderContent()}
        </motion.div>

        {/* Contact Information */}
        {currentConfig.contact && (
          <ContactInfo currentConfig={currentConfig} />
        )}

        {/* Social Links */}
        <SocialLinks currentConfig={currentConfig} />
      </div>
    </div>
  );
};

export default ComingSoon;