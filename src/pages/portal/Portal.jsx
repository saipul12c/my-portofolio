import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// UI Components
import Avatar from './ui/Avatar';
import MobilePlatformCard from './ui/MobilePlatformCard';
import DesktopPlatformCard from './ui/DesktopPlatformCard';

// Layout Components
import MobileLayout from './components/MobileLayout';
import DesktopLayout from './components/DesktopLayout';

// Modules
import { platformData as platformDataModule, initialCheckedItems, statsData } from './modules/platformData';
import { addStyles } from './modules/styles';

// Komponen utama dengan desain berbeda untuk mobile/desktop
const SocialPortal = () => {
  const navigate = useNavigate();
  const [checkedItems] = useState(initialCheckedItems);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('social');
  const [stats] = useState(statsData);
  const [showInfo, setShowInfo] = useState(false);

  // Platform data dengan useMemo untuk performa
  const platformData = useMemo(() => platformDataModule, []);

  // Deteksi perangkat
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    const resizeHandler = () => {
      requestAnimationFrame(checkMobile);
    };
    
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  const handleCopyEmail = useCallback(() => {
    const email = 'hello@yourworld.com';
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Your World Social Links',
        text: 'Check out my social media profiles!',
        url: window.location.href
      });
    }
  }, []);

  // Mobile Layout
  const renderMobileLayout = () => (
    <MobileLayout
      platformData={platformData}
      checkedItems={checkedItems}
      handleCopyEmail={handleCopyEmail}
      handleShare={handleShare}
      copied={copied}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      stats={stats}
    />
  );

  // Desktop Layout
  const renderDesktopLayout = () => (
    <DesktopLayout
      platformData={platformData}
      checkedItems={checkedItems}
      handleCopyEmail={handleCopyEmail}
      handleShare={handleShare}
      copied={copied}
      navigate={navigate}
      stats={stats}
      showInfo={showInfo}
      setShowInfo={setShowInfo}
    />
  );

  return isMobile ? renderMobileLayout() : renderDesktopLayout();
};

// Panggil fungsi untuk menambahkan styles
addStyles();

export default memo(SocialPortal);