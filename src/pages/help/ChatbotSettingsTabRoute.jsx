import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatbotSettings } from "../../components/helpbutton/chat/components/ChatbotSettings";

// Map external route tab names to internal tab keys used by SettingsContent
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

export default function ChatbotSettingsTabRoute({ tab }) {
  const navigate = useNavigate();
  const dispatchedRef = useRef(false);  // Prevent double dispatch

  useEffect(() => {
    // Only dispatch once per route load
    if (tab && !dispatchedRef.current) {
      dispatchedRef.current = true;
      try {
        const mapped = TAB_MAP[tab] || tab;
        window.dispatchEvent(
          new CustomEvent("saipul_open_settings_tab", { detail: { tab: mapped, context: 'live-cs' } })
        );
      } catch (e) {
        console.error("Error dispatching tab event:", e);
      }
    }
  }, [tab]);

  const handleClose = () => {
    try {
      navigate(-1);
    } catch (e) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="fixed bottom-24 right-80 z-[10000]">
      <ChatbotSettings onClose={handleClose} />
    </div>
  );
}
