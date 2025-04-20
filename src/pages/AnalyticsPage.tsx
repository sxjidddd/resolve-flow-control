
import BarChartComponent from "@/components/dashboard/BarChartComponent";
import PieChartComponent from "@/components/dashboard/PieChartComponent";
import StatsCard from "@/components/dashboard/StatsCard";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { CategoryData, MonthlyData } from "@/lib/data";

export default function AnalyticsPage() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  // Simulate data fetching
  useEffect(() => {
    // Sample category data for the pie chart
    const sampleCategoryData = [
      { name: "Product Quality", value: 35 },
      { name: "Customer Service", value: 25 },
      { name: "Delivery Issues", value: 20 },
      { name: "Billing Problems", value: 15 },
      { name: "Other", value: 5 }
    ];

    // Sample monthly data for the bar chart
    const sampleMonthlyData = [
      { month: "Jan", pending: 12, inProgress: 8, resolved: 20, closed: 5 },
      { month: "Feb", pending: 18, inProgress: 12, resolved: 25, closed: 8 },
      { month: "Mar", pending: 15, inProgress: 15, resolved: 30, closed: 12 },
      { month: "Apr", pending: 25, inProgress: 18, resolved: 22, closed: 15 },
      { month: "May", pending: 20, inProgress: 20, resolved: 35, closed: 10 },
      { month: "Jun", pending: 18, inProgress: 15, resolved: 40, closed: 12 }
    ];

    setCategoryData(sampleCategoryData);
    setMonthlyData(sampleMonthlyData);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">View user activity and complaint statistics.</p>
        </div>
        <Separator />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Users"
            value="1,234"
            description="Active users this month"
          />
          <StatsCard 
            title="New Complaints"
            value="123"
            description="Submitted this week"
          />
          <StatsCard 
            title="Resolution Rate"
            value="89%"
            description="Average resolution time: 2.4 days"
          />
          <StatsCard 
            title="Satisfaction"
            value="4.5/5"
            description="Based on user feedback"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Complaints by Category</h3>
            <PieChartComponent 
              data={categoryData}
              title="Complaint Distribution by Category"
            />
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
            <BarChartComponent 
              data={monthlyData}
              title="Complaint Status by Month"
            />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
