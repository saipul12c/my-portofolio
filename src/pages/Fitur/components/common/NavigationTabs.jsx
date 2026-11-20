import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Radio, Milestone, Sparkles } from 'lucide-react';
import { playTabSwitch } from '../../utils/soundEffects';

const NavigationTabs = ({ activeTab, setActiveTab, currentConfig }) => {
  const isCyan = currentConfig.themeColor === 'cyan';
  const isPurple = currentConfig.themeColor === 'purple';

  const tabs = [
    {
      key: 'main',
      label: 'Ringkasan & Fitur',
      shortLabel: 'Fitur',
      icon: LayoutDashboard,
      badge: 'Utama'
    },
    {
      key: 'community',
      label: currentConfig.pages?.community?.title || 'Komunitas',
      shortLabel: 'Komunitas',
      icon: Users,
      badge: '12.5k'
    },
    {
      key: 'livestream',
      label: currentConfig.pages?.livestream?.title || 'Livestream',
      shortLabel: 'Streaming',
      icon: Radio,
      badge: 'LIVE',
      badgePulse: true
    },
    {
      key: 'roadmap',
      label: 'Roadmap Rilis',
      shortLabel: 'Roadmap',
      icon: Milestone,
      badge: 'Tahap 3'
    },
    {
      key: 'early_access',
      label: 'VIP Early Access',
      shortLabel: 'VIP Pass',
      icon: Sparkles,
      badge: 'Perks',
      highlight: true
    }
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label="Sub-navigation"
      className="flex justify-center mb-8 sm:mb-12 sticky top-20 z-30"
    >
      <div className="bg-[#111c34]/90 backdrop-blur-xl rounded-2xl p-1.5 border border-blue-900/40 shadow-xl w-full max-w-4xl overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-2 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  if (!isActive) {
                    playTabSwitch();
                    setActiveTab(tab.key);
                  }
                }}
                className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 group whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active Sliding Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabDock"
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${
                      isCyan
                        ? 'from-cyan-600 to-blue-600 shadow-cyan-500/25'
                        : isPurple
                        ? 'from-purple-600 via-indigo-600 to-blue-600 shadow-purple-500/25'
                        : 'from-amber-500 to-rose-600 shadow-amber-500/25'
                    } border border-white/20 shadow-lg -z-10`}
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}

                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'text-white'
                    : isCyan ? 'group-hover:text-cyan-400' : 'group-hover:text-amber-400'
                }`} />

                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>

                {/* Badge */}
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                      isActive
                        ? 'bg-black/30 text-white font-semibold'
                        : tab.badgePulse
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-white/5 text-slate-300 border border-white/10'
                    }`}
                  >
                    {tab.badgePulse && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    )}
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default NavigationTabs;
