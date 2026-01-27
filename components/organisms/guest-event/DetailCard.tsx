"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

interface DetailField {
    label: string;
    value: string | number;
}

interface FunnelStep {
    label: string;
    value: string | number;
}

interface DetailCardProps<T> {
    title: string;
    item: T | null;
    fields: (item: T) => DetailField[];
    funnelSteps?: (item: T) => FunnelStep[];
}

export function DetailCard<T>({ title, item, fields, funnelSteps }: DetailCardProps<T>) {
    if (!item) {
        return (
            <Card className="w-full h-full relative overflow-hidden group transition-all duration-300 hover:border-arcipta-orange/50">
                {/* Hover Animated Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-arcipta-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground italic">
                    Select an item from the table to view details
                </CardContent>
            </Card>
        );
    }

    const itemFields = fields(item);
    const itemFunnelSteps = funnelSteps ? funnelSteps(item) : [];

    return (
        <Card className="w-full h-full relative overflow-hidden group transition-all duration-300 hover:border-arcipta-orange/50">
            {/* Hover Animated Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-arcipta-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {itemFields.map((field, index) => (
                        <div key={index} className="space-y-1">
                            <p className="text-sm text-muted-foreground">{field.label}</p>
                            <p className="text-base font-semibold">{field.value}</p>
                        </div>
                    ))}
                </div>

                {itemFunnelSteps && itemFunnelSteps.length > 0 && (
                    <div className="space-y-4">
                        <Separator />
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Analysis Funnel</p>
                        <div className="flex items-center justify-between gap-4 py-4 px-2 bg-muted/30 rounded-lg">
                            {itemFunnelSteps.map((step, index) => (
                                <div key={index} className="flex items-center gap-4 flex-1">
                                    <div className="text-center flex-1">
                                        <p className="text-sm text-muted-foreground mb-1">{step.label}</p>
                                        <p className="text-xl font-bold">{step.value}</p>
                                    </div>
                                    {index < itemFunnelSteps.length - 1 && (
                                        <ArrowRight className="text-muted-foreground shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
