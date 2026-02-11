"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { models } from "@/constants/item-header-items"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { type LucideIcon } from "lucide-react"

export interface AnalyticModel {
  icons: LucideIcon
  name: string
  summary: number | string
  times: string
}

export default function AnalyticsOverviewHeader({ data }: { data: AnalyticModel[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 font-satoshi">
      {data.map((model) => (
        <AnalyticCard
          key={model.name}
          model={model}
        />
      ))}
    </div>
  )
}

function AnalyticCard({
  model,
}: {
  model: AnalyticModel
}) {
  const [timeRange, setTimeRange] = React.useState("Last 7 days")

  return (
    <Card className="rounded-[24px] border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <model.icons className="h-6 w-6" color="var(--arcipta-primary)" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium rounded-xl border-slate-200"
              >
                {timeRange}
                <ChevronDown className="ml-1 h-3 w-3 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl font-satoshi">
              <DropdownMenuItem onClick={() => setTimeRange("Last 24 hours")}>
                Last 24 hours
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("Last 7 days")}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("Last 30 days")}>
                Last 30 days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pt-2">
          {model.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-slate-900 tracking-tight">
          {model.summary}
        </div>
      </CardContent>
    </Card>
  )
}