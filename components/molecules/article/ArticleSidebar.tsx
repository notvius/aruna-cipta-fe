"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Plus, Eye, Tag, Image, FileText } from "lucide-react";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function ArticleSidebar({ category, setCategory, isPublished, setIsPublished, thumbnail, setThumbnail, wordCount, categories = [], onCategoryCreated }: any) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const selectedCategoryName = React.useMemo(() => {
        if (!category) return "Select category...";
        return categories.find((c: any) => c.id.toString() === category.toString())?.name || "Select category...";
    }, [category, categories]);

    const handleCreateCategory = async () => {
        if (!searchQuery) return;
        const token = Cookies.get("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article-category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: searchQuery })
            });
            const data = await res.json();
            if (res.ok) {
                await onCategoryCreated();
                setCategory(data.id);
                setOpen(false);
                setSearchQuery("");
            }
        } catch (err) {
            console.error("Failed to create category");
        }
    };

    return (
        <aside className="w-[340px] border-l bg-white flex flex-col h-full shrink-0 overflow-hidden">
            <div className="p-6 space-y-8 overflow-y-auto scrollbar-none">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <Eye className="size-3.5" /> Visibility
                    </p>
                    <div className={cn("flex items-center justify-between p-4 rounded-xl border transition-all", isPublished ? 'border-arcipta-blue-primary/30 bg-arcipta-blue-primary/[0.02]' : 'border-slate-100 bg-slate-50/50')}>
                        <div className="space-y-0.5">
                            <Label htmlFor="publish" className="text-sm font-bold text-slate-900 cursor-pointer">Published</Label>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{isPublished ? "Public" : "Draft"}</p>
                        </div>
                        <Switch
                            id="publish"
                            checked={isPublished}
                            onCheckedChange={setIsPublished}
                            className="data-[state=checked]:bg-arcipta-blue-primary"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <Tag className="size-3.5" /> Category
                    </p>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between rounded-xl h-11 border-slate-200 text-slate-600 bg-white">
                                {selectedCategoryName}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[290px] p-0 z-[200] bg-white border-slate-100 shadow-xl rounded-xl">
                            <Command>
                                <CommandInput placeholder="Search or create..." value={searchQuery} onValueChange={setSearchQuery} />
                                <CommandList>
                                    <CommandEmpty className="p-2">
                                        <Button onClick={handleCreateCategory} variant="ghost" className="w-full justify-start text-arcipta-blue-primary font-bold">
                                            <Plus className="mr-2 h-4 w-4" /> Add "{searchQuery}"
                                        </Button>
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {categories.map((c: any) => (
                                            <CommandItem key={c.id} onSelect={() => { setCategory(c.id); setOpen(false); }}>
                                                <Check className={cn("mr-2 h-4 w-4", category?.toString() === c.id.toString() ? "opacity-100" : "opacity-0")} />
                                                {c.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <Image className="size-3.5" /> Thumbnail
                    </p>
                    <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50/30 p-1">
                        <ImageUpload value={thumbnail} onChange={setThumbnail} />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <FileText className="size-3.5" /> Word Count
                    </span>
                    <span className="text-xs font-bold text-slate-900">{wordCount} words</span>
                </div>
            </div>
        </aside>
    );
}