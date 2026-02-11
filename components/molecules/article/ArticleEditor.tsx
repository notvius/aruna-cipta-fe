"use client";

import { Editor } from "@tinymce/tinymce-react";

interface ArticleEditorProps {
    title: string;
    setTitle: (title: string) => void;
    excerpt: string;
    setExcerpt: (content: string) => void;
    content: string;
    setContent: (content: string) => void;
}

export function ArticleEditor({ title, setTitle, excerpt, setExcerpt, content, setContent }: ArticleEditorProps) {
    return (
        <div className="flex-1 overflow-y-auto scrollbar-none py-8 md:py-12">
            <div className="mx-auto max-w-[900px] min-h-screen bg-white shadow-lg border rounded-sm p-8 md:p-16 flex flex-col gap-6">

                <div className="border-b border-slate-100 pb-2">
                    <Editor
                        value={title}
                        onEditorChange={(newContent) => setTitle(newContent)}
                        apiKey="k7l6wxymdavx8maeydx2yo2w2pvaw8oo2b9ados6cp1ju2k8"
                        init={{
                            height: 80,
                            menubar: false,
                            toolbar: false,
                            statusbar: false,
                            placeholder: "Article Title...",
                            content_style: `
                                body { 
                                    font-family: ui-sans-serif, system-ui; 
                                    font-size: 2.5rem; 
                                    font-weight: 800; 
                                    line-height: 1.1; 
                                    color: #0f172a;
                                    margin: 0;
                                    padding: 0;
                                }
                            `,
                            forced_root_block: 'h1',
                        }}
                    />
                </div>

                <div className="border-b border-slate-100 pb-2">
                    <Editor
                        value={excerpt}
                        onEditorChange={(newContent) => setExcerpt(newContent)}
                        apiKey="k7l6wxymdavx8maeydx2yo2w2pvaw8oo2b9ados6cp1ju2k8"
                        init={{
                            height: 70,
                            menubar: false,
                            toolbar: false,
                            statusbar: false,
                            placeholder: "Article Sub Title...",
                            content_style: `
                                body { 
                                    font-family: ui-sans-serif, system-ui; 
                                    font-size: 1.5rem; 
                                    font-weight: 500; 
                                    line-height: 1.4; 
                                    color: #64748b;
                                    margin: 0;
                                    padding: 0;
                                }
                            `,
                            forced_root_block: 'h2',
                        }}
                    />
                </div>

                <div className="flex-1 min-h-[600px]">
                    <Editor
                        value={content}
                        onEditorChange={(newContent) => setContent(newContent)}
                        apiKey="k7l6wxymdavx8maeydx2yo2w2pvaw8oo2b9ados6cp1ju2k8"
                        init={{
                            height: 700,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height: 1.6; color: #334155; }',
                            statusbar: false,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}