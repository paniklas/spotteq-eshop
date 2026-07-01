"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutGrid, Package, User, Truck, CreditCard, Heart } from "lucide-react";
import SignOutButton from "./sign-out-button";

const items = [
    { key: "overview", href: "/account", icon: LayoutGrid, exact: true },
    { key: "orders", href: "/account/orders", icon: Package },
    { key: "profile", href: "/account/profile", icon: User },
    { key: "shipping", href: "/account/shipping", icon: Truck },
    { key: "billing", href: "/account/billing", icon: CreditCard },
    { key: "wishlist", href: "/account/wishlist", icon: Heart },
];

const AccountNav = () => {
    const t = useTranslations("account.nav");
    const pathname = usePathname();

    // Strip the locale prefix (/el, /en) so matching works regardless of locale.
    const path = pathname.replace(/^\/(el|en)(?=\/|$)/, "") || "/";

    const isActive = (item) =>
        item.exact ? path === item.href : path === item.href || path.startsWith(`${item.href}/`);

    return (
        <nav className="lg:sticky lg:top-28">
            <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                        <li key={item.key} className="shrink-0">
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-aeonik text-[14px] whitespace-nowrap transition-colors ${
                                    active
                                        ? "bg-black-custom text-white-custom"
                                        : "text-gray-text hover:bg-white-custom hover:text-black-custom"
                                }`}
                            >
                                <Icon size={18} strokeWidth={1.5} />
                                {t(item.key)}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="hidden lg:block mt-6 px-4">
                <SignOutButton />
            </div>
        </nav>
    );
};

export default AccountNav;
