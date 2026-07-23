import { logoutAction } from "@/lib/auth-actions";
import { BarChart3, Users, FolderOpen, FileText, LogOut, Bell, Shield, Settings } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#020B18]">
      <header className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A3FF] to-[#004385] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <span className="font-bold font-heading text-white">HawkEdge</span>
          <span className="text-white/20 mx-1">|</span>
          <span className="text-sm text-white/50 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00A3FF]" /> Admin Console
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 ml-1">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-heading text-white">Admin Dashboard</h1>
          <p className="text-[#8BA6C1] mt-1">Full system overview and controls.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Active Projects", value: "0", icon: FolderOpen, color: "text-[#00A3FF] bg-[#00A3FF]/10" },
            { label: "Total Users", value: "0", icon: Users, color: "text-purple-400 bg-purple-400/10" },
            { label: "New Leads", value: "0", icon: BarChart3, color: "text-emerald-400 bg-emerald-400/10" },
            { label: "Invoices", value: "0", icon: FileText, color: "text-amber-400 bg-amber-400/10" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div className="text-2xl font-bold font-heading text-white">{stat.value}</div>
              <div className="text-xs text-[#8BA6C1] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
          <p className="text-[#4A6A8A] text-sm">Admin console modules are being configured.</p>
        </div>
      </main>
    </div>
  );
}
