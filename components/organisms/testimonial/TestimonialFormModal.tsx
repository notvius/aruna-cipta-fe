"use client";

import * as React from "react";
import Cookies from "js-cookie";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Testimonial } from "@/constants/testimonials";

interface TestimonialFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testimonial?: Testimonial | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export function TestimonialFormModal({
    open,
    onOpenChange,
    testimonial,
    onSuccess,
    onError
}: TestimonialFormProps) {
    const [form, setForm] = React.useState({
        client_name: "",
        client_title: "",
        content: ""
    });
    const [isSaving, setIsSaving] = React.useState(false);
    const isEdit = !!testimonial;

    const focusStyles = "focus-visible:ring-1 focus-visible:ring-arcipta-blue-primary/40 focus-visible:border-arcipta-blue-primary/40 transition-all";

    React.useEffect(() => {
        if (open) {
            if (testimonial) {
                setForm({
                    client_name: testimonial.client_name,
                    client_title: testimonial.client_title,
                    content: testimonial.content
                });
            } else {
                setForm({ client_name: "", client_title: "", content: "" });
            }
        }
    }, [open, testimonial]);

    const handleSave = async () => {
        if (!form.client_name.trim() || !form.client_title.trim() || !form.content.trim()) {
            return onError("All fields are required");
        }

        setIsSaving(true);
        const token = Cookies.get("token");

        const url = isEdit
            ? `${process.env.NEXT_PUBLIC_API_URL}/testimonial/${testimonial?.uuid}`
            : `${process.env.NEXT_PUBLIC_API_URL}/testimonial`;

        try {
            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to save data");
            }

            onSuccess(isEdit ? "Testimonial updated!" : "Testimonial created!");
            onOpenChange(false);
        } catch (err: any) {
            onError(err.message || "Connection error.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl font-jakarta bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-outfit uppercase tracking-tight">
                        {isEdit ? "Update Testimonial" : "Add New Testimonial"}
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-slate-500">
                        {isEdit ? "Modifying client feedback" : "Creating a new Testimonial"}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-5">
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Client Name
                        </Label>
                        <Input
                            value={form.client_name}
                            onChange={e => setForm({ ...form, client_name: e.target.value })}
                            className={`rounded-xl h-11 bg-slate-50/50 border-slate-200 ${focusStyles}`}
                            disabled={isSaving}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Position / Company
                        </Label>
                        <Input
                            value={form.client_title}
                            onChange={e => setForm({ ...form, client_title: e.target.value })}
                            className={`rounded-xl h-11 bg-slate-50/50 border-slate-200 ${focusStyles}`}
                            disabled={isSaving}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Client Feedback
                        </Label>
                        <Textarea
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            className={`min-h-[120px] rounded-xl bg-slate-50/50 border-slate-200 resize-none py-3 ${focusStyles}`}
                            disabled={isSaving}
                        />
                    </div>
                </div>
                <DialogFooter className="p-6 pt-0 flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSaving}
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 h-10 px-6 flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-slate-900 text-white rounded-xl h-10 px-8 font-bold text-[10px] uppercase tracking-widest min-w-[120px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                {isEdit ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                {isEdit ? "Update Testimonial" : "Publish Testimonial"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
