
import React, { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeft,
  Settings,
  UserCog,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard", roles: ["user", "support", "admin"] },
    { label: "My Complaints", icon: FileText, path: "/complaints", roles: ["user", "support", "admin"] },
    { label: "Manage Complaints", icon: UserCog, path: "/manage-complaints", roles: ["support", "admin"] },
    { label: "Analytics", icon: BarChart3, path: "/analytics", roles: ["admin"] },
    { label: "AI Chat", icon: MessageCircle, path: "/chat", roles: ["user", "support", "admin"] },
    { label: "Settings", icon: Settings, path: "/settings", roles: ["user", "support", "admin"] },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex-1">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold">Complaint Management</span>
          </Link>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </AvatarFallback>
          {user?.avatar && <AvatarImage src={user.avatar} alt={user?.name || ""} />}
        </Avatar>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:w-64 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="font-bold">Complaint Management</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid gap-1 px-2">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                >
                  <span
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                      window.location.pathname === item.path
                        ? "bg-accent text-accent-foreground"
                        : "transparent"
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
                {user?.avatar && <AvatarImage src={user.avatar} alt={user?.name || ""} />}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name || user?.email}</span>
                <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="container py-6 md:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
