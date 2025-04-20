import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useComplaints } from "./ComplaintsContext";
import { Complaint } from "@/lib/data";
import { toast } from "sonner";

// Define the types for our chatbot
export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
};

export type ChatSession = {
  id: string;
  messages: ChatMessage[];
  title: string;
  createdAt: string;
  updatedAt: string;
};

// AI actions that can be performed
export type AIAction = 
  | "create_complaint" 
  | "check_status" 
  | "suggest_solution" 
  | "generate_response"
  | "summarize_thread"
  | "route_to_department";

type ChatContextType = {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  createNewSession: () => void;
  switchSession: (sessionId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  processVoiceInput: (audioBlob: Blob) => Promise<void>;
  clearCurrentSession: () => void;
  detectIntent: (message: string) => Promise<AIAction | null>;
  generateResponse: (complaintId: string) => Promise<string>;
  summarizeComplaint: (complaintId: string) => Promise<string>;
  getGeminiApiKey: () => string;
  updateGeminiApiKey: (key: string) => void;
};

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock API key - in a real app, this would be in environment variables
// or fetched from a secure backend
// const MOCK_API_KEY = "mock-api-key";

// Sample predefined responses
const predefinedResponses = {
  greetings: ["Hello! How can I help you today?", "Hi there! How may I assist you?"],
  create_complaint: [
    "I can help you submit a complaint. Could you tell me what issue you're experiencing?",
    "I'd be happy to help you file a complaint. What seems to be the problem?"
  ],
  check_status: [
    "I can check the status of your complaint. Could you provide the complaint ID or describe the issue?",
    "Let me look up your complaint status. Do you have the complaint ID?"
  ],
  suggest_solution: [
    "Based on your description, this might be a common issue. Have you tried...",
    "This sounds familiar. Many users solve this by..."
  ],
  faq: {
    "billing": "For billing issues, please ensure your payment method is up to date. Most billing problems are resolved by updating your payment information.",
    "technical": "For technical issues, try clearing your browser cache and cookies, then restart your browser. This resolves most technical problems.",
    "product": "For product defects, please provide clear photos and the purchase date. This helps our team investigate your issue more efficiently.",
    "service": "For service quality concerns, please provide the date, time, and details of your experience. This helps us address specific training opportunities."
  }
};

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { complaints, getFilteredComplaints } = useComplaints();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize with a default session
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, []);

  // Helper to get/set Gemini API key in localStorage
  const getGeminiApiKey = () => localStorage.getItem("gemini_api_key") || "";
  const setGeminiApiKey = (val: string) => localStorage.setItem("gemini_api_key", val);

  // Add initialization to set the Gemini API key
  useEffect(() => {
    // Set the Gemini API key if not already set
    if (!localStorage.getItem("gemini_api_key")) {
      localStorage.setItem("gemini_api_key", "AIzaSyBiGFgcaYKxZKyGSBha-OYRqrgVYoaaBhc");
      toast.success("Gemini API key has been automatically configured.");
    }
  }, []);

  // AI API: call Gemini if key exists
  const callGemini = async (messages: ChatMessage[], prompt?: string): Promise<string> => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error("Gemini API key not found.");
    }
    // Prepare prompt context
    const fullPrompt = [
      ...(prompt ? [{ role: "user", content: prompt }] : []),
      ...messages.filter((msg) => msg.role === "user" || msg.role === "assistant").map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))
    ];
    const systemPrompt = "You are a helpful and concise AI support assistant for ComplaintHub.";

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n` + messages.map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`).join("\n") + "\nAssistant:" }
          ]
        }
      ]
    };
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Gemini API request failed");
    const data = await response.json();
    // Gemini's response is nested; extract
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
    return text;
  };

  // Create a new chat session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: generateId(),
      messages: [
        {
          id: generateId(),
          role: "system",
          content: "I am an AI assistant that helps with customer complaints. How can I help you today?",
          timestamp: new Date().toISOString()
        }
      ],
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSession(newSession);
  };

  // Switch to an existing session
  const switchSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  // Clear the current session
  const clearCurrentSession = () => {
    if (currentSession) {
      const clearedSession: ChatSession = {
        ...currentSession,
        messages: [
          {
            id: generateId(),
            role: "system",
            content: "I am an AI assistant that helps with customer complaints. How can I help you today?",
            timestamp: new Date().toISOString()
          }
        ],
        updatedAt: new Date().toISOString()
      };

      setSessions(prev => 
        prev.map(session => 
          session.id === currentSession.id ? clearedSession : session
        )
      );
      setCurrentSession(clearedSession);
    }
  };

  // Detect user intent from message
  const detectIntent = async (message: string): Promise<AIAction | null> => {
    // In a real app, this would call an AI model API
    // For now, we'll use keyword matching
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("submit") || 
        lowerMessage.includes("file") || 
        lowerMessage.includes("new complaint") ||
        lowerMessage.includes("report")) {
      return "create_complaint";
    }
    
    if (lowerMessage.includes("status") || 
        lowerMessage.includes("update") || 
        lowerMessage.includes("progress") ||
        lowerMessage.includes("check")) {
      return "check_status";
    }
    
    if (lowerMessage.includes("help") || 
        lowerMessage.includes("solve") || 
        lowerMessage.includes("fix") ||
        lowerMessage.includes("solution")) {
      return "suggest_solution";
    }
    
    if (lowerMessage.includes("summarize") || 
        lowerMessage.includes("summary")) {
      return "summarize_thread";
    }
    
    if (lowerMessage.includes("department") || 
        lowerMessage.includes("who should") || 
        lowerMessage.includes("contact")) {
      return "route_to_department";
    }
    
    return null;
  };

  // Process a message from the user
  const sendMessage = async (content: string) => {
    if (!currentSession) return;
    
    setIsLoading(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };
    
    // Update the session with the user message
    const updatedSession: ChatSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      updatedAt: new Date().toISOString()
    };
    
    setCurrentSession(updatedSession);
    setSessions(prev => 
      prev.map(session => 
        session.id === currentSession.id ? updatedSession : session
      )
    );
    
    try {
      let responseContent = "";
      const geminiApiKey = getGeminiApiKey();

      if (geminiApiKey) {
        // Use Gemini API for chat
        responseContent = await callGemini(updatedSession.messages);
      } else {
        // Detect intent
        const intent = await detectIntent(content);

        if (intent === "create_complaint") {
          responseContent = predefinedResponses.create_complaint[
            Math.floor(Math.random() * predefinedResponses.create_complaint.length)
          ];
        } else if (intent === "check_status") {
          if (user) {
            const userComplaints = getFilteredComplaints();
            if (userComplaints.length > 0) {
              responseContent = `You have ${userComplaints.length} complaint(s). The most recent one is "${userComplaints[0].title}" with status "${userComplaints[0].status}".`;
            } else {
              responseContent = "You don't have any complaints yet. Would you like to create one?";
            }
          } else {
            responseContent = "Please log in to check your complaint status.";
          }
        } else if (intent === "suggest_solution") {
          if (content.toLowerCase().includes("bill") || content.toLowerCase().includes("payment")) {
            responseContent = predefinedResponses.faq.billing;
          } else if (content.toLowerCase().includes("technical") || content.toLowerCase().includes("software") || content.toLowerCase().includes("app")) {
            responseContent = predefinedResponses.faq.technical;
          } else if (content.toLowerCase().includes("product") || content.toLowerCase().includes("item")) {
            responseContent = predefinedResponses.faq.product;
          } else if (content.toLowerCase().includes("service") || content.toLowerCase().includes("staff")) {
            responseContent = predefinedResponses.faq.service;
          } else {
            responseContent = predefinedResponses.suggest_solution[
              Math.floor(Math.random() * predefinedResponses.suggest_solution.length)
            ];
          }
        } else {
          responseContent = predefinedResponses.greetings[
            Math.floor(Math.random() * predefinedResponses.greetings.length)
          ];
        }
      }
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toISOString()
      };
      
      // Update the session with the assistant message
      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage],
        updatedAt: new Date().toISOString()
      };
      
      setCurrentSession(finalSession);
      setSessions(prev => 
        prev.map(session => 
          session.id === currentSession.id ? finalSession : session
        )
      );
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("There was an error processing your message.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process voice input
  const processVoiceInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would send the audio to an API for transcription
      // For now, we'll mock it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock transcription result
      const transcription = "This is a simulated voice transcription.";
      
      // Process the transcribed text
      await sendMessage(transcription);
    } catch (error) {
      console.error("Error processing voice input:", error);
      toast.error("There was an error processing your voice input.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a response to a complaint (for support staff)
  const generateResponse = async (complaintId: string): Promise<string> => {
    // In a real app, this would call an AI model API with the complaint details
    // For now, we'll return a mock response
    const complaint = complaints.find(c => c.id === complaintId);
    
    if (!complaint) {
      return "No complaint found with this ID.";
    }
    
    return `Dear customer,\n\nThank you for your complaint about ${complaint.category.toLowerCase()}. We're sorry to hear that you experienced an issue with ${complaint.title.toLowerCase()}.\n\nOur team is reviewing your case and will get back to you shortly. Your complaint has been assigned priority level "${complaint.priority}".\n\nBest regards,\nCustomer Support Team`;
  };

  // Summarize a complaint thread
  const summarizeComplaint = async (complaintId: string): Promise<string> => {
    // In a real app, this would call an AI model API with the complaint and comments
    // For now, we'll return a mock summary
    const complaint = complaints.find(c => c.id === complaintId);
    
    if (!complaint) {
      return "No complaint found with this ID.";
    }
    
    return `Summary of complaint #${complaint.id}:\n- Category: ${complaint.category}\n- Priority: ${complaint.priority}\n- Status: ${complaint.status}\n- Created: ${new Date(complaint.createdAt).toLocaleDateString()}\n- Key issue: ${complaint.title}\n- ${complaint.comments?.length || 0} comments in thread`;
  };

  // Add method to update the Gemini key
  const updateGeminiApiKey = (key: string) => {
    setGeminiApiKey(key);
    toast.success("Gemini API key saved!");
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        isLoading,
        createNewSession,
        switchSession,
        sendMessage,
        processVoiceInput,
        clearCurrentSession,
        detectIntent,
        generateResponse,
        summarizeComplaint,
        getGeminiApiKey,
        updateGeminiApiKey,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
