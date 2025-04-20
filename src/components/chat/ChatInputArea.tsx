
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";

interface ChatInputAreaProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  isLoading: boolean;
  isRecording: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onMicClick: () => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputValue,
  setInputValue,
  isLoading,
  isRecording,
  onSubmit,
  onMicClick,
}) => (
  <form onSubmit={onSubmit} className="p-3 bg-card">
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="resize-none"
          rows={2}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "destructive" : "outline"}
          onClick={onMicClick}
          disabled={isLoading}
        >
          <Mic size={18} />
        </Button>
        <Button type="submit" size="icon" disabled={!inputValue.trim() || isLoading}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  </form>
);

export default ChatInputArea;
