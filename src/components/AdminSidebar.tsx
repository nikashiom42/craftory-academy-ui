import { LayoutGrid, Users, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Courses", url: "/admin", icon: LayoutGrid },
  { title: "Customers", url: "/admin/customers", icon: Users, disabled: true },
];

interface AdminSidebarProps {
  userEmail?: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getNavClass = (isActive: boolean) =>
    isActive 
      ? "bg-primary text-primary-foreground font-semibold" 
      : "hover:bg-muted";

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-6">
        <h2 className="text-xl font-bold text-foreground">Admin Dashboard</h2>
        {userEmail && (
          <p className="text-xs text-muted-foreground mt-1">{userEmail}</p>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    disabled={item.disabled}
                    className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {item.disabled ? (
                      <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                        <span className="ml-auto text-xs">(Soon)</span>
                      </div>
                    ) : (
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) => getNavClass(isActive)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
