"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Image as ImageIcon, Info, Type, Plus } from "lucide-react";

interface ArticleSidebarProps {
    category: string;
    setCategory: (category: string) => void;
    status: "Published" | "Unpublished";
    setStatus: (status: "Published" | "Unpublished") => void;
    thumbnail: string;
    setThumbnail: (thumbnail: string) => void;
    wordCount: number;
    className?: string;
}

export function ArticleSidebar({
    category,
    setCategory,
    status,
    setStatus,
    thumbnail,
    setThumbnail,
    wordCount,
    className,
}: ArticleSidebarProps) {
    const categories = ["Development", "Design", "Technology", "Tutorial", "Methodology"];

    return (
        <div className={className || "w-80 border-l bg-white h-full hidden xl:flex flex-col overflow-y-auto p-4 gap-1"}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Settings</h3>

            {/* Status Section */}
            <Card className="border-none shadow-none">
                <CardHeader className="p-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Info className="size-4 text-arcipta-blue-primary" />
                        Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                <span className="flex items-center gap-2">
                                    <Badge variant={status === "Published" ? "default" : "secondary"}>
                                        {status}
                                    </Badge>
                                </span>
                                <ChevronDown className="size-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-72">
                            <DropdownMenuItem onClick={() => setStatus("Published")}>Published</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatus("Unpublished")}>Unpublished</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardContent>
            </Card>

            {/* Category Section */}
            <Card className="border-none shadow-none">
                <CardHeader className="p-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Type className="size-4 text-arcipta-blue-primary" />
                        Category
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                {category || "Select Category"}
                                <ChevronDown className="size-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-72">
                            {categories.map((cat) => (
                                <DropdownMenuItem key={cat} onClick={() => setCategory(cat)}>
                                    {cat}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardContent>
            </Card>

            {/* Thumbnail Section */}
            <Card className="border-none shadow-none">
                <CardHeader className="p-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <ImageIcon className="size-4 text-arcipta-blue-primary" />
                        Thumbnail
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-3">
                    {thumbnail ? (
                        <div className="relative aspect-video rounded-md overflow-hidden border group">
                            <img src={thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="secondary" size="sm" onClick={() => setThumbnail("")}>
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full h-24 border-dashed flex flex-col gap-2 text-muted-foreground hover:text-arcipta-blue-primary hover:border-arcipta-blue-primary transition-colors"
                            onClick={() => setThumbnail("/images/logo_arcipta.png")}
                        >
                            <Plus className="size-4" />
                            Upload Image
                        </Button>
                    )}
                    <Input
                        placeholder="Paste image URL here..."
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        className="text-xs"
                    />
                </CardContent>
            </Card>

            {/* Stats Section */}
            <div className="mt-auto border-t pt-6 px-2 space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                        <Type className="size-4" />
                        Words
                    </span>
                    <span className="font-medium">{wordCount}</span>
                </div>
            </div>
        </div>
    );
}

