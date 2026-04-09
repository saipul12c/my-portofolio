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
    // Navigate back to where we came from, or to AI Docs as a fallback
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/help/docs/ai", { replace: true });
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
