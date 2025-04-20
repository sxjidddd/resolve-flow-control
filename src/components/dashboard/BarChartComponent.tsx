
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyData } from "@/lib/data";

interface BarChartComponentProps {
  data: MonthlyData[];
  title: string;
}

export default function BarChartComponent({ data, title }: BarChartComponentProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(22, 22, 26, 0.9)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                }} 
              />
              <Legend />
              <Bar dataKey="pending" fill="#ffc107" name="Pending" />
              <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
              <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
              <Bar dataKey="closed" fill="#6b7280" name="Closed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
