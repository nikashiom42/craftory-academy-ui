import { LayoutGrid, Users, UserCheck, LogOut, BookOpen } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import craftoryLogo from "@/assets/craftory-logo.png";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutGrid },
  { title: "Courses", url: "/admin/courses", icon: BookOpen },
  { title: "Leads", url: "/admin/leads", icon: UserCheck },
  { title: "Customers", url: "/admin/customers", icon: Users, disabled: true },
];

interface AdminSidebarProps {
  userEmail?: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <img src={craftoryLogo} alt="Craftory Academy" className="h-12 w-auto object-contain" />
        </div>
        {userEmail && (
          <div className="text-xs text-muted-foreground truncate bg-muted/30 px-3 py-2 rounded-md">
            {userEmail}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.disabled ? (
                    <SidebarMenuButton 
                      disabled={item.disabled}
                      className="mb-1 cursor-not-allowed"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded">Soon</span>
                    </SidebarMenuButton>
                  ) : (
                    <NavLink to={item.url} end>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive} className="mb-1">
                          <item.icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
