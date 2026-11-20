import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet';

// Hooks
import useCountdown from './hooks/useCountdown';
import useConfig from './config/useConfig';

// Components
import BackgroundEffects from './components/common/BackgroundEffects';
import ConfigSelector from './components/common/ConfigSelector';
import NavigationTabs from './components/common/NavigationTabs';
import ContactInfo from './components/common/ContactInfo';
import MainContent from './components/pages/MainContent';
import CommunityPage from './components/pages/CommunityPage';
import LivestreamPage from './components/pages/LivestreamPage';
import RoadmapPage from './components/pages/RoadmapPage';
import EarlyAccessPage from './components/pages/EarlyAccessPage';

const ComingSoon = () => {
  const { currentConfig, handleConfigChange, configList } = useConfig();
  const [activeTab, setActiveTab] = useState('main');
  const [email, setEmail] = useState('');

  const launchDate = new Date(currentConfig.launchDate).getTime();
  const { years, days, hours, minutes, seconds } = useCountdown(launchDate);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription submitted for:', email);
    setEmail('');
  };

  const isCyan = currentConfig.themeColor === 'cyan';
  const isPurple = currentConfig.themeColor === 'purple';
  const brandGradient = isCyan
    ? 'from-cyan-400 via-sky-300 to-blue-500'
    : isPurple
    ? 'from-purple-400 via-indigo-300 to-blue-500'
    : 'from-amber-400 via-orange-400 to-rose-500';

  const renderContent = () => {
    switch (activeTab) {
      case 'community':
        return <CommunityPage currentConfig={currentConfig} />;
      case 'livestream':
        return <LivestreamPage currentConfig={currentConfig} />;
      case 'roadmap':
        return <RoadmapPage currentConfig={currentConfig} />;
      case 'early_access':
        return <EarlyAccessPage currentConfig={currentConfig} />;
      case 'main':
      default:
        return (
          <MainContent
            currentConfig={currentConfig}
            years={years}
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
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col px-4 sm:px-6 md:px-10 lg:px-16 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200 pt-6 pb-16 sm:pb-20">
      <Helmet>
        <title>{`${currentConfig.brand.name} | Coming Soon 2030`}</title>
        <meta
          name="description"
          content={currentConfig.brand.tagline || currentConfig.brand.slogan}
        />
      </Helmet>

      {/* Dynamic Cosmic Background */}
      <BackgroundEffects themeColor={currentConfig.themeColor} />

      <div className="max-w-5xl mx-auto w-full relative z-10 flex-1 flex flex-col">
        {/* In-page Controls (Project Switcher, Audio, Share) */}
        <ConfigSelector
          configList={configList}
          currentConfig={currentConfig}
          handleConfigChange={(id) => {
            handleConfigChange(id);
          }}
        />

        {/* Hero Brand Title Section */}
        <motion.div
          key={`brand-${currentConfig.id}`}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md mb-4 shadow-sm">
            <Sparkles className={`w-3.5 h-3.5 ${isCyan ? 'text-cyan-400' : isPurple ? 'text-purple-400' : 'text-amber-400'}`} />
            <span className="text-[11px] font-mono tracking-wider text-cyan-300 uppercase font-semibold">
              NEXT-GEN RELEASE IN DEVELOPMENT
            </span>
          </div>

          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r ${brandGradient} bg-clip-text text-transparent tracking-tight drop-shadow-sm`}>
            {currentConfig.brand.name}
          </h1>

          <p className="text-slate-300 mt-3 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal">
            {currentConfig.brand.tagline || currentConfig.brand.slogan}
          </p>
        </motion.div>

        {/* Floating Navigation Dock */}
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentConfig={currentConfig}
        />

        {/* Tab Content Display with Smooth Fade Transition */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentConfig.id}-${activeTab}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Contact Information */}
        {currentConfig.contact && (
          <ContactInfo currentConfig={currentConfig} />
        )}
      </div>
    </div>
  );
};

export default ComingSoon;
