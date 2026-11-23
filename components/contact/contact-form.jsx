"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createContactSchema } from "@/lib/contactSchema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// How long the check stays in the submit button before it returns to its label.
const SUCCESS_MS = 2500;

const DEFAULT_VALUES = {
    fullName: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
    agreeTerms: false,
};

// Floating-label fields, styled like the checkout form's FloatingInput
// (components/checkout/checkout-form.jsx). The label and "optional" tag sit on
// the top border, so their background matches this page's gray panel.
const fieldClass =
    "peer w-full border border-gray-mint rounded-xl px-4 py-4 font-aeonik text-[16px] md:text-[14px] text-black-custom outline-none bg-transparent focus:border-black-custom transition-colors duration-200";
const floatingLabelClass =
    "absolute left-3 top-0 -translate-y-1/2 bg-gray-light px-1 font-aeonik text-[11px] text-black-custom/50 pointer-events-none transition-colors duration-200 peer-focus:text-black-custom";
const messageClass = "font-aeonik text-[12px] text-red-500 mt-1";

const FloatingField = ({ id, label, optionalLabel, multiline = false, ref, ...props }) => (
    <div className="relative">
        {multiline ? (
            <textarea ref={ref} id={id} placeholder=" " rows={6} {...props} className={`${fieldClass} min-h-33 resize-y`} />
        ) : (
            <input ref={ref} id={id} placeholder=" " {...props} className={fieldClass} />
        )}
        <label htmlFor={id} className={floatingLabelClass}>
            {label}
        </label>
        {optionalLabel && (
            <span className="absolute right-3 top-0 -translate-y-1/2 bg-gray-light px-1 font-aeonik text-[10px] text-black-custom/40 pointer-events-none">
                {optionalLabel}
            </span>
        )}
    </div>
);

const ContactForm = () => {
    const locale = useLocale();
    const t = useTranslations("contact");
    const tErrors = useTranslations("contact.errors");
    // Submit button: "idle" → "loading" (spinner) → "success" (check), then
    // back to "idle" after SUCCESS_MS.
    const [status, setStatus] = useState("idle");
    useEffect(() => {
        if (status !== "success") return;
        const timer = setTimeout(() => setStatus("idle"), SUCCESS_MS);
        return () => clearTimeout(timer);
    }, [status]);

    const schema = useMemo(() => createContactSchema(tErrors), [tErrors]);
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: DEFAULT_VALUES,
    });

    const onSubmit = async (values) => {
        setStatus("loading");
        try {
            // Plain fetch (not a server action) so Vercel BotID can attach its
            // headers — see instrumentation-client.js and app/api/contact.
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, locale }),
            }).then((r) => r.json());
            if (!res.ok) {
                setStatus("idle");
                toast.error(res.error === "invalid" ? t("invalid") : t("failed"));
                return;
            }
            setStatus("success");
            toast.success(t("success"));
            form.reset(DEFAULT_VALUES);
        } catch {
            setStatus("idle");
            toast.error(t("failed"));
        }
    };

    const buttonContent = {
        idle: <span className="font-aeonik text-[12px]">{t("submit")}</span>,
        loading: <Loader2 className="size-4 animate-spin" aria-hidden="true" />,
        success: <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />,
    };

    const floatingField = (name, fieldProps) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="gap-0">
                    <FormControl>
                        <FloatingField {...field} id={`contact-${name}`} {...fieldProps} />
                    </FormControl>
                    <FormMessage className={messageClass} />
                </FormItem>
            )}
        />
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <fieldset disabled={status === "loading"} className="flex flex-col gap-5">
                    {floatingField("fullName", { label: t("fullName"), autoComplete: "name" })}
                    {floatingField("email", { label: t("email"), type: "email", autoComplete: "email" })}
                    {floatingField("orderNumber", { label: t("orderNumber"), optionalLabel: t("optional"), autoComplete: "off" })}
                    {floatingField("subject", { label: t("subject") })}
                    {floatingField("message", { label: t("message"), multiline: true })}

                    <FormField
                        control={form.control}
                        name="agreeTerms"
                        render={({ field }) => (
                            <FormItem className="gap-1">
                                <div className="flex items-start gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(checked === true)}
                                            className="mt-px rounded-xs border-black-custom data-[state=checked]:bg-black-custom data-[state=checked]:border-black-custom data-[state=checked]:text-white-custom"
                                        />
                                    </FormControl>
                                    {/* FormLabel points at the id FormControl gives the checkbox:
                                        this text is its accessible name, and clicking it toggles it */}
                                    <FormLabel className="block font-aeonik text-[11px] font-normal text-black-custom leading-snug select-auto cursor-pointer">
                                        {t.rich("agreeTerms", {
                                            terms: (chunks) => <Link href="/terms" className="underline">{chunks}</Link>,
                                            privacy: (chunks) => <Link href="/privacy" className="underline">{chunks}</Link>,
                                        })}
                                    </FormLabel>
                                </div>
                                <FormMessage className={messageClass} />
                            </FormItem>
                        )}
                    />

                    <button
                        type="submit"
                        disabled={status !== "idle"}
                        aria-busy={status === "loading"}
                        className="mt-4 w-full h-7.5 rounded-[8px] bg-black-custom text-white-custom hover:bg-black-custom/85 transition-colors cursor-pointer disabled:cursor-default disabled:hover:bg-black-custom flex items-center justify-center overflow-hidden"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={status}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="flex items-center justify-center"
                            >
                                {buttonContent[status]}
                            </motion.span>
                        </AnimatePresence>
                        {/* The icons have no text: announce the state to screen readers */}
                        <span className="sr-only" aria-live="polite">
                            {status === "loading" ? t("submitting") : status === "success" ? t("sent") : ""}
                        </span>
                    </button>
                </fieldset>
            </form>
        </Form>
    );
};

export default ContactForm;
