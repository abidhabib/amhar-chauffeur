"use client";

import { LayoutDashboard, FileText, Car, Star, Users, History } from "lucide-react";
import { useViewStore, type AdminSection } from "@/stores/view-store";
import { cn } from "@/lib/utils";

const ITEMS: Array<{
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: FileText },
  { id: "fleet", label: "Fleet", icon: Car },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "users", label: "Team", icon: Users },
  { id: "audit", label: "Audit Log", icon: History },
];

export function AdminSidebar() {
  const section = useViewStore((s) => s.adminSection);
  const setSection = useViewStore((s) => s.setAdminSection);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-ink-soft border-r border-foreground/[0.06] z-40 flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center px-7 border-b border-foreground/[0.06]">
        <span className="text-[14px] font-medium tracking-[0.3em] text-foreground">AMHAR</span>
        <span className="ml-2 text-[9px] tracking-[0.24em] uppercase text-foreground/40">
          Operator
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-foreground/35">
          Manage
        </p>
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13px] transition-all duration-250",
                active
                  ? "bg-foreground/[0.06] text-foreground"
                  : "text-foreground/55 hover:text-foreground hover:bg-foreground/[0.03]",
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <Icon
                size={15}
                strokeWidth={1.5}
                className={active ? "text-[#c9a961]" : ""}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-foreground/[0.06]">
        <div className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-foreground/35">
          v1.0 · Quote-based
        </div>
      </div>
    </aside>
  );
}
