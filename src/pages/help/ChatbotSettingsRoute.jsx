import { useParams, useNavigate } from "react-router-dom";
import { ChatbotSettings } from "../../components/helpbutton/chat/components/ChatbotSettings";

const TAB_MAP = {
  general: 'umum',
  ai: 'ai',
  data: 'data',
  file: 'files',
  files: 'files',
  performance: 'perform',
  perform: 'perform',
  privacy: 'privacy',
  storage: 'storage',
  advanced: 'shortcuts'
};

export default function ChatbotSettingsRoute() {
  const { tabId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    // Navigate back to home or previous non-settings page
    // Since we now use replace: true inside settings, 
    // navigate(-1) will take us back to where we started before opening settings
    try {
      navigate(-1);
    } catch (e) {
      navigate("/", { replace: true });
    }
  };

  const initialTab = tabId ? (TAB_MAP[tabId] || tabId) : 'umum';

  return (
    <div className="fixed bottom-24 right-80 z-[10000]">
      <ChatbotSettings 
        onClose={handleClose} 
        initialTab={initialTab}
      />
    </div>
  );
}
