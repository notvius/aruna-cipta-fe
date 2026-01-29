"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import * as React from "react";

const AlertError2 = ({ message, onClose }: { message: string; onClose?: () => void }) => {
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-in fade-in zoom-in slide-in-from-top-4 duration-300 px-4">
            <Alert variant="destructive" className="shadow-lg border-destructive/50 bg-white dark:bg-slate-950 relative">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
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
        </div>
    );
};

export default AlertError2;