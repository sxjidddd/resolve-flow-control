
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Complaint, ComplaintStatus } from "@/lib/data";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComplaintCardProps {
  complaint: Complaint;
  variant?: "default" | "compact";
}

export default function ComplaintCard({ 
  complaint, 
  variant = "default" 
}: ComplaintCardProps) {
  const navigate = useNavigate();
  
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
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };
  
  if (variant === "compact") {
    return (
      <Card className="hover:bg-secondary/50 transition-colors cursor-pointer" 
            onClick={() => navigate(`/complaints/${complaint.id}`)}>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base truncate">{complaint.title}</CardTitle>
            <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
          </div>
          <CardDescription className="flex items-center justify-between">
            <span>{complaint.category}</span>
            <span>{formatDate(complaint.createdAt)}</span>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="truncate">{complaint.title}</CardTitle>
          <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
        </div>
        <CardDescription>
          <div className="flex items-center justify-between mt-2">
            <div>
              <Badge variant="outline" className="mr-2">
                {complaint.category}
              </Badge>
              <Badge className={cn("text-white", getPriorityColor(complaint.priority))}>
                {complaint.priority}
              </Badge>
            </div>
            <span className="text-sm">
              {formatDate(complaint.createdAt)}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{complaint.description}</p>
      </CardContent>
      <CardFooter className="mt-auto pt-2">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => navigate(`/complaints/${complaint.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
