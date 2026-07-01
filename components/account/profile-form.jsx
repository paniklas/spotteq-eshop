"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateUserProfile } from "@/app/actions/updateUserProfile";

const Field = ({ id, label, value, onChange, disabled = false, note }) => (
    <div className="relative">
        <input
            id={id}
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder=" "
            className={`peer w-full border border-gray-mint rounded-xl px-4 py-4 font-aeonik text-[14px] text-black-custom outline-none bg-transparent focus:border-black-custom transition-colors duration-200 ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        />
        <label htmlFor={id} className="absolute left-3 top-0 -translate-y-1/2 bg-white-custom px-1 font-aeonik text-[11px] text-black-custom/50 pointer-events-none peer-focus:text-black-custom">
            {label}
        </label>
        {note && <p className="mt-1 font-aeonik text-[11px] text-gray-text">{note}</p>}
    </div>
);

const ProfileForm = ({ defaultPhone = "" }) => {
    const t = useTranslations("account");
    const { user, isLoaded } = useUser();
    const [isPending, startTransition] = useTransition();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState(defaultPhone);
    const seededRef = useRef(false);

    // Seed name fields once, after the Clerk user finishes loading.
    useEffect(() => {
        if (isLoaded && user && !seededRef.current) {
            setFirstName(user.firstName ?? "");
            setLastName(user.lastName ?? "");
            seededRef.current = true;
        }
    }, [isLoaded, user]);

    const email = user?.primaryEmailAddress?.emailAddress ?? "";

    const onSubmit = (e) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                await user.update({ firstName, lastName });
                const res = await updateUserProfile({ phone });
                if (res?.ok) toast.success(t("profileSaved"));
                else toast.error(res?.error ?? t("profileError"));
            } catch (err) {
                console.error(err);
                toast.error(t("profileError"));
            }
        });
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="firstName" label={t("firstName")} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <Field id="lastName" label={t("lastName")} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <Field id="phone" label={t("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Field id="email" label={t("email")} value={email} disabled note={t("emailNote")} />

            <button
                type="submit"
                disabled={isPending || !isLoaded}
                className="mt-2 self-start bg-black-custom text-white-custom rounded-xl px-8 py-3 font-aeonik text-[14px] hover:bg-black-custom/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
                {isPending ? t("saving") : t("saveProfile")}
            </button>
        </form>
    );
};

export default ProfileForm;
