"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Lock, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const router = useRouter();

    const usernameRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    username: usernameRef.current?.value,
                    password: passwordRef.current?.value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Username atau Password anda salah");
                }
                throw new Error(data.message || "Terjadi kesalahan pada sistem");
            }

            const token = data.access_token || data.token;
            Cookies.set("token", token, { expires: 1 });
            Cookies.set("username", usernameRef.current?.value || "", { expires: 1 });
            router.push("/admin/overview");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-jakarta selection:bg-slate-200">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/login/bg.png"
                    alt="Background"
                    fill
                    className="object-cover scale-105"
                    priority
                    quality={75}
                />
            </div>

            <div className="relative z-10 w-full max-w-[460px] mx-4 animate-in fade-in duration-700">
                <div className="bg-white/40 backdrop-blur-[24px] rounded-[48px] p-10 md:p-14 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/40">

                    <div className="flex justify-center mb-8">
                        <div className="bg-white/90 p-4 rounded-[24px] shadow-sm border border-white flex items-center justify-center transition-transform hover:scale-110 duration-500">
                            <Lock className="h-7 w-7 text-slate-900" />
                        </div>
                    </div>

                    <div className="text-center mb-10 space-y-2">
                        <h1 className="text-[30px] font-bold text-slate-900 tracking-tight leading-tight font-outfit">
                            Welcome Back
                        </h1>
                        <p className="text-[13px] font-medium text-slate-700/70 leading-relaxed max-w-[280px] mx-auto">
                            Please enter your credentials to access your account dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-white/50 border border-red-500/20 rounded-2xl text-red-600 text-[13px] font-bold text-center animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="group relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-slate-900 transition-colors" />
                            <input
                                ref={usernameRef}
                                type="text"
                                required
                                placeholder="Username"
                                className="w-full h-14 pl-14 pr-5 bg-white/50 border border-transparent rounded-[20px] text-[14px] font-semibold placeholder:text-slate-400 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-black/5 transition-all outline-none"
                            />
                        </div>

                        <div className="group relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-slate-900 transition-colors" />
                            <input
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Password"
                                className="w-full h-14 pl-14 pr-14 bg-white/50 border border-transparent rounded-[20px] text-[14px] font-semibold placeholder:text-slate-400 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-black/5 transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900"
                            >
                                <EyeOff className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex justify-end px-1">
                            <button type="button" className="text-[12px] font-bold text-slate-700 hover:text-black transition-all">
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            disabled={isLoading}
                            className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-[24px] text-[15px] font-bold transition-all shadow-xl hover:shadow-2xl active:scale-[0.97] mt-4 uppercase tracking-wider flex items-center justify-center gap-2 font-outfit"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Log In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[11px] font-black text-slate-900/40 uppercase tracking-[0.3em]">
                            ARCIPTA SYSTEM &copy; 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}