"use client";

import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicIconProps extends LucideProps {
    name: string;
}

export const DynamicIcon = ({ name, className, ...props }: DynamicIconProps) => {
    // @ts-ignore - Dynamic key access
    const IconComponent = Icons[name] as React.ElementType;

    if (!IconComponent) {
        // Fallback to HelpCircle if icon name is invalid or not found
        return <Icons.HelpCircle className={cn("text-muted-foreground", className)} {...props} />;
    }

    return <IconComponent className={className} {...props} />;
};
