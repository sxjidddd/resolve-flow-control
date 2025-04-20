
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Chatbot from "@/components/chat/Chatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, HelpCircle, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import AdminChatInterface from "@/components/chat/AdminChatInterface";

export default function ChatPage() {
  const { user } = useAuth();
  const isAdminOrSupport = user?.role === "admin" || user?.role === "support";
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground">
            Chat with our AI to get help with complaints and support.
          </p>
        </div>
        <Separator />
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  AI Chat Assistant
                </CardTitle>
                <CardDescription>
                  Our AI can help you with filing complaints, checking status, and answering questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Separator />
                <div className="p-6">
                  <Chatbot />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  What Can I Ask?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTitle>Submit a complaint</AlertTitle>
                  <AlertDescription>
                    "I want to submit a complaint about my recent purchase."
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTitle>Check complaint status</AlertTitle>
                  <AlertDescription>
                    "What's the status of my complaints?"
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTitle>Get help with common issues</AlertTitle>
                  <AlertDescription>
                    "How do I resolve a billing problem with my account?"
                  </AlertDescription>
                </Alert>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Note: Voice input is also supported. Click the microphone icon to speak to the assistant.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {isAdminOrSupport ? (
            <AdminChatInterface />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  How Our AI Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our AI assistant is designed to help you efficiently resolve your issues:
                </p>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Natural Conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Simply explain your issue in plain language, as if you're talking to a human customer service representative.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">24/7 Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help anytime, even outside of business hours, with instant responses to your questions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Personalized Help</h3>
                  <p className="text-sm text-muted-foreground">
                    The AI can access your account information to provide personalized assistance with your specific issues.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Quick Problem-Solving</h3>
                  <p className="text-sm text-muted-foreground">
                    For many common issues, the AI can suggest solutions immediately, without needing to file a formal complaint.
                  </p>
                </div>
                
                <Separator />
                
                <p className="text-xs text-muted-foreground">
                  If the AI cannot resolve your issue, it will help you file a complaint that will be reviewed by our support team.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
