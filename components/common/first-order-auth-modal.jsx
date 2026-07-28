"use client"

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs/legacy";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const COPY = {
    el: {
        title: "10% Off Your First Order",
        subtitle: "Δημιουργήστε λογαριασμό και κερδίστε έκπτωση στην πρώτη παραγγελία",
        google: "Συνέχεια με Google",
        or: "ή",
        create: "Δημιουργία λογαριασμού",
    },
    en: {
        title: "10% Off Your First Order",
        subtitle: "Create an account and get a discount on your first order",
        google: "Continue with Google",
        or: "or",
        create: "Create account",
    },
};

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
        </svg>
    );
}

const FirstOrderAuthModal = ({ isOpen, onClose }) => {
    const locale = useLocale();
    const copy = COPY[locale] ?? COPY.en;
    const { isLoaded, signUp } = useSignUp();
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogle = async () => {
        if (!isLoaded || googleLoading) return;
        setGoogleLoading(true);
        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/${locale}/account`,
            });
            // Browser redirects away on success — no need to reset the flag.
        } catch {
            setGoogleLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-[440px] bg-white-custom text-black-custom border-none p-8 xl:p-10 font-aeonik rounded-[20px]"
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-6 top-6 cursor-pointer outline-none"
                >
                    <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line y1="-0.5" x2="30" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 21.9204 0.707092)" stroke="black" />
                        <line y1="-0.5" x2="30" y2="-0.5" transform="matrix(0.707107 0.707107 0.707107 -0.707107 0.707275 0.707092)" stroke="black" />
                    </svg>
                    <span className="sr-only">Close</span>
                </button>

                <DialogHeader className="mt-2">
                    <DialogTitle className="text-[26px] xl:text-[30px] font-normal text-center">
                        {copy.title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-[15px] xl:text-[16px] text-black-custom mt-2 px-2">
                        {copy.subtitle}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-5 mt-4">
                    {/* Google */}
                    <button
                        onClick={handleGoogle}
                        disabled={googleLoading}
                        className="w-full h-12 flex items-center justify-center gap-3 border border-black-custom/20 rounded-[15px] font-aeonik text-[15px] text-black-custom cursor-pointer hover:bg-gray-light transition-colors disabled:opacity-50"
                    >
                        <GoogleIcon />
                        {copy.google}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-black-custom/15" />
                        <span className="text-[13px] text-gray-text">{copy.or}</span>
                        <div className="flex-1 h-px bg-black-custom/15" />
                    </div>

                    {/* Create account */}
                    <Link
                        href="/sign-up"
                        onClick={onClose}
                        className="w-full h-12 flex items-center justify-center bg-black-custom text-white-custom rounded-[15px] font-aeonik text-[15px] hover:opacity-90 transition-opacity"
                    >
                        {copy.create}
                    </Link>

                    {/* Clerk mounts its bot-protection (Smart CAPTCHA) widget here */}
                    <div id="clerk-captcha" />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FirstOrderAuthModal;
