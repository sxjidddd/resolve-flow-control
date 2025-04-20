import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintsContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Search, ArrowUpDown } from "lucide-react";
import { Complaint, ComplaintStatus } from "@/lib/data";

export default function ManageComplaints() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { complaints, updateComplaintStatus } = useComplaints();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "status">("date");

  // Check if user is authorized (admin or support)
  if (user?.role !== "admin" && user?.role !== "support") {
    navigate("/unauthorized");
    return null;
  }

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    let result = [...complaints];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(query) ||
          complaint.description.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((complaint) => complaint.status === statusFilter);
    }

    // Sort complaints
    return result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "priority") {
        const priorityMap = { Low: 1, Medium: 2, High: 3, Critical: 4 };
        const priorityA = priorityMap[a.priority as keyof typeof priorityMap];
        const priorityB = priorityMap[b.priority as keyof typeof priorityMap];
        return sortOrder === "asc" ? priorityA - priorityB : priorityB - priorityA;
      } else {
        // status
        const statusMap = { Pending: 1, "In Progress": 2, Resolved: 3, Closed: 4 };
        const statusA = statusMap[a.status as keyof typeof statusMap];
        const statusB = statusMap[b.status as keyof typeof statusMap];
        return sortOrder === "asc" ? statusA - statusB : statusB - statusA;
      }
    });
  }, [
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    complaints
  ]);

  const toggleSort = (column: "date" | "priority" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleStatusUpdate = (complaint: Complaint, newStatus: ComplaintStatus) => {
    updateComplaintStatus(complaint.id, newStatus);
  };

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

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Manage Complaints</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complaints Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleSort("priority")}
                  >
                    Priority
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleSort("status")}
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleSort("date")}
                  >
                    Submitted
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">#{complaint.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {complaint.title}
                    </TableCell>
                    <TableCell>{complaint.category}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(complaint.priority)} variant="outline">
                        {complaint.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={complaint.status}
                        onValueChange={(value) => handleStatusUpdate(complaint, value as ComplaintStatus)}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <Badge className={getStatusColor(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/complaints/${complaint.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No complaints found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
