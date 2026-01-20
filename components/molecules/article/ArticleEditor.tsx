"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ArticleEditorProps {
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
}

export function ArticleEditor({ title, setTitle, content, setContent }: ArticleEditorProps) {
    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 lg:p-12 scrollbar-none">
            <div className="mx-auto max-w-[850px] min-h-[auto] md:min-h-[1100px] bg-white shadow-sm border rounded-sm p-6 md:p-[3cm] flex flex-col gap-8">
                {/* Title area */}
                <Input
                    type="text"
                    placeholder="Article Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-none p-0 text-4xl md:text-5xl font-bold focus-visible:ring-0 placeholder:text-gray-200"
                />

                {/* Content area */}
                <Textarea
                    placeholder="Start writing your article here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 border-none p-0 text-lg leading-relaxed focus-visible:ring-0 resize-none min-h-[500px] placeholder:text-gray-300"
                />
            </div>
        </div>
    );
}
