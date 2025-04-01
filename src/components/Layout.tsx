
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutGrid, 
  Users, 
  Phone, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut 
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile} onOpenChange={setCollapsed}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b h-14 flex items-center px-4 sm:px-6">
            <Button 
              variant="outline" 
              size="icon" 
              className="ml-auto"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const location = useLocation();
  
  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <LayoutGrid className="w-5 h-5" />
    },
    {
      path: "/contacts",
      name: "Contacts",
      icon: <Users className="w-5 h-5" />
    },
    {
      path: "/call-recordings",
      name: "Call Recordings",
      icon: <Phone className="w-5 h-5" />
    },
    {
      path: "/settings",
      name: "Settings",
      icon: <Settings className="w-5 h-5" />
    }
  ];
  
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="px-3 py-2">
          <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">CallHaven</h1>
          <p className="text-xs text-sidebar-foreground/60">CRM with Call Recordings</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <nav className="grid gap-1 px-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent transition-colors",
                location.pathname === item.path 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/80"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <Button 
            variant="outline" 
            className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default Layout;
