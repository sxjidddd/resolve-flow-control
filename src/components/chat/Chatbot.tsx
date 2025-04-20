
import React, { useState, useRef, useEffect } from "react";
import { useChat, ChatMessage } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, RefreshCw, User, Bot } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ChatbotProps {
  expanded?: boolean;
  onClose?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ expanded = true, onClose }) => {
  const { user } = useAuth();
  const {
    currentSession,
    sendMessage,
    isLoading,
    clearCurrentSession,
    processVoiceInput,
    getGeminiApiKey,
    updateGeminiApiKey
  } = useChat() as any; // Hack: add Gemini helpers

  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chunks = useRef<BlobPart[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages]);

  useEffect(() => {
    setGeminiKey(getGeminiApiKey?.() ?? "");
  }, [getGeminiApiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue("");
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunks.current = [];

      recorder.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
        await processVoiceInput(audioBlob);

        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      toast.success("Recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Error accessing microphone. Please check your browser permissions.");
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      toast.success("Recording stopped");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleGeminiKeySave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeminiApiKey?.(geminiKey.trim());
    setShowKeyInput(false);
  };

  return (
    <Card className={`relative ${expanded ? "h-[500px]" : "h-12"} overflow-hidden transition-all duration-300 ease-in-out shadow-lg`}>
      {expanded ? (
        <>
          {/* HEADER */}
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
                onClick={clearCurrentSession}
              >
                <RefreshCw size={16} className="mr-1" />
                <span className="text-xs">New Chat</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-primary-foreground border-white"
                onClick={() => setShowKeyInput((x) => !x)}
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
          {showKeyInput && (
            <div className="p-3 bg-secondary flex items-center gap-2">
              <form onSubmit={handleGeminiKeySave} className="flex gap-2 items-center w-full">
                <Input
                  type="password"
                  className="w-full"
                  placeholder="Enter your Gemini API key"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                />
                <Button size="sm" type="submit" variant="default">
                  Save
                </Button>
                <Button size="sm" type="button" variant="ghost" onClick={() => setShowKeyInput(false)}>
                  Cancel
                </Button>
              </form>
            </div>
          )}
          <Separator />

          {/* Messages */}
          <ScrollArea className="flex-1 p-3 h-[380px]">
            {currentSession?.messages.filter((msg: any) => msg.role !== "system").map((message: ChatMessage) => (
              <div key={message.id} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}>
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
                    <span className="text-xs opacity-70">
                      {formatTimestamp(message.timestamp)}
                    </span>
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
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <Separator />

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-card">
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
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                >
                  <Mic size={18} />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </form>
        </>
      ) : (
        <Button
          variant="ghost"
          className="w-full h-full justify-start"
          onClick={onClose}
        >
          <Bot size={18} className="mr-2" />
          <span>Chat with AI Assistant</span>
        </Button>
      )}
    </Card>
  );
};

export default Chatbot;

