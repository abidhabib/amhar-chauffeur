"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";
import { ROLE_META, USER_ROLES, type UserRole } from "@/lib/user-roles";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: string;
  _count: { assignedLeads: number; activities: number; notes: number };
}

export function AdminUsers() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await api.listUsers();
      setItems(items);
    } catch (e) {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const setRole = async (u: User, role: UserRole) => {
    try {
      await api.updateUser(u.id, { role });
      setItems((l) => l.map((x) => (x.id === u.id ? { ...x, role } : x)));
      toast.success(`${u.name} is now ${ROLE_META[role].label}`);
    } catch (e) {
      toast.error("Failed to update role");
    }
  };

  const toggleActive = async (u: User) => {
    try {
      await api.updateUser(u.id, { isActive: !u.isActive });
      setItems((l) => l.map((x) => (x.id === u.id ? { ...x, isActive: !u.isActive } : x)));
      toast.success(u.isActive ? "User deactivated" : "User activated");
    } catch (e) {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-light text-foreground tracking-tight">Team</h1>
        <p className="text-[13px] text-foreground/50 mt-1">
          Manage operator accounts and access levels.
        </p>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {USER_ROLES.map((r) => (
          <div key={r} className="p-4 rounded-sm border border-foreground/[0.06] bg-card">
            <p className="text-[12px] font-medium text-foreground mb-1">{ROLE_META[r].label}</p>
            <p className="text-[11px] text-foreground/50 leading-relaxed">
              {ROLE_META[r].description}
            </p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-foreground/40 text-sm">Loading team…</div>
      ) : (
        <div className="rounded-sm border border-foreground/[0.06] bg-card overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-foreground/[0.06] bg-foreground/[0.02]">
                <th className="text-left px-5 py-3 text-[10px] tracking-[0.16em] uppercase text-foreground/45 font-medium">Member</th>
                <th className="text-left px-5 py-3 text-[10px] tracking-[0.16em] uppercase text-foreground/45 font-medium">Role</th>
                <th className="text-left px-5 py-3 text-[10px] tracking-[0.16em] uppercase text-foreground/45 font-medium">Leads</th>
                <th className="text-left px-5 py-3 text-[10px] tracking-[0.16em] uppercase text-foreground/45 font-medium">Activity</th>
                <th className="text-left px-5 py-3 text-[10px] tracking-[0.16em] uppercase text-foreground/45 font-medium">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/[0.04]">
              {items.map((u) => (
                <tr key={u.id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-foreground/[0.06] border border-foreground/10 flex items-center justify-center text-[11px] font-medium text-foreground/70">
                        {u.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-foreground font-medium">{u.name}</div>
                        <div className="text-[11px] text-foreground/45">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => setRole(u, e.target.value as UserRole)}
                      className="h-8 px-2 bg-transparent border border-foreground/10 rounded-sm text-[12px] text-foreground focus:outline-none focus:border-[#c9a961]"
                    >
                      {USER_ROLES.map((r) => (
                        <option key={r} value={r} className="bg-background">
                          {ROLE_META[r].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-foreground/70">{u._count.assignedLeads}</td>
                  <td className="px-5 py-4 text-foreground/70">{u._count.activities}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase",
                        u.isActive ? "text-emerald-400" : "text-foreground/40",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          u.isActive ? "bg-emerald-400" : "bg-foreground/30",
                        )}
                      />
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => toggleActive(u)}
                      className="text-[11px] tracking-[0.14em] uppercase text-foreground/55 hover:text-foreground transition-colors"
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
