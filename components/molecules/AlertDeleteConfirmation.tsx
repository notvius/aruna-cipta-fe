"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertDeleteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

export function AlertDeleteConfirmation({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Entry?",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  loading = false,
}: AlertDeleteConfirmationProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px] p-6">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive/80" />
            </div>
            <div className="space-y-1 text-left">
              <AlertDialogTitle className="text-lg font-semibold text-slate-900">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-relaxed text-slate-500">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="mt-6 flex flex-row items-center gap-3">
          <AlertDialogCancel 
            disabled={loading} 
            className="flex-1 mt-0 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "flex-1 bg-destructive/90 hover:bg-destructive text-white shadow-none transition-all"
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Wait
              </div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}