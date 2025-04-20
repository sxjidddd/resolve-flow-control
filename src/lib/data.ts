
import { User, UserRole } from "@/contexts/AuthContext";

// Define complaint categories
export type ComplaintCategory = 
  | "Technical Issue" 
  | "Billing Problem" 
  | "Service Quality" 
  | "Product Defect" 
  | "Staff Behavior" 
  | "Other";

// Define complaint priority
export type ComplaintPriority = "Low" | "Medium" | "High" | "Critical";

// Define complaint status
export type ComplaintStatus = "Pending" | "In Progress" | "Resolved" | "Closed";

// Define the complaint interface
export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  assignedTo?: string;
  attachments?: string[];
  comments?: Comment[];
}

// Define the comment interface
export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  userName: string;
  userRole: UserRole;
}

// Generate mock complaint data
export const generateMockComplaints = (count: number): Complaint[] => {
  const categories: ComplaintCategory[] = [
    "Technical Issue",
    "Billing Problem",
    "Service Quality",
    "Product Defect",
    "Staff Behavior",
    "Other",
  ];
  
  const priorities: ComplaintPriority[] = ["Low", "Medium", "High", "Critical"];
  const statuses: ComplaintStatus[] = ["Pending", "In Progress", "Resolved", "Closed"];
  
  return Array.from({ length: count }).map((_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));
    
    const updatedDate = new Date(createdDate);
    updatedDate.setDate(createdDate.getDate() + Math.floor(Math.random() * 10));
    
    return {
      id: (index + 1).toString(),
      title: `Complaint about ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()}`,
      description: `This is a detailed description of the complaint. It explains what happened and why the customer is unhappy with the service or product.`,
      category: categories[Math.floor(Math.random() * categories.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      userId: Math.floor(Math.random() * 3 + 1).toString(),
      assignedTo: status !== "Pending" ? (Math.random() > 0.5 ? "1" : "3") : undefined,
      comments: status !== "Pending" ? generateMockComments(Math.floor(Math.random() * 3 + 1)) : [],
    };
  });
};

// Generate mock comments
export const generateMockComments = (count: number): Comment[] => {
  const roles: UserRole[] = ["admin", "user", "support"];
  const userNames = ["Admin User", "Regular User", "Support Staff"];
  
  return Array.from({ length: count }).map((_, index) => {
    const roleIndex = Math.floor(Math.random() * 3);
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 5));
    
    return {
      id: `comment-${index + 1}`,
      text: `This is a comment on the complaint. It could be from the user, support staff, or administrator providing updates or asking questions.`,
      createdAt: date.toISOString(),
      userId: (roleIndex + 1).toString(),
      userName: userNames[roleIndex],
      userRole: roles[roleIndex],
    };
  });
};

// Generate analytics data for charts
export interface MonthlyData {
  month: string;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

export const generateMonthlyData = (): MonthlyData[] => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  return months.map(month => ({
    month,
    pending: Math.floor(Math.random() * 30) + 5,
    inProgress: Math.floor(Math.random() * 25) + 5,
    resolved: Math.floor(Math.random() * 40) + 10,
    closed: Math.floor(Math.random() * 20) + 5,
  }));
};

export interface CategoryData {
  name: string;
  value: number;
}

export const generateCategoryData = (): CategoryData[] => {
  const categories: ComplaintCategory[] = [
    "Technical Issue",
    "Billing Problem",
    "Service Quality",
    "Product Defect",
    "Staff Behavior",
    "Other",
  ];
  
  return categories.map(name => ({
    name,
    value: Math.floor(Math.random() * 100) + 20,
  }));
};

export interface PriorityData {
  name: string;
  value: number;
}

export const generatePriorityData = (): PriorityData[] => {
  const priorities: ComplaintPriority[] = ["Low", "Medium", "High", "Critical"];
  
  return priorities.map(name => ({
    name,
    value: Math.floor(Math.random() * 100) + 10,
  }));
};

// Mock data initialization
export const mockComplaints = generateMockComplaints(20);
export const monthlyData = generateMonthlyData();
export const categoryData = generateCategoryData();
export const priorityData = generatePriorityData();

// Helper functions
export const getComplaintById = (id: string): Complaint | undefined => {
  return mockComplaints.find(complaint => complaint.id === id);
};

export const getUserComplaints = (userId: string): Complaint[] => {
  return mockComplaints.filter(complaint => complaint.userId === userId);
};

export const getAssignedComplaints = (userId: string): Complaint[] => {
  return mockComplaints.filter(complaint => complaint.assignedTo === userId);
};
