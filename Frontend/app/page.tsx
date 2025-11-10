"use client"

import { useState } from "react"
import { Sidebar } from "@/adapters/ui/components/layout/sidebar"
import { Header } from "@/adapters/ui/components/layout/header"
import { RoutesTab } from "@/adapters/ui/components/tabs/routes-tab"
import { ComparisonTab } from "@/adapters/ui/components/tabs/comparison-tab"
import { BankingTab } from "@/adapters/ui/components/tabs/banking-tab"
import { PoolingTab } from "@/adapters/ui/components/tabs/pooling-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [activeTab, setActiveTab] = useState("routes")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="pooling">Pooling</TabsTrigger>
            </TabsList>

            <TabsContent value="routes" className="space-y-4">
              <RoutesTab />
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <ComparisonTab />
            </TabsContent>

            <TabsContent value="banking" className="space-y-4">
              <BankingTab />
            </TabsContent>

            <TabsContent value="pooling" className="space-y-4">
              <PoolingTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
