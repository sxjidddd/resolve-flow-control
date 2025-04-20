import { useEffect, useState } from "react";
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Inbox, FileCheck } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import BarChartComponent from "@/components/dashboard/BarChartComponent";
import PieChartComponent from "@/components/dashboard/PieChartComponent";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import { Button } from "@/components/ui/button";
import {
  Complaint,
  monthlyData,
  categoryData,
  priorityData,
} from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintsContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const { getFilteredComplaints } = useComplaints();
  const navigate = useNavigate();
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  useEffect(() => {
    // Get filtered complaints based on user role
    const filteredComplaints = getFilteredComplaints();
    
    // Calculate stats
    const total = filteredComplaints.length;
    const pending = filteredComplaints.filter((c) => c.status === "Pending").length;
    const inProgress = filteredComplaints.filter((c) => c.status === "In Progress").length;
    const resolved = filteredComplaints.filter((c) => c.status === "Resolved").length;
    const closed = filteredComplaints.filter((c) => c.status === "Closed").length;
    
    setStats({ total, pending, inProgress, resolved, closed });
    
    // Sort by date and get the 5 most recent
    const sortedComplaints = [...filteredComplaints].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setRecentComplaints(sortedComplaints.slice(0, 5));
  }, [user, getFilteredComplaints]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={() => navigate("/complaints/new")}>Submit New Complaint</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total Complaints"
            value={stats.total}
            icon={<Inbox className="h-5 w-5" />}
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <StatsCard
            title="Closed"
            value={stats.closed}
            icon={<FileCheck className="h-5 w-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <BarChartComponent
            data={monthlyData}
            title="Monthly Complaint Trends"
          />
          <PieChartComponent 
            data={categoryData} 
            title="Complaints by Category" 
          />
        </div>

        {/* Recent Complaints */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Complaints</h2>
            <Button variant="outline" onClick={() => navigate("/complaints")}>
              View All
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No complaints yet</h3>
                <p className="text-muted-foreground mt-2">
                  Start by submitting a new complaint
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/complaints/new")}
                >
                  Submit Complaint
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
