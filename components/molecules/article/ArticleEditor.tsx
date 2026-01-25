"use client";

import * as React from "react";
import { Editor } from "@tinymce/tinymce-react";

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
                <div className="border-b pb-4">
                    <Editor
                        value={title}
                        onEditorChange={(newContent) => setTitle(newContent)}
                        apiKey="k7l6wxymdavx8maeydx2yo2w2pvaw8oo2b9ados6cp1ju2k8"
                        init={{
                            height: 100,
                            menubar: false,
                            toolbar: false,
                            statusbar: false,
                            placeholder: "Article Title...",
                            content_style: `
                                body { 
                                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
                                    font-size: 2.25rem; 
                                    font-weight: 700; 
                                    line-height: 1.2; 
                                    color: #000;
                                    margin: 0;
                                    padding: 0;
                                    overflow: hidden;
                                }
                                p { margin: 0; }
                            `,
                            forced_root_block: 'h1',
                        }}
                    />
                </div>

                {/* Content area */}
                <div className="flex-1 min-h-[500px]">
                    <Editor
                        value={content}
                        onEditorChange={(newContent) => setContent(newContent)}
                        apiKey="k7l6wxymdavx8maeydx2yo2w2pvaw8oo2b9ados6cp1ju2k8"
                        init={{
                            height: 600,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height: 1.6; }'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
