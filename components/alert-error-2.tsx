"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, X } from "lucide-react";

const AlertError2 = ({ message, onClose }: { message: string; onClose?: () => void }) => (
    <Alert className="shadow-lg border-red-500/50 bg-white dark:bg-slate-950 text-red-600 w-full sm:w-96 relative">
        <XCircle className="h-4 w-4 stroke-red-600" />
        <AlertTitle className="font-bold">Error</AlertTitle>
        <AlertDescription className="text-red-600/90">
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

export default AlertError2;