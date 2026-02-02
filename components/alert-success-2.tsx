"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, X } from "lucide-react";

const AlertSuccess2 = ({ message, onClose }: { message: string; onClose?: () => void }) => (
    <Alert className="shadow-lg border-green-500/50 bg-white dark:bg-slate-950 text-green-600 w-full sm:w-96 relative">
        <CheckCircle2 className="h-4 w-4 stroke-green-600" />
        <AlertTitle className="font-bold">Success</AlertTitle>
        <AlertDescription className="text-green-600/90">
            {message}
        </AlertDescription>
        {onClose && (
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 opacity-70 hover:opacity-100 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        )}
    </Alert>
);

export default AlertSuccess2;