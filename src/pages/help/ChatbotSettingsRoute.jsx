import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatbotSettings } from "../../components/helpbutton/chat/components/ChatbotSettings";

export default function ChatbotSettingsRoute() {
  const navigate = useNavigate();
  const dispatchedRef = useRef(false);  // Prevent double dispatch

  useEffect(() => {
    // Only dispatch once per route load
    if (!dispatchedRef.current) {
      dispatchedRef.current = true;
      try {
        window.dispatchEvent(new CustomEvent('saipul_open_settings_tab', { detail: { tab: 'umum', context: 'live-cs' } }));
      } catch (_e) { void _e; }
    }
  }, []);

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
