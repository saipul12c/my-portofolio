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
import { useProfileData } from '../owner/hooks/useProfileData';
import CertificateModal from '../sertif/components/CertificateModal';

// Komponen utama dengan desain berbeda untuk mobile/desktop
const SocialPortal = () => {
  const navigate = useNavigate();
  const [checkedItems] = useState(initialCheckedItems);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');
  const [stats] = useState(statsData);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  // Load profile data (certificates, etc.)
  const { certificates, projects, softSkills, testimonials } = useProfileData();

  // Helper for stars rating (for the modal)
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < full; i++)
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    return stars;
  };

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
      certificates={certificates}
      openCertModal={(cert) => setSelectedCert(cert)}
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
      certificates={certificates}
      openCertModal={(cert) => setSelectedCert(cert)}
    />
  );

  return (
    <>
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
      
      {/* Certificate Detail Modal */}
      <CertificateModal
        selected={selectedCert}
        closePopup={() => setSelectedCert(null)}
        tagColors={["bg-cyan-500/20 text-cyan-300", "bg-purple-500/20 text-purple-300", "bg-emerald-500/20 text-emerald-300"]}
        skills={softSkills}
        projects={projects}
        testimonials={testimonials}
        renderStars={renderStars}
      />
    </>
  );
};

// Panggil fungsi untuk menambahkan styles
addStyles();

export default memo(SocialPortal);