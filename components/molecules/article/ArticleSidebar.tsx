"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Hash, Image as ImageIcon, Check, ChevronsUpDown, Plus } from "lucide-react";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addArticleCategory } from "@/utils/article-category-storage";

export function ArticleSidebar({ category, setCategory, isPublished, setIsPublished, thumbnail, setThumbnail, wordCount, categories = [], onCategoryCreated }: any) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const selectedCategoryName = React.useMemo(() => {
        if (!category || !categories) return "Select category...";
        return categories.find((c: any) => c.id === category)?.name || "Select category...";
    }, [category, categories]);

    const handleCreateCategory = () => {
        if (!searchQuery) return;
        const newCat = addArticleCategory(searchQuery);
        onCategoryCreated();
        setCategory(newCat.id);
        setOpen(false);
        setSearchQuery("");
    };

    const arciptaFocus = "focus-within:ring-2 focus-within:ring-arcipta-blue-primary/20 focus-within:border-arcipta-blue-primary transition-all";

    return (
        <aside className="w-[340px] border-l bg-white flex flex-col h-full font-satoshi shrink-0 overflow-hidden">
            <div className="p-6 space-y-8 overflow-y-auto scrollbar-none">
                
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visibility</p>
                    <div className={cn("flex items-center justify-between p-4 rounded-xl border transition-all duration-300", isPublished ? 'border-arcipta-blue-primary/30 bg-arcipta-blue-primary/[0.02]' : 'border-slate-100 bg-slate-50/50')}>
                        <div className="space-y-0.5">
                            <Label htmlFor="publish" className="text-sm font-bold text-slate-900 cursor-pointer">Published</Label>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{isPublished ? "Public" : "Draft"}</p>
                        </div>
                        <Switch id="publish" checked={isPublished} onCheckedChange={setIsPublished} className="data-[state=checked]:bg-arcipta-blue-primary" />
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</p>
                    <div className={cn(
                        "rounded-xl border transition-all duration-300 group",
                        open 
                            ? "ring-2 ring-arcipta-blue-primary/20 border-arcipta-blue-primary" 
                            : "border-transparent hover:ring-2 hover:ring-arcipta-blue-primary/20 hover:border-arcipta-blue-primary"
                    )}>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    role="combobox" 
                                    aria-expanded={open} 
                                    className="w-full justify-between rounded-xl h-11 border-slate-200 font-medium text-slate-600 focus:ring-0 hover:bg-white hover:text-slate-600 bg-white"
                                >
                                    {selectedCategoryName}
                                    <ChevronsUpDown className={cn(
                                        "ml-2 h-4 w-4 shrink-0 transition-colors",
                                        open ? "text-arcipta-blue-primary" : "opacity-50 group-hover:text-arcipta-blue-primary group-hover:opacity-100"
                                    )} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[290px] p-0 z-[200]">
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
                                                <CommandItem key={c.id} value={c.name} onSelect={() => { setCategory(c.id); setOpen(false); }}>
                                                    <Check className={cn("mr-2 h-4 w-4", category === c.id ? "opacity-100" : "opacity-0")} />
                                                    {c.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thumbnail</p>
                    <div className={cn("rounded-xl overflow-hidden border border-slate-100 bg-slate-50/30 p-1", arciptaFocus)}>
                        <ImageUpload value={thumbnail} onChange={setThumbnail} />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Word Count</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{wordCount} words</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}