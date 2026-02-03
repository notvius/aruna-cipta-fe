"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ActivityLog } from "@/constants/activity_log";

export function ViewActivityLogModal({ open, onOpenChange, log }: { open: boolean, onOpenChange: (o: boolean) => void, log: ActivityLog | null }) {
    if (!log) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] font-satoshi">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold font-orbitron">Activity Logs Details</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Action Type</p>
                            <Badge className={log.action === 'created' ? 'bg-arcipta-blue-primary' : log.action === 'deleted' ? 'bg-red-600' : 'bg-amber-500'}>
                                {log.action.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Module Target</p>
                            <p className="font-bold text-slate-900">{log.target_type}</p>
                        </div>
                    </div>

                    <div className="bg-slate-950 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Raw Meta Data</div>
                        <ScrollArea className="h-[200px] w-full mt-2">
                            <pre className="text-xs font-mono text-blue-400 leading-relaxed">
                                {JSON.stringify({
                                    id: log.id,
                                    target_id: log.target_id,
                                    ip_address: log.ip_address,
                                    user_agent: log.user_agent,
                                    timestamp: log.created_at
                                }, null, 4)}
                            </pre>
                        </ScrollArea>
                    </div>

                    <div className="grid grid-cols-1 gap-2 border-t pt-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground font-bold uppercase tracking-tighter">Device Info</span>
                            <span className="bg-muted px-2 py-1 rounded-md max-w-[350px] truncate">{log.user_agent}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}