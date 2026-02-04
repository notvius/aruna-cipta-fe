"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getArticleCategories } from "@/utils/article-category-storage";

export function ArticleFilter({ globalFilter, setGlobalFilter, catFilter, onModuleChange, dateRange, onDateChange, onReset }: any) {
    const categories = getArticleCategories();
    const focusStyles = "focus-visible:ring-1 focus-visible:ring-arcipta-blue-primary/40 focus-visible:border-arcipta-blue-primary/40 transition-all";
    const elementHeight = "h-10"; 

    return (
        <div className="mt-8 mb-4 font-satoshi w-full">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end w-full">
                
                <div className="md:col-span-3 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Search Article</p>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Title or content..." 
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className={`pl-10 ${elementHeight} rounded-lg border-slate-200 bg-white ${focusStyles}`}
                        />
                    </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Category</p>
                    <Select value={catFilter} onValueChange={onModuleChange}>
                        <SelectTrigger className={`${elementHeight} rounded-lg border-slate-200 bg-white ${focusStyles}`}>
                            <SelectValue placeholder="All Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Category</SelectItem>
                            {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-4 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Start Date</p>
                        <Input 
                            type="date" 
                            value={dateRange.start} 
                            className={`${elementHeight} rounded-lg border-slate-200 bg-white ${focusStyles}`} 
                            onChange={(e) => onDateChange('start', e.target.value)} 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">End Date</p>
                        <Input 
                            type="date" 
                            value={dateRange.end} 
                            className={`${elementHeight} rounded-lg border-slate-200 bg-white ${focusStyles}`} 
                            onChange={(e) => onDateChange('end', e.target.value)} 
                        />
                    </div>
                </div>

                <div className="md:col-span-2 flex gap-2">
                    <Button 
                        className={`${elementHeight} w-full bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90 text-white rounded-lg shadow-sm transition-all active:scale-95`} 
                        onClick={onReset}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}