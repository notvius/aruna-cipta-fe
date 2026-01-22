"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { type Service } from "@/constants/services";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";

interface ViewServiceModalProps {
    service: Service;
}

export function ViewServiceModal({ service }: ViewServiceModalProps) {
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-arcipta-blue-primary hover:text-arcipta-blue-primary/90"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Service Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Title</span>
                            <p className="text-sm leading-relaxed text-foreground font-medium">
                                {service.title}
                            </p>
                        </div>

                        {/* Icon & Status */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div className="flex flex-col gap-2 text-muted-foreground">
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Icon</span>
                                <div className="flex items-center gap-2 text-foreground">
                                    <DynamicIcon name={service.icon} className="h-5 w-5" />
                                    <span className="text-sm">{service.icon}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 text-muted-foreground">
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                                <div>
                                    <Badge
                                        className={service.status.toLowerCase() === 'published' ? 'bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90' : ''}
                                        variant={service.status.toLowerCase() === 'published' ? 'default' : 'secondary'}
                                    >
                                        {service.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Featured Image</span>
                            <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border bg-muted">
                                <img
                                    src={service.featured_image}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div className="flex flex-col gap-1 text-muted-foreground">
                                <span className="text-sm font-semibold uppercase tracking-wider text-[10px]">Created At</span>
                                <p className="text-xs text-foreground">{formatDate(service.createdAt)}</p>
                            </div>
                            <div className="flex flex-col gap-1 text-muted-foreground">
                                <span className="text-sm font-semibold uppercase tracking-wider text-[10px]">Updated At</span>
                                <p className="text-xs text-foreground">{formatDate(service.updatedAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2 pt-2 md:border-t text-muted-foreground h-full">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content Description</span>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border h-full">
                            {service.content}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
