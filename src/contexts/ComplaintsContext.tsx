import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
  Complaint, 
  ComplaintCategory, 
  ComplaintPriority,
  ComplaintStatus,
  mockComplaints
} from "@/lib/data";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ComplaintsContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "userId" | "status">) => void;
  getFilteredComplaints: () => Complaint[];
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus) => void;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

export function ComplaintsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);

  const addComplaint = (
    complaintData: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "userId" | "status">
  ) => {
    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      id: uuidv4(),
      ...complaintData,
      status: "Pending" as ComplaintStatus,
      createdAt: now,
      updatedAt: now,
      userId: user?.id || "1",
    };

    setComplaints(prevComplaints => [newComplaint, ...prevComplaints]);
  };

  const getFilteredComplaints = () => {
    if (!user) return [];
    
    if (user.role === "user") {
      return complaints.filter(complaint => complaint.userId === user.id);
    } else if (user.role === "support") {
      return complaints.filter(
        complaint => complaint.assignedTo === user.id || complaint.status === "Pending"
      );
    }
    
    return complaints;
  };

  const updateComplaintStatus = (complaintId: string, status: ComplaintStatus) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintId
          ? {
              ...complaint,
              status,
              updatedAt: new Date().toISOString(),
              assignedTo: user?.id
            }
          : complaint
      )
    );
    toast.success(`Complaint #${complaintId} status updated to ${status}`);
  };

  return (
    <ComplaintsContext.Provider value={{ 
      complaints, 
      addComplaint, 
      getFilteredComplaints,
      updateComplaintStatus 
    }}>
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintsContext);
  if (context === undefined) {
    throw new Error("useComplaints must be used within a ComplaintsProvider");
  }
  return context;
}
