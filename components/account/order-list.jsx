"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Package, MapPin, Truck } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";

const OrderCard = ({ order }) => {
    const t = useTranslations("account");
    const locale = useLocale();
    const [open, setOpen] = useState(false);

    const lines = [
        ...(order.products ?? []).map((p) => ({ ...p, kind: "product" })),
        ...(order.bundles ?? []).map((b) => ({ ...b, kind: "bundle" })),
    ];

    const subtotal = lines.reduce((sum, l) => sum + (l.price ?? 0) * (l.quantity ?? 0), 0);
    const shippingCost = order.shippingMethod?.price ?? 0;
    const discount = order.amountDiscount ?? 0;
    const addr = order.shippingAddress;
    const hasTracking = order.boxNowParcelId || order.boxNowLockerName;

    return (
        <div className="bg-white-custom rounded-2xl overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-4 p-5 xl:p-6 text-left cursor-pointer"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-soft flex items-center justify-center shrink-0">
                        <Package size={18} strokeWidth={1.5} className="text-gray-text" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-aeonik text-[15px] text-black-custom truncate">#{order.orderNumber}</p>
                        <p className="font-aeonik text-[12px] text-gray-text">
                            {new Date(order.orderDate).toLocaleDateString(locale)} · {order.itemCount} {t("items")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="font-aeonik text-[15px] text-black-custom">{formatPrice(order.totalPrice)}€</span>
                    <ChevronDown size={18} className={`text-gray-text transition-transform ${open ? "rotate-180" : ""}`} />
                </div>
            </button>

            {/* Expanded */}
            {open && (
                <div className="border-t border-gray-mint">
                    {/* Items */}
                    <div className="p-5 xl:p-6">
                        <p className="font-aeonik text-[11px] uppercase tracking-wide text-gray-text mb-4">{t("itemsLabel")}</p>
                        <ul className="flex flex-col gap-4">
                            {lines.map((line, i) => (
                                <li key={i} className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-lg bg-gray-soft overflow-hidden shrink-0 relative">
                                        {line.imageUrl && (
                                            <Image src={line.imageUrl} alt={line.name ?? ""} fill unoptimized className="object-cover" sizes="56px" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-aeonik text-[14px] text-black-custom truncate">
                                            {line.kind === "bundle" ? `[${t("bundle")}] ` : ""}{line.name}
                                        </p>
                                        {line.selectedFlavours?.length > 0 && (
                                            <p className="font-aeonik text-[12px] text-black-custom">
                                                {line.selectedFlavours
                                                    .map((f) => `${f.variantName}${f.flavourName ? ` – ${f.flavourName}` : ""}`)
                                                    .join(", ")}
                                            </p>
                                        )}
                                        <p className="font-aeonik text-[12px] text-gray-text">
                                            {[line.selectedFlavour, line.sku && `SKU: ${line.sku}`, `${t("qty")}: ${line.quantity}`].filter(Boolean).join(" · ")}
                                        </p>
                                    </div>
                                    <span className="font-aeonik text-[14px] text-black-custom shrink-0">
                                        {formatPrice((line.price ?? 0) * (line.quantity ?? 0))}€
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Summary + shipped-to + tracking */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 xl:p-6 border-t border-gray-mint">
                        <div>
                            <p className="font-aeonik text-[11px] uppercase tracking-wide text-gray-text mb-3">{t("orderSummary")}</p>
                            <dl className="flex flex-col gap-1.5 font-aeonik text-[13px]">
                                <div className="flex justify-between"><dt className="text-gray-text">{t("subtotal")}</dt><dd className="text-black-custom">{formatPrice(subtotal)}€</dd></div>
                                <div className="flex justify-between"><dt className="text-gray-text">{t("shipping")}</dt><dd className="text-black-custom">{shippingCost > 0 ? `${formatPrice(shippingCost)}€` : t("free")}</dd></div>
                                {discount > 0 && (
                                    <div className="flex justify-between"><dt className="text-gray-text">{t("discount")}</dt><dd className="text-black-custom">−{formatPrice(discount)}€</dd></div>
                                )}
                                <div className="flex justify-between pt-1.5 mt-1 border-t border-gray-mint"><dt className="text-black-custom">{t("total")}</dt><dd className="text-black-custom">{formatPrice(order.totalPrice)}€</dd></div>
                            </dl>
                        </div>

                        <div className="flex flex-col gap-4">
                            {addr && (addr.address || addr.city) && (
                                <div>
                                    <p className="flex items-center gap-1.5 font-aeonik text-[11px] uppercase tracking-wide text-gray-text mb-2">
                                        <MapPin size={13} /> {t("shippedTo")}
                                    </p>
                                    <p className="font-aeonik text-[13px] text-black-custom leading-relaxed">
                                        {[addr.firstName, addr.lastName].filter(Boolean).join(" ")}<br />
                                        {[addr.address, addr.apartment].filter(Boolean).join(", ")}<br />
                                        {[addr.postalCode, addr.city].filter(Boolean).join(" ")}{addr.country ? `, ${addr.country}` : ""}
                                    </p>
                                </div>
                            )}
                            {hasTracking && (
                                <div>
                                    <p className="flex items-center gap-1.5 font-aeonik text-[11px] uppercase tracking-wide text-gray-text mb-2">
                                        <Truck size={13} /> {t("tracking")}
                                    </p>
                                    <p className="font-aeonik text-[13px] text-black-custom">
                                        {order.boxNowLockerName}{order.boxNowParcelStatus ? ` · ${order.boxNowParcelStatus}` : ""}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const OrderList = ({ orders = [] }) => (
    <div className="flex flex-col gap-4">
        {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
        ))}
    </div>
);

export default OrderList;
