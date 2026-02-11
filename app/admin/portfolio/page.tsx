"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/portfolio/PortfolioColumns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PortfolioForm } from "@/components/organisms/portfolio/PortfolioForm";
import { ViewPortfolioModal } from "@/components/organisms/portfolio/ViewPortfolioModal";
import { PreviewPortfolioModal } from "@/components/organisms/portfolio/PreviewPortfolioModal";
import { PortfolioFilter } from "@/components/organisms/portfolio/PortfolioFilter";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { type Portfolio } from "@/constants/portfolios";

export default function PortfolioPage() {
    const [data, setData] = React.useState<Portfolio[]>([]);
    const [services, setServices] = React.useState<any[]>([]);

    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isViewOpen, setIsViewOpen] = React.useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<Portfolio | null>(null);

    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = React.useState(false);

    const [globalFilter, setGlobalFilter] = React.useState("");
    const [catFilter, setCatFilter] = React.useState("all");

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        try {
            const [pRes, sRes] = await Promise.all([
                fetch(`${baseUrl}/portfolio`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(`${baseUrl}/service`, { headers: { "Authorization": `Bearer ${token}` } })
            ]);
            const pJson = await pRes.json();
            const sJson = await sRes.json();
            setData(Array.isArray(pJson) ? pJson : (pJson.data || []));
            setServices(Array.isArray(sJson) ? sJson : (sJson.data || []));
        } catch (err) {
            triggerError("Failed to fetch portfolios.");
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    const triggerSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 3000);
        refreshData();
    };

    const triggerError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    const handleAction = async (p: Portfolio, mode: 'view' | 'edit' | 'preview') => {
        setSelectedItem(p);
        if (mode === 'view') setIsViewOpen(true);
        else if (mode === 'preview') setIsPreviewOpen(true);
        else if (mode === 'edit') setIsFormOpen(true);

        setIsLoadingDetail(true);
        const token = Cookies.get("token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        try {
            const res = await fetch(`${baseUrl}/portfolio/${p.uuid}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const json = await res.json();
            const fullData = json.data || json;
            setSelectedItem(fullData);
        } catch (err) {
            triggerError("Failed to fetch project details.");
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handleOnCloseForm = (msg: string, isErr: boolean = false) => {
        setIsFormOpen(false);
        if (msg) {
            if (isErr === true || msg.toLowerCase().includes('failed')) {
                triggerError(msg);
            } else {
                triggerSuccess(msg);
            }
        }
        refreshData();
    };

    const filteredData = React.useMemo(() => {
        return data.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(globalFilter.toLowerCase());

            const getPortfolioCatId = () => {
                const rawCategory = (item as any).services || item.category || (item as any).category_id;
                if (Array.isArray(rawCategory) && rawCategory.length > 0) {
                    const first = rawCategory[0];
                    return (typeof first === 'object' ? (first.id || first.service_id) : first).toString();
                }
                if (rawCategory && typeof rawCategory === 'object') {
                    return (rawCategory.id || rawCategory.service_id).toString();
                }
                return (rawCategory || "").toString();
            };

            const portfolioCatId = getPortfolioCatId();
            const matchesCat = catFilter === "all" || portfolioCatId === catFilter;

            return matchesSearch && matchesCat;
        });
    }, [data, globalFilter, catFilter]);

    return (
        <div className="w-full relative px-6 pb-10 font-satoshi">
            {success && (
                <div className="fixed top-6 right-6 z-[300]">
                    <AlertSuccess2 message={success} onClose={() => setSuccess(null)} />
                </div>
            )}

            {error && (
                <div className="fixed top-6 right-6 z-[300]">
                    <AlertError2 message={error} onClose={() => setError(null)} />
                </div>
            )}

            <div className="mb-8 space-y-1 pt-4">
                <h2 className="text-2xl font-bold tracking-tight font-outfit text-slate-900 uppercase">
                    Portfolio Management
                </h2>
                <p className="text-sm text-muted-foreground tracking-tight">
                    Manage and showcase project portfolio works
                </p>
            </div>

            <PortfolioFilter
                globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
                catFilter={catFilter} onCatChange={setCatFilter}
                services={services} onReset={() => { setGlobalFilter(""); setCatFilter("all"); }}
            />

            <div className="mt-4">
                <DataTable
                    data={filteredData}
                    columns={columns(
                        () => { setSelectedItem(null); setIsFormOpen(true); },
                        (p) => handleAction(p, 'view'),
                        (p) => handleAction(p, 'edit'),
                        (p) => { setSelectedItem(p); setIsDeleteOpen(true); },
                        (p) => handleAction(p, 'preview'),
                        services
                    )}
                />
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="fixed inset-0 z-[150] h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 border-none p-0 bg-white rounded-none">
                    <VisuallyHidden.Root><DialogTitle>Portfolio Form</DialogTitle></VisuallyHidden.Root>
                    <PortfolioForm
                        mode={selectedItem?.id ? "edit" : "create"}
                        initialData={selectedItem}
                        isLoading={isLoadingDetail}
                        onClose={handleOnCloseForm}
                        services={services}
                    />
                </DialogContent>
            </Dialog>

            <ViewPortfolioModal portfolio={selectedItem} open={isViewOpen} onOpenChange={setIsViewOpen} services={services} />
            <PreviewPortfolioModal open={isPreviewOpen} onOpenChange={setIsPreviewOpen} data={selectedItem} content={selectedItem?.content} services={services} isLoading={isLoadingDetail} />

            <AlertDeleteConfirmation
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={refreshData}
                title="Hapus Portfolio"
                description="Tindakan ini akan menghapus data portfolio secara permanen dari database."
            />
        </div>
    );
}