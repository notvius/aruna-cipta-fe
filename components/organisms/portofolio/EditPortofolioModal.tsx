"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { DualImageUpload } from "@/components/molecules/gallery/DualImageUpload";
import { getPortofolioOverviews, savePortofolioOverviews } from "@/utils/portofolio-overview-storage";
import { getPortofolioContents, savePortofolioContents } from "@/utils/portofolio-content-storage";
import { type Portofolio } from "@/constants/portofolios";
import { type PortofolioOverview } from "@/constants/portofolio_overviews";
import { type PortofolioContent } from "@/constants/portofolios_contents";
import { Loader2, ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { getServices } from "@/utils/service-storage";
import { type Service } from "@/constants/services";

interface EditPortofolioModalProps {
    portofolio: Portofolio;
    onSave: (updatedPortofolio: Portofolio) => void;
}

export function EditPortofolioModal({
    portofolio,
    onSave,
}: EditPortofolioModalProps) {
    const [open, setOpen] = React.useState(false);
    const [step, setStep] = React.useState(1);
    const [isSaving, setIsSaving] = React.useState(false);

    // Step 1: Meta Data
    const [thumbnail, setThumbnail] = React.useState(portofolio.thumbnail);
    const [title, setTitle] = React.useState(portofolio.title);
    const [client_name, setClientName] = React.useState(portofolio.client_name);
    const [year, setYear] = React.useState(portofolio.year);
    const [category, setCategory] = React.useState<string>(String(portofolio.category[0] || ""));
    const [categories, setCategories] = React.useState<Service[]>([]);

    // Step 2: Overview
    const [problem, setProblem] = React.useState("");
    const [solution, setSolution] = React.useState("");
    const [role, setRole] = React.useState("");
    const [overviewId, setOverviewId] = React.useState<number | null>(null);

    // Step 3: Context
    const [context, setContext] = React.useState("");
    const [challenge, setChallenge] = React.useState("");
    const [approach, setApproach] = React.useState("");
    const [image_process, setImageProcess] = React.useState<string[]>([]);
    const [impact, setImpact] = React.useState("");
    const [contentId, setContentId] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (open) {
            setCategories(getServices());

            const overviews = getPortofolioOverviews();
            const contents = getPortofolioContents();

            const foundOverview = overviews.find(o => o.portofolio_id === portofolio.id);
            const foundContent = contents.find(c => c.portofolio_id === portofolio.id);

            if (foundOverview) {
                setOverviewId(foundOverview.id);
                setProblem(foundOverview.problem);
                setSolution(foundOverview.solution);
                setRole(foundOverview.role);
            }

            if (foundContent) {
                setContentId(foundContent.id);
                setContext(foundContent.context);
                setChallenge(foundContent.challenge);
                setApproach(foundContent.approach);
                setImageProcess(foundContent.image_process || []);
                setImpact(foundContent.impact);
            }
        }
    }, [open, portofolio.id]);

    const handleNext = () => {
        if (step === 1) {
            if (!thumbnail.trim()) return alert("Please upload a thumbnail");
            if (!title.trim()) return alert("Please enter a title");
            if (!category) return alert("Please select a category");
        }
        setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const now = new Date();

        // 1. Update Portofol
        const updatedPortofolio: Portofolio = {
            ...portofolio,
            thumbnail,
            title,
            client_name,
            year,
            category: [Number(category)],
            updated_at: now,
        };

        // 2. Update Overview directly to storage
        const overviews = getPortofolioOverviews();
        let newOverviews = [...overviews];
        if (overviewId) {
            newOverviews = newOverviews.map(o => o.id === overviewId ? {
                ...o,
                problem,
                solution,
                role
            } : o);
        } else {
            // Create if missing
            newOverviews.push({
                id: Date.now(),
                portofolio_id: portofolio.id,
                problem,
                solution,
                role
            });
        }
        savePortofolioOverviews(newOverviews);

        // 3. Update Content directly to storage
        const contents = getPortofolioContents();
        let newContents = [...contents];
        if (contentId) {
            newContents = newContents.map(c => c.id === contentId ? {
                ...c,
                context,
                challenge,
                approach,
                image_process,
                impact
            } : c);
        } else {
            newContents.push({
                id: Date.now() + 1,
                portofolio_id: portofolio.id,
                context,
                challenge,
                approach,
                image_process,
                impact
            });
        }
        savePortofolioContents(newContents);

        onSave(updatedPortofolio);

        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsSaving(false);
        setOpen(false);
        setStep(1); // Reset 
    };

    const renderStepper = () => {
        return (
            <div className="flex items-center justify-center w-full mb-8">
                {[1, 2, 3].map((s, index) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${step >= s
                                        ? "bg-arcipta-primary text-white"
                                        : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {s}
                            </div>
                        </div>
                        {index < 2 && (
                            <div
                                className={`h-1 w-16 mx-2 transition-all duration-300 ${step > s + 1 || step > index + 1
                                        ? "bg-arcipta-primary"
                                        : "bg-gray-200"
                                    }`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Thumbnail *</Label>
                            <ImageUpload
                                value={thumbnail}
                                onChange={setThumbnail}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Project Title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="client_name">Client Name</Label>
                            <Input
                                id="client_name"
                                value={client_name}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Client Name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="2024"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={category}
                                onValueChange={setCategory}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="problem">Problem</Label>
                            <Textarea
                                id="problem"
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                placeholder="Describe the problem..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="solution">Solution</Label>
                            <Textarea
                                id="solution"
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                placeholder="Describe the solution..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. UI/UX Designer, Frontend Developer"
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="context">Context</Label>
                            <Textarea
                                id="context"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="Project context..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="challenge">Challenge</Label>
                            <Textarea
                                id="challenge"
                                value={challenge}
                                onChange={(e) => setChallenge(e.target.value)}
                                placeholder="Challenges faced..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="approach">Approach</Label>
                            <Textarea
                                id="approach"
                                value={approach}
                                onChange={(e) => setApproach(e.target.value)}
                                placeholder="Your approach..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Process Images (2 items)</Label>
                            <DualImageUpload
                                values={image_process}
                                onChange={setImageProcess}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="impact">Impact</Label>
                            <Textarea
                                id="impact"
                                value={impact}
                                onChange={(e) => setImpact(e.target.value)}
                                placeholder="Project impact..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-arcipta-blue-primary"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Portfolio</DialogTitle>
                    <DialogDescription className="text-center">
                        Update portfolio details
                    </DialogDescription>
                </DialogHeader>

                {renderStepper()}

                {renderStepContent()}

                <DialogFooter className="flex justify-between sm:justify-between w-full">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handlePrev} disabled={isSaving}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button onClick={handleNext}>
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
