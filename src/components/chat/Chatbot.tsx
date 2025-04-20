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
import ChatbotHeader from "./ChatbotHeader";
import GeminiKeyInput from "./GeminiKeyInput";
import ChatMessages from "./ChatMessages";
import ChatInputArea from "./ChatInputArea";

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
          <ChatbotHeader
            onNewChat={clearCurrentSession}
            onShowKey={() => setShowKeyInput((x) => !x)}
            onClose={onClose}
          />
          {showKeyInput && (
            <GeminiKeyInput
              geminiKey={geminiKey}
              setGeminiKey={setGeminiKey}
              onSave={handleGeminiKeySave}
              onCancel={() => setShowKeyInput(false)}
            />
          )}
          <Separator />
          {/* Messages */}
          <ChatMessages
            messages={currentSession?.messages || []}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            formatTimestamp={formatTimestamp}
          />
          <Separator />

          {/* Input Area */}
          <ChatInputArea
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            isRecording={isRecording}
            onSubmit={handleSubmit}
            onMicClick={isRecording ? stopRecording : startRecording}
          />
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
