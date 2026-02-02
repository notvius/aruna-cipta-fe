"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";

const AlertError2 = ({ message, onClose }: { message: string; onClose?: () => void }) => {
    return (
        <Alert variant="destructive" className="shadow-lg border-destructive/50 bg-white dark:bg-slate-950 text-destructive w-full sm:w-96 relative">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Error</AlertTitle>
            <AlertDescription>
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
};

export default AlertError2;