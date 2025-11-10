"use client"

import { LayoutGrid, Compass as Compare, Banknote, Layers, ShieldCheck } from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: "tab1" | "tab2" | "tab3" | "tab4") => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "tab1", label: "Routes Baseline", icon: LayoutGrid },
    { id: "tab2", label: "Comparison", icon: Compare },
    { id: "tab3", label: "Compliance Bank", icon: Banknote },
    { id: "tab4", label: "Pooling", icon: Layers },
  ]

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-slate-900 text-white grid place-items-center text-sm tracking-tight font-semibold">
            CB
          </div>
          <div className="font-semibold tracking-tight text-lg">Compliance</div>
        </div>
      </div>

      <nav className="px-2 py-3 flex-1">
        <div className="text-xs uppercase tracking-wide text-gray-500 px-3 mb-2">Navigation</div>
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium outline outline-1 outline-transparent transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900 outline-gray-300"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <IconComponent className="w-4.5 h-4.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto px-4 py-4 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        <span>v1.0 • All data mock</span>
      </div>
    </aside>
  )
}
