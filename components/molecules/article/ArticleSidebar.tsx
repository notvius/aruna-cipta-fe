"use client";

import { ArticleCategory } from "@/constants/article_category";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    isPublished: boolean;
    setIsPublished: (isPublished: boolean) => void;
    thumbnail: string;
    setThumbnail: (thumbnail: string) => void;
    wordCount: number;
    categories: ArticleCategory[];
    className?: string;
}

export function ArticleSidebar({
    category,
    setCategory,
    isPublished,
    setIsPublished,
    thumbnail,
    setThumbnail,
    wordCount,
    categories,
    className,
}: ArticleSidebarProps) {
    const selectedCategoryName = categories.find((c) => c.id === category)?.name || "Select Category";

    return (
        <div className={className || "w-80 border-l bg-white h-full hidden xl:flex flex-col overflow-y-auto px-4 py-3 gap-3"}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Settings</h3>

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
                                    <Badge variant={isPublished ? "default" : "secondary"}>
                                        {isPublished ? "Published" : "Unpublished"}
                                    </Badge>
                                </span>
                                <ChevronDown className="size-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-72">
                            <DropdownMenuItem onClick={() => setIsPublished(true)}>Published</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsPublished(false)}>Unpublished</DropdownMenuItem>
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
                                {selectedCategoryName}
                                <ChevronDown className="size-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-72">
                            {categories.map((cat) => (
                                <DropdownMenuItem key={cat.id} onClick={() => setCategory(cat.id)}>
                                    {cat.name}
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
                    <ImageUpload
                        value={thumbnail}
                        onChange={setThumbnail}
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

