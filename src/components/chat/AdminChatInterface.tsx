
import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageCircle, RefreshCw, Sparkles } from "lucide-react";
import { useComplaints } from "@/contexts/ComplaintsContext";
import { Complaint } from "@/lib/data";
import { toast } from "sonner";

const AdminChatInterface = () => {
  const { generateResponse, summarizeComplaint } = useChat();
  const { complaints } = useComplaints();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);
  
  const handleComplaintSelect = (complaint: Complaint) => {
    setSelectedComplaintId(complaint.id);
    setGeneratedText("");
  };
  
  const handleGenerateResponse = async () => {
    if (!selectedComplaintId) return;
    
    setIsGenerating(true);
    try {
      const response = await generateResponse(selectedComplaintId);
      setGeneratedText(response);
      toast.success("Response generated successfully");
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSummarizeThread = async () => {
    if (!selectedComplaintId) return;
    
    setIsGenerating(true);
    try {
      const summary = await summarizeComplaint(selectedComplaintId);
      setGeneratedText(summary);
      toast.success("Summary generated successfully");
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast.success("Copied to clipboard");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={20} />
          AI Assistant Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="complaints">
          <TabsList className="mb-4">
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="analytics">Language Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="complaints" className="space-y-4">
            <Alert>
              <MessageCircle className="h-4 w-4" />
              <AlertTitle>AI-Powered Support</AlertTitle>
              <AlertDescription>
                Select a complaint to generate responses or summarize threads.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Recent Complaints</h3>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {complaints.slice(0, 10).map((complaint) => (
                    <Card 
                      key={complaint.id}
                      className={`cursor-pointer transition-colors ${
                        selectedComplaintId === complaint.id ? "border-primary" : ""
                      }`}
                      onClick={() => handleComplaintSelect(complaint)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{complaint.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={
                            complaint.status === "Pending" ? "default" :
                            complaint.status === "In Progress" ? "secondary" :
                            complaint.status === "Resolved" ? "success" : "outline"
                          }>
                            {complaint.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">AI Tools</h3>
                {selectedComplaint ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-medium mb-1">Selected Complaint</h4>
                      <Card className="p-3">
                        <p className="font-medium">{selectedComplaint.title}</p>
                        <p className="text-sm mt-1">{selectedComplaint.description.substring(0, 100)}...</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{selectedComplaint.category}</Badge>
                          <Badge variant="outline">{selectedComplaint.priority}</Badge>
                        </div>
                      </Card>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleGenerateResponse}
                        disabled={isGenerating}
                        className="flex-1"
                      >
                        <Sparkles size={16} className="mr-1" />
                        Generate Response
                      </Button>
                      <Button 
                        onClick={handleSummarizeThread}
                        disabled={isGenerating}
                        className="flex-1"
                        variant="outline"
                      >
                        <RefreshCw size={16} className="mr-1" />
                        Summarize Thread
                      </Button>
                    </div>
                    
                    {generatedText && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-medium">Generated Text</h4>
                          <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                            Copy
                          </Button>
                        </div>
                        <Textarea
                          value={generatedText}
                          onChange={(e) => setGeneratedText(e.target.value)}
                          rows={8}
                          className="resize-none"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] border rounded-md">
                    <p className="text-muted-foreground">Select a complaint to use AI tools</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <Bot size={48} className="mx-auto text-muted-foreground" />
                <h3 className="font-medium">Language Analytics</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Sentiment analysis, key topic extraction, and trend identification
                  features coming soon. These tools will help you understand common
                  issues and customer sentiment patterns.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminChatInterface;
