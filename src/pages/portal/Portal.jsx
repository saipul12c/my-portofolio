import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Layout Components
import MobileLayout from './components/MobileLayout';
import DesktopLayout from './components/DesktopLayout';

// Modules & Data
import { platformData, initialCheckedItems, statsData, addStyles } from './modules';
import { useProfileData } from '../owner/hooks/useProfileData';
import CertificateModal from '../sertif/components/CertificateModal';

const CERT_TAG_COLORS = [
  "bg-cyan-500/20 text-cyan-300",
  "bg-purple-500/20 text-purple-300",
  "bg-emerald-500/20 text-emerald-300"
];

// Helper for stars rating
const renderStars = (rating) => {
  if (!rating) return null;
  const full = Math.floor(rating);
  return Array.from({ length: full }, (_, i) => (
    <span key={i} className="text-yellow-400">★</span>
  ));
};

const SocialPortal = () => {
  const navigate = useNavigate();
  const [checkedItems] = useState(initialCheckedItems);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');
  const [stats] = useState(statsData);
  const [selectedCert, setSelectedCert] = useState(null);

  // Initialize isMobile directly so mobile devices don't mount DesktopLayout initially
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Load profile data (certificates, softskills, etc.)
  const { certificates, projects, softSkills, testimonials } = useProfileData();

  // Load custom portal styles once on mount
  useEffect(() => {
    addStyles();
  }, []);

  // Resize listener with RAF debounce
  useEffect(() => {
    let rId;
    const checkMobile = () => {
      cancelAnimationFrame(rId);
      rId = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
      });
    };

    window.addEventListener('resize', checkMobile, { passive: true });
    return () => {
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(rId);
    };
  }, []);

  const handleCopyEmail = useCallback(() => {
    const email = 'uju355@gmail.com';
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, []);

  const handleShare = useCallback(() => {
    if (navigator?.share) {
      navigator.share({
        title: 'Muhammad Syaiful Mukmin - Portal Profile',
        text: 'Kunjungi portal profil dan media sosial Muhammad Syaiful Mukmin!',
        url: window.location.href
      }).catch(() => {});
    } else if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, []);

  const openCertModal = useCallback((cert) => {
    setSelectedCert(cert);
  }, []);

  const closeCertModal = useCallback(() => {
    setSelectedCert(null);
  }, []);

  return (
    <>
      {isMobile ? (
        <MobileLayout
          platformData={platformData}
          handleCopyEmail={handleCopyEmail}
          handleShare={handleShare}
          copied={copied}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
          certificates={certificates}
          projects={projects}
          openCertModal={openCertModal}
        />
      ) : (
        <DesktopLayout
          platformData={platformData}
          checkedItems={checkedItems}
          handleCopyEmail={handleCopyEmail}
          handleShare={handleShare}
          copied={copied}
          navigate={navigate}
          stats={stats}
          certificates={certificates}
          openCertModal={openCertModal}
        />
      )}

      {/* Certificate Detail Modal */}
      <CertificateModal
        selected={selectedCert}
        closePopup={closeCertModal}
        tagColors={CERT_TAG_COLORS}
        skills={softSkills}
        projects={projects}
        testimonials={testimonials}
        renderStars={renderStars}
      />
    </>
  );
};

export default memo(SocialPortal);
