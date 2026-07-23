import { logoutAction } from "@/lib/auth-actions";
import { BarChart3, Users, FolderOpen, FileText, LogOut, Bell } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-border-color px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A3FF] to-[#004385] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <span className="font-bold font-heading text-secondary">HawkEdge</span>
          <span className="text-border-color mx-1">|</span>
          <span className="text-sm text-foreground/60">Team Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-light-gray text-foreground/60 hover:text-foreground transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-light-gray">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-heading text-secondary">Team Dashboard</h1>
          <p className="text-foreground/60 mt-1">Manage projects, clients, and operations.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Active Projects", value: "0", icon: FolderOpen, color: "text-blue-600 bg-blue-50" },
            { label: "Total Clients", value: "0", icon: Users, color: "text-purple-600 bg-purple-50" },
            { label: "Leads", value: "0", icon: BarChart3, color: "text-emerald-600 bg-emerald-50" },
            { label: "Quotations", value: "0", icon: FileText, color: "text-amber-600 bg-amber-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border-color p-5">
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div className="text-2xl font-bold font-heading text-secondary">{stat.value}</div>
              <div className="text-xs text-foreground/60 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border-color p-8 text-center">
          <p className="text-foreground/50 text-sm">Your dashboard is being set up. Check back soon!</p>
        </div>
      </main>
    </div>
  );
}
