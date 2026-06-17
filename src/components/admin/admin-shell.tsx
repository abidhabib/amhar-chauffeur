"use client";

import { useEffect } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminDashboard } from "./dashboard";
import { AdminLeads } from "./leads-table";
import { AdminFleet } from "./fleet-manager";
import { AdminReviews } from "./reviews-moderation";
import { AdminUsers } from "./user-control";
import { AdminAuditLog } from "./audit-log";
import { useViewStore } from "@/stores/view-store";
import { useActorStore } from "@/stores/actor-store";
import { api, setActorId } from "@/lib/api-client";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function AdminShell() {
  const section = useViewStore((s) => s.adminSection);
  const openLanding = useViewStore((s) => s.openLanding);
  const setActor = useActorStore((s) => s.setActor);

  // On mount: fetch the first super_admin and set as actor (mock auth)
  useEffect(() => {
    (async () => {
      try {
        const { items } = await api.listUsers();
        const admin =
          items.find((u: any) => u.role === "super_admin" && u.isActive) ||
          items.find((u: any) => u.role === "manager" && u.isActive) ||
          items[0];
        if (admin) {
          setActorId(admin.id);
          setActor({ id: admin.id, name: admin.name, role: admin.role });
        }
      } catch (e) {
        console.error("[AdminShell] failed to load actor", e);
      }
    })();
  }, [setActor]);

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />

      <main className="flex-1 min-w-0 ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 px-8 flex items-center justify-between border-b border-foreground/[0.06] bg-background/85 backdrop-blur-xl">
          <button
            onClick={openLanding}
            className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-foreground/55 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back to site
          </button>
          <ActorBadge />
        </header>

        <motion.div
          key={section}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="p-8"
        >
          {section === "dashboard" && <AdminDashboard />}
          {section === "leads" && <AdminLeads />}
          {section === "fleet" && <AdminFleet />}
          {section === "reviews" && <AdminReviews />}
          {section === "users" && <AdminUsers />}
          {section === "audit" && <AdminAuditLog />}
        </motion.div>
      </main>
    </div>
  );
}

function ActorBadge() {
  const name = useActorStore((s) => s.actorName);
  const role = useActorStore((s) => s.actorRole);
  if (!name) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-[12px] text-foreground font-medium">{name}</div>
        <div className="text-[10px] tracking-[0.18em] uppercase text-foreground/45">
          {role?.replace("_", " ")}
        </div>
      </div>
      <div className="w-9 h-9 rounded-full bg-foreground/[0.08] border border-foreground/10 flex items-center justify-center text-[11px] font-medium text-foreground/70">
        {name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
    </div>
  );
}
