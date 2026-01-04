import { FaInstagram, FaFacebookF, FaTwitter, FaGlobe, FaTiktok, FaYoutube, FaLinkedin, FaWhatsapp, FaTelegram, FaDiscord } from 'react-icons/fa';

export const platformData = {
  instagram: { 
    icon: FaInstagram, 
    color: { bg: 'bg-gradient-to-r from-purple-600 to-pink-600', border: 'border-purple-500' },
    username: '@saipul16_',
    url: 'https://instagram.com/saipul16_'
  },
  facebook: { 
    icon: FaFacebookF, 
    color: { bg: 'bg-blue-600', border: 'border-blue-500' },
    username: '@saipul16_',
    url: 'https://facebook.com/saipul16_'
  },
  twitter: { 
    icon: FaTwitter, 
    color: { bg: 'bg-sky-500', border: 'border-sky-400' },
    username: '@saipul16_',
    url: 'https://twitter.com/saipul16_'
  },
  tiktok: { 
    icon: FaTiktok, 
    color: { bg: 'bg-gray-900', border: 'border-gray-700' },
    username: '@IsMe',
    url: 'https://www.tiktok.com/IsMe'
  },
  youtube: { 
    icon: FaYoutube, 
    color: { bg: 'bg-red-600', border: 'border-red-500' },
    username: '@saipul16_',
    url: 'https://youtube.com/@saipul16_'
  },
  linkedin: { 
    icon: FaLinkedin, 
    color: { bg: 'bg-blue-700', border: 'border-blue-600' },
    username: '@saipul16_',
    url: 'https://linkedin.com/in/saipul16_'
  },
  whatsapp: { 
    icon: FaWhatsapp, 
    color: { bg: 'bg-green-600', border: 'border-green-500' },
    username: 'comingson',
    url: null
  },
  telegram: { 
    icon: FaTelegram, 
    color: { bg: 'bg-blue-500', border: 'border-blue-400' },
    username: '@saipul16_',
    url: 'https://t.me/saipul16_'
  },
  discord: { 
    icon: FaDiscord, 
    color: { bg: 'bg-indigo-600', border: 'border-indigo-500' },
    username: 'saipul16_#1234',
    url: null
  },
  website: { 
    icon: FaGlobe, 
    color: { bg: 'bg-gradient-to-r from-cyan-600 to-blue-600', border: 'border-cyan-500' },
    username: 'syaiful-mukmin.netlify.app',
    url: '/'
  }
};

export const initialCheckedItems = {
  instagram: false,
  facebook: true,
  twitter: false,
  tiktok: false,
  youtube: true,
  linkedin: false,
  whatsapp: false,
  telegram: false,
  discord: false,
  website: true
};

export const statsData = {
  connections: 245,
  reach: '1.2M',
  engagement: '4.8%'
};
