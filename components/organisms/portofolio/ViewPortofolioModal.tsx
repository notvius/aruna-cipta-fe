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
import { Eye, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { type Portofolio } from "@/constants/portofolios";
import { type PortofolioOverview } from "@/constants/portofolio_overviews";
import { type PortofolioContent } from "@/constants/portofolios_contents";
import { getPortofolioOverviews } from "@/utils/portofolio-overview-storage";
import { getPortofolioContents } from "@/utils/portofolio-content-storage";
import { getServices } from "@/utils/service-storage";
import { Badge } from "@/components/ui/badge";

interface ViewPortofolioModalProps {
    portofolio: Portofolio;
}

export function ViewPortofolioModal({ portofolio }: ViewPortofolioModalProps) {
    const [overview, setOverview] = React.useState<PortofolioOverview | null>(null);
    const [content, setContent] = React.useState<PortofolioContent | null>(null);
    const [categoryName, setCategoryName] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setIsLoading(true);
            // Fetch related data
            const overviews = getPortofolioOverviews();
            const contents = getPortofolioContents();
            const services = getServices();

            const foundOverview = overviews.find(o => o.portofolio_id === portofolio.id);
            const foundContent = contents.find(c => c.portofolio_id === portofolio.id);

            // Resolve category name
            const catIds = portofolio.category;
            const catId = Array.isArray(catIds) ? catIds[0] : catIds;
            const foundService = services.find(s => String(s.id) === String(catId));

            setOverview(foundOverview || null);
            setContent(foundContent || null);
            setCategoryName(foundService?.title || (catId ? `Service ${catId}` : "-"));

            setIsLoading(false);
        }
    }, [open, portofolio.id, portofolio.category]);

    function formatDate(date: Date | string | null | undefined): string {
        if (!date) return "—";
        const parsedDate = date instanceof Date ? date : new Date(date);
        if (isNaN(parsedDate.getTime())) return "Invalid date";

        return parsedDate.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-arcipta-blue-primary hover:text-arcipta-blue-primary/90"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Portfolio Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
                        {/* Column 1: Image & Meta (4 cols) */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Thumbnail</Label>
                                <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm border bg-muted">
                                    <img
                                        src={portofolio.thumbnail}
                                        alt={portofolio.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6 pt-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Client</Label>
                                        <p className="text-sm font-semibold text-foreground">{portofolio.client_name || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Year</Label>
                                        <p className="text-sm font-semibold text-foreground">{portofolio.year || "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                                        <div>
                                            <Badge className="bg-arcipta-blue-primary/10 text-arcipta-blue-primary hover:bg-arcipta-blue-primary/20 border-none px-3 py-1 text-[10px] font-bold">
                                                {categoryName}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 pt-4 border-dashed">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Created At</Label>
                                        <p className="text-xs text-foreground font-medium">{formatDate(portofolio.created_at)}</p>
                                    </div>
                                    <div className="space-y-1 pt-4 border-dashed">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Updated At</Label>
                                        <p className="text-xs text-foreground font-medium">{formatDate(portofolio.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2 & 3: Details (8 cols) */}
                        <div className="lg:col-span-8 space-y-10">
                            <div className="space-y-2 pb-6 border-b">
                                <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Project Title</Label>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border font-semibold">
                                    {portofolio.title}
                                </div>
                            </div>

                            {/* Overview Section */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1 h-4 bg-arcipta-blue-primary rounded-full"></span>
                                    Overview
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Role</Label>
                                        <div className="text-sm leading-relaxed text-foreground bg-muted/30 p-4 rounded-lg border italic text-muted-foreground/80 font-medium capitalize">
                                            {overview?.role || "-"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Problem</Label>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                            {overview?.problem || "-"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Solution</Label>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                            {overview?.solution || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Context Section */}
                            <div className="space-y-6 pt-6">
                                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1 h-4 bg-arcipta-blue-primary rounded-full"></span>
                                    Context & Process
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Context</Label>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                            {content?.context || "-"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Challenge</Label>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                            {content?.challenge || "-"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Approach</Label>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                            {content?.approach || "-"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Impact</Label>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                            {content?.impact || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Process Images */}
                            {content?.image_process && content.image_process.length > 0 && (content.image_process[0] || content.image_process[1]) && (
                                <div className="space-y-4 pt-8">
                                    <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Process Images</Label>
                                    <div className="grid grid-cols-2 gap-6">
                                        {content.image_process.map((img, idx) => img ? (
                                            <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden border shadow-sm group cursor-zoom-in">
                                                <img
                                                    src={img}
                                                    alt={`Process ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                                            </div>
                                        ) : null)}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                )}
            </DialogContent>
        </Dialog>
    );
}
