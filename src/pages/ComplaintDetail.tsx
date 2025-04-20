
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  ArrowLeft, 
  MessageSquare, 
  Paperclip, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  AlertCircle 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Complaint, ComplaintStatus, getComplaintById } from "@/lib/data";

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | undefined>(
    id ? getComplaintById(id) : undefined
  );
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<ComplaintStatus | "">("");

  if (!complaint) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-2">Complaint not found</h2>
          <p className="text-muted-foreground mb-4">
            The complaint you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/complaints")}>
            Back to Complaints
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "In Progress":
        return "bg-blue-500 hover:bg-blue-600";
      case "Resolved":
        return "bg-green-500 hover:bg-green-600";
      case "Closed":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-green-500";
      case "Medium":
        return "bg-blue-500";
      case "High":
        return "bg-orange-500";
      case "Critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (user) {
        const newCommentObj = {
          id: `comment-${Date.now()}`,
          text: newComment.trim(),
          createdAt: new Date().toISOString(),
          userId: user.id,
          userName: user.name,
          userRole: user.role,
        };
        
        setComplaint({
          ...complaint,
          comments: [...(complaint.comments || []), newCommentObj],
        });
        
        setNewComment("");
        toast.success("Comment added successfully");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleStatusChange = (newStatus: ComplaintStatus) => {
    setStatus(newStatus);
    
    // Simulate API call
    setTimeout(() => {
      setComplaint({
        ...complaint,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      
      toast.success(`Status updated to ${newStatus}`);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Check if user can update status (admin or support)
  const canUpdateStatus = user?.role === "admin" || user?.role === "support";

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/complaints")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Complaint Details</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Complaint Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{complaint.title}</CardTitle>
                <Badge className={getStatusColor(complaint.status)}>
                  {complaint.status}
                </Badge>
              </div>
              <CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(complaint.createdAt)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last updated: {formatDate(complaint.updatedAt)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {complaint.category}
                  </Badge>
                  <Badge 
                    className={cn("text-white", getPriorityColor(complaint.priority))}
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {complaint.priority} Priority
                  </Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-secondary/50 p-4">
                <p className="whitespace-pre-line">{complaint.description}</p>
              </div>

              {complaint.attachments && complaint.attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments ({complaint.attachments.length})
                  </h3>
                  <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
                    {complaint.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 rounded-md bg-secondary/50"
                      >
                        <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm truncate">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments
                </h3>

                {complaint.comments && complaint.comments.length > 0 ? (
                  <div className="space-y-4">
                    {complaint.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex gap-3 rounded-lg bg-secondary/30 p-4"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {comment.userName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.userName}</span>
                            <Badge variant="outline" className="text-xs">
                              {comment.userRole}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No comments yet
                  </div>
                )}

                {/* Add Comment Form */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmitComment} 
                      disabled={!newComment.trim() || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Add Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Card */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Submitted by</span>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span>User #{complaint.userId}</span>
                </div>
              </div>

              {complaint.assignedTo && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Assigned to</span>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {complaint.assignedTo === "1" 
                        ? "Admin User" 
                        : complaint.assignedTo === "3" 
                        ? "Support Staff" 
                        : `Staff #${complaint.assignedTo}`}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-1 pt-4">
                <span className="text-sm text-muted-foreground">Status</span>
                {canUpdateStatus ? (
                  <Select
                    value={status || complaint.status}
                    onValueChange={(value) => handleStatusChange(value as ComplaintStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={complaint.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="rounded-md bg-secondary/50 p-2">
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {canUpdateStatus && !complaint.assignedTo && (
                <Button className="w-full" variant="outline">
                  Assign to Me
                </Button>
              )}
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
