"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { models } from "@/constants/item-header-items"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function AnalyticsOverviewHeader() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {models.map((model) => (
        <AnalyticCard key={model.name} model={model} />
      ))}
    </div>
  )
}

function AnalyticCard({
  model,
}: {
  model: (typeof models)[number]
}) {
  const [timeRange, setTimeRange] = React.useState("Last 7 days")

  return (
    <Card className="gap-2">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <model.icons className="h-6 w-6 text-muted-foreground" color="var(--arcipta-primary)" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-normal"
              >
                {timeRange}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
        <CardTitle className="text-sm font-medium pb-0">
          {model.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pt-0 text-2xl font-bold">{model.summary}</div>
      </CardContent>
    </Card>
  )
}
