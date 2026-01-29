"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

const AlertSuccess2 = ({ message }: { message: string }) => (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-in fade-in zoom-in slide-in-from-top-4 duration-300 px-4">
        <Alert className="shadow-lg border-green-500/50 bg-white dark:bg-slate-950 text-green-600">
            <CheckCircle2 className="h-4 w-4 stroke-green-600" />
            <AlertTitle className="font-bold">Success</AlertTitle>
            <AlertDescription className="text-green-600/90">
                {message}
            </AlertDescription>
        </Alert>
    </div>
);

export default AlertSuccess2;