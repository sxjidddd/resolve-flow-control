
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Complaint, mockComplaints } from "@/lib/data";
import { Search } from "lucide-react";

export default function ComplaintsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Filter complaints based on user role and filters
  const filteredComplaints = useMemo(() => {
    let result = [...mockComplaints];

    // Filter by user role
    if (user?.role === "user") {
      result = result.filter((complaint) => complaint.userId === user.id);
    }

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

    // Filter by category
    if (categoryFilter !== "all") {
      result = result.filter((complaint) => complaint.category === categoryFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      result = result.filter((complaint) => complaint.priority === priorityFilter);
    }

    // Sort by date (newest first)
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [
    searchQuery,
    statusFilter,
    categoryFilter,
    priorityFilter,
    user
  ]);

  const uniqueCategories = Array.from(
    new Set(mockComplaints.map((complaint) => complaint.category))
  );

  const uniquePriorities = Array.from(
    new Set(mockComplaints.map((complaint) => complaint.priority))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>
          <Button onClick={() => navigate("/complaints/new")}>
            Submit New Complaint
          </Button>
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
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
            <SelectTrigger>
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

          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={setPriorityFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {uniquePriorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Complaints List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint: Complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium">No complaints found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or create a new complaint
              </p>
              <Button className="mt-4" onClick={() => navigate("/complaints/new")}>
                Submit Complaint
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
