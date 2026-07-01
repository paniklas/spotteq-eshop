"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { addressSchema } from "@/lib/addressSchema";

const FloatingInput = ({ id, label, optional = false, error, className = "", register }) => (
    <div className={`relative ${className}`}>
        <input
            id={id}
            type="text"
            placeholder=" "
            {...register(id)}
            className="peer w-full border border-gray-mint rounded-xl px-4 py-4 font-aeonik text-[14px] text-black-custom outline-none bg-transparent focus:border-black-custom transition-colors duration-200"
        />
        <label
            htmlFor={id}
            className="absolute left-3 top-0 -translate-y-1/2 bg-white-custom px-1 font-aeonik text-[11px] text-black-custom/50 pointer-events-none transition-colors duration-200 peer-focus:text-black-custom"
        >
            {label}
        </label>
        {optional && (
            <span className="absolute right-3 top-0 -translate-y-1/2 bg-white-custom px-1 font-aeonik text-[10px] text-black-custom/40 pointer-events-none">
                optional
            </span>
        )}
        {error && <p className="mt-1 font-aeonik text-[11px] text-orange-accent">{error.message}</p>}
    </div>
);

const AddressForm = ({ defaultValues, action }) => {
    const t = useTranslations("account");
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            firstName: "", lastName: "", company: "", address: "", apartment: "",
            city: "", postalCode: "", country: "", phone: "",
            ...defaultValues,
        },
    });

    const onSubmit = (data) => {
        startTransition(async () => {
            const res = await action(data);
            if (res?.ok) toast.success(t("addressSaved"));
            else toast.error(res?.error ?? t("addressError"));
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput id="firstName" label={t("firstName")} register={register} error={errors.firstName} />
                <FloatingInput id="lastName" label={t("lastName")} register={register} error={errors.lastName} />
            </div>
            <FloatingInput id="company" label={t("company")} optional register={register} error={errors.company} />
            <FloatingInput id="address" label={t("address")} register={register} error={errors.address} />
            <FloatingInput id="apartment" label={t("apartment")} optional register={register} error={errors.apartment} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput id="city" label={t("city")} register={register} error={errors.city} />
                <FloatingInput id="postalCode" label={t("postalCode")} register={register} error={errors.postalCode} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput id="country" label={t("country")} register={register} error={errors.country} />
                <FloatingInput id="phone" label={t("phone")} register={register} error={errors.phone} />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="mt-2 self-start bg-black-custom text-white-custom rounded-xl px-8 py-3 font-aeonik text-[14px] hover:bg-black-custom/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
                {isPending ? t("saving") : t("saveAddress")}
            </button>
        </form>
    );
};

export default AddressForm;
