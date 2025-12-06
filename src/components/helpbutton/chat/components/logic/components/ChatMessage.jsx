import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, RefreshCw, Flag } from "lucide-react";
import ReportModal from "./ReportModal";
import { useState } from "react";

export function ChatMessage({ message, handleQuickAction }) {
  const isUser = message.from === "user";
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  const openReportModal = () => setReportModalOpen(true);
  const closeReportModal = () => setReportModalOpen(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}
    >
      <div
        className={`px-4 py-2 rounded-lg max-w-xs break-words shadow-md ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-300 text-gray-800 rounded-bl-none"
        }`}
      >
        <p>{message.text}</p>
        <span className="block text-xs mt-1 text-right opacity-70">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {/* Quick Actions */}
        {!isUser && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleQuickAction("like", message.id)}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              title="Like"
            >
              <ThumbsUp size={16} />
            </button>
            <button
              onClick={() => handleQuickAction("dislike", message.id)}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              title="Dislike"
            >
              <ThumbsDown size={16} />
            </button>
            <button
              onClick={() => handleQuickAction("regenerate", message.id)}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              title="Regenerate"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={openReportModal}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              title="Report"
            >
              <Flag size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal
        open={isReportModalOpen}
        onClose={closeReportModal}
        onSubmit={(reason) => handleQuickAction("report", message.id, reason)}
        messageId={message.id}
      />
    </motion.div>
  );
}