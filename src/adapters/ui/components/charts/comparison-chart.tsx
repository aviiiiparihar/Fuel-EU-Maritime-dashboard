"use client"

import { useRef, useEffect } from "react"
import type { Route } from "@/core/domain/entities/route"

interface ComparisonChartProps {
  routes: Route[]
  baselineId: string
  targetIntensity: number
  onBarClick: (routeId: string) => void
}

export function ComparisonChart({ routes, baselineId, targetIntensity, onBarClick }: ComparisonChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const width = svg.clientWidth || 800
    const height = svg.clientHeight || 400
    const padding = { top: 20, right: 24, bottom: 40, left: 48 }
    const innerW = width - padding.left - padding.right
    const innerH = height - padding.top - padding.bottom

    const maxVal = Math.max(...routes.map((r) => r.ghgIntensity), targetIntensity) * 1.08

    svg.innerHTML = ""

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    g.setAttribute("transform", `translate(${padding.left},${padding.top})`)
    svg.appendChild(g)

    const yScale = (val: number) => innerH - (val / maxVal) * innerH
    const xStep = innerW / routes.length

    for (let i = 0; i <= 5; i++) {
      const y = innerH - (i / 5) * innerH
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", "0")
      line.setAttribute("x2", String(innerW))
      line.setAttribute("y1", String(y))
      line.setAttribute("y2", String(y))
      line.setAttribute("stroke", "#e5e7eb")
      line.setAttribute("stroke-width", "1")
      g.appendChild(line)

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
      label.setAttribute("x", "-8")
      label.setAttribute("y", String(y + 4))
      label.setAttribute("text-anchor", "end")
      label.setAttribute("font-size", "10")
      label.setAttribute("fill", "#6b7280")
      label.textContent = (maxVal * (i / 5)).toFixed(1)
      g.appendChild(label)
    }

    const thY = yScale(targetIntensity)
    const th = document.createElementNS("http://www.w3.org/2000/svg", "line")
    th.setAttribute("x1", "0")
    th.setAttribute("x2", String(innerW))
    th.setAttribute("y1", String(thY))
    th.setAttribute("y2", String(thY))
    th.setAttribute("stroke-dasharray", "6 6")
    th.setAttribute("stroke", "#ef4444")
    th.setAttribute("stroke-width", "2")
    g.appendChild(th)

    routes.forEach((r, idx) => {
      const isBaseline = r.routeId === baselineId
      const compliant = r.ghgIntensity < targetIntensity
      const barW = Math.min(48, xStep * 0.6)
      const barX = idx * xStep + (xStep - barW) / 2
      const barH = innerH - yScale(r.ghgIntensity)
      const barY = yScale(r.ghgIntensity)

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      rect.setAttribute("x", String(barX))
      rect.setAttribute("y", String(barY))
      rect.setAttribute("width", String(barW))
      rect.setAttribute("height", String(Math.max(1, barH)))
      rect.setAttribute("rx", "4")
      rect.setAttribute("fill", isBaseline ? "#3b82f6" : compliant ? "#22c55e" : "#ef4444")
      rect.setAttribute("stroke", isBaseline ? "#1d4ed8" : compliant ? "#16a34a" : "#dc2626")
      rect.style.cursor = "pointer"
      rect.addEventListener("mouseenter", () => rect.setAttribute("opacity", "0.9"))
      rect.addEventListener("mouseleave", () => rect.setAttribute("opacity", "1"))
      rect.addEventListener("click", () => onBarClick(r.routeId))
      g.appendChild(rect)

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
      label.setAttribute("x", String(barX + barW / 2))
      label.setAttribute("y", String(innerH + 16))
      label.setAttribute("text-anchor", "middle")
      label.setAttribute("font-size", "12")
      label.setAttribute("fill", "#374151")
      label.textContent = r.routeId
      g.appendChild(label)

      const val = document.createElementNS("http://www.w3.org/2000/svg", "text")
      val.setAttribute("x", String(barX + barW / 2))
      val.setAttribute("y", String(barY - 6))
      val.setAttribute("text-anchor", "middle")
      val.setAttribute("font-size", "11")
      val.setAttribute("fill", "#374151")
      val.textContent = r.ghgIntensity.toFixed(1)
      g.appendChild(val)
    })
  }, [routes, baselineId, targetIntensity])

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-full" style={{ minHeight: "400px" }} />
      <div className="absolute top-2 right-3 text-xs text-gray-500">Threshold 89.3368</div>
    </div>
  )
}
