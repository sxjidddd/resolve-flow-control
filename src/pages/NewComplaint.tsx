
import DashboardLayout from "@/components/DashboardLayout";
import ComplaintForm from "@/components/complaints/ComplaintForm";

export default function NewComplaint() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight">Submit New Complaint</h1>
        <ComplaintForm />
      </div>
    </DashboardLayout>
  );
}
