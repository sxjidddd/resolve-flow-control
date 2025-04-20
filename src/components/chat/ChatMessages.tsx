
import React, { useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/contexts/ChatContext";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  formatTimestamp: (timestamp: string) => string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  messagesEndRef,
  formatTimestamp,
}) => {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <ScrollArea className="flex-1 p-3 h-[380px]">
      {messages
        .filter((msg) => msg.role !== "system")
        .map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              } rounded-lg p-3`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === "user" ? (
                  <>
                    <span className="text-xs opacity-70">You</span>
                    <Avatar className="h-5 w-5">
                      <User size={12} />
                    </Avatar>
                  </>
                ) : (
                  <>
                    <Avatar className="h-5 w-5">
                      <Bot size={12} />
                    </Avatar>
                    <span className="text-xs opacity-70">Assistant</span>
                  </>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap break-words text-left">
                {message.content}
              </p>
              <div className="text-right mt-1">
                <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      {isLoading && (
        <div className="mb-4 text-left">
          <div className="inline-block max-w-[80%] bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="h-5 w-5">
                <Bot size={12} />
              </Avatar>
              <span className="text-xs opacity-70">Assistant</span>
            </div>
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

export default ChatMessages;
