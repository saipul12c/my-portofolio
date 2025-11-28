import { 
  FaRocket, FaUsers, FaVideo, FaUpload, FaComments, FaEnvelope, 
  FaCalendarAlt, FaAward, FaBolt, FaCheckCircle, FaClock, 
  FaStopwatch, FaPaperPlane, FaThumbsUp, FaExclamationCircle,
  FaEnvelopeOpen, FaPhoneAlt, FaLifeRing, FaCode, FaShoppingCart,
  FaChartBar, FaCloud, FaMobile, FaBuilding, FaGraduationCap,
  FaMobileAlt, FaTwitter, FaGithub, FaLinkedin, FaInstagram,
  FaYoutube, FaFacebook, FaDiscord, FaServer, FaDatabase,
  FaReact, FaPalette, FaPython, FaVuejs, FaCss3Alt, FaFileCode,
  FaImage, FaEye, FaHeart, FaHeadset, FaAd, FaCreditCard,
  FaDonate, FaMusic, FaGlobe, FaUserPlus, FaLightbulb,
  FaHandshake, FaMicrophone, FaUserFriends, FaCircle,
  FaBroadcastTower, FaComment, FaDollarSign, FaChartBar as FaChartBar2,
  FaBook, FaCodeBranch, FaTools, FaBox, FaLock, FaUserTie,
  FaPaintBrush, FaApple, FaAndroid
} from "react-icons/fa";

export const getIconComponent = (iconName) => {
  const iconMap = {
    FaRocket, FaUsers, FaVideo, FaUpload, FaComments, FaEnvelope,
    FaCalendarAlt, FaAward, FaBolt, FaCheckCircle, FaClock,
    FaStopwatch, FaPaperPlane, FaThumbsUp, FaExclamationCircle,
    FaEnvelopeOpen, FaPhoneAlt, FaLifeRing, FaCode, FaShoppingCart,
    FaChartBar, FaCloud, FaMobile, FaBuilding, FaGraduationCap,
    FaMobileAlt, FaTwitter, FaGithub, FaLinkedin, FaInstagram,
    FaYoutube, FaFacebook, FaDiscord, FaServer, FaDatabase,
    FaReact, FaPalette, FaPython, FaVuejs, FaCss3Alt, FaFileCode,
    FaImage, FaEye, FaHeart, FaHeadset, FaAd, FaCreditCard,
    FaDonate, FaMusic, FaGlobe, FaUserPlus, FaLightbulb,
    FaHandshake, FaMicrophone, FaUserFriends, FaCircle,
    FaBroadcastTower, FaComment, FaDollarSign, FaChartBar2,
    FaBook, FaCodeBranch, FaTools, FaBox, FaLock, FaUserTie,
    FaPaintBrush, FaApple, FaAndroid
  };
  return iconMap[iconName] || FaRocket;
};

export default getIconComponent;