import { logoutAction } from "@/lib/auth-actions";
import { LayoutDashboard, LogOut, Settings, Users, FolderOpen, FileText } from "lucide-react";

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top bar */}
      <header className="bg-white border-b border-border-color px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A3FF] to-[#004385] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <span className="font-bold font-heading text-secondary">HawkEdge</span>
          <span className="text-border-color mx-1">|</span>
          <span className="text-sm text-foreground/60">Client Workspace</span>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-light-gray">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </form>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-heading text-secondary">Your Workspace</h1>
          <p className="text-foreground/60 mt-1">Welcome! Your projects and files are here.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: FolderOpen, label: "Projects", count: "0 active", color: "text-blue-600 bg-blue-50" },
            { icon: FileText, label: "Quotations", count: "0 pending", color: "text-purple-600 bg-purple-50" },
            { icon: Settings, label: "Settings", count: "Profile & security", color: "text-gray-600 bg-gray-50" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-border-color p-6 hover-elevate cursor-pointer">
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-secondary font-heading">{item.label}</h3>
              <p className="text-sm text-foreground/60 mt-0.5">{item.count}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-[#004385] to-[#00A3FF] rounded-2xl p-8 text-white">
          <h2 className="text-xl font-bold font-heading mb-2">Get started with HawkEdge</h2>
          <p className="text-white/80 text-sm">Your account is ready. Our team will be in touch shortly to kick off your project.</p>
        </div>
      </main>
    </div>
  );
}
