 import { MessageSquare, Target, Rocket, Users, Trophy } from "lucide-react";
 import { MoneyPlanLogo } from "@/components/brand/MoneyPlanLogo";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Chats", path: "/", icon: MessageSquare },
  { title: "Metas", path: "/metas", icon: Target },
  { title: "Missões", path: "/missoes", icon: Rocket },
  { title: "Personalidades", path: "/personalidades", icon: Users },
  { title: "Conquistas", path: "/conquistas", icon: Trophy },
];

export function NavSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className="border-r border-border/30 bg-sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <MoneyPlanLogo size="md" />
          {!isCollapsed && (
            <h1 className="text-xl font-sans font-bold tracking-tight">
              <span className="text-primary text-glow-emerald">Money</span>
              <span className="text-foreground">Plan</span>
            </h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-muted/50 group"
                  activeClassName="bg-primary/20 text-primary neon-glow-emerald"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
