"use client"

import { Target, Bell } from "lucide-react"

 export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xl font-semibold tracking-tight">GHG Compliance Workspace</div>
          <span className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            Demo
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>Target 2025: 89.3368 gCO₂e/MJ</span>
          </div>
          <button className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 outline outline-1 outline-transparent focus:outline-gray-300 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </button>
        </div>
      </div>
    </header>
  )
}
