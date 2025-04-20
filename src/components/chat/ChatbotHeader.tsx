
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bot } from "lucide-react";

interface ChatbotHeaderProps {
  onNewChat: () => void;
  onShowKey: () => void;
  onClose?: () => void;
}

const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({ onNewChat, onShowKey, onClose }) => (
  <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
    <div className="flex items-center gap-2">
      <Bot size={18} />
      <h3 className="font-semibold">AI Support Assistant</h3>
    </div>
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-2 text-primary-foreground hover:bg-primary/80"
        onClick={onNewChat}
      >
        <RefreshCw size={16} className="mr-1" />
        <span className="text-xs">New Chat</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-primary-foreground border-white"
        onClick={onShowKey}
      >
        <span className="text-xs">Gemini API Key</span>
      </Button>
      {onClose && (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-primary-foreground hover:bg-primary/80"
          onClick={onClose}
        >
          <span className="text-xs">Minimize</span>
        </Button>
      )}
    </div>
  </div>
);

export default ChatbotHeader;
