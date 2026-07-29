import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ShoppingBag, Package, Heart, ArrowRight } from "lucide-react";
import { getOrCreateUserInfo } from "@/sanity/getData/getOrCreateUserInfo";
import { getUserOrders } from "@/sanity/getData/getUserOrders";
import { formatPrice } from "@/utils/formatPrice";

export const dynamic = "force-dynamic";

const STATUS_STYLES = {
    delivered: "bg-teal-accent/15 text-black-custom",
    shipped: "bg-blue-100 text-blue-700",
    paid: "bg-gray-soft text-black-custom",
    pending: "bg-orange-accent/15 text-orange-accent",
    refunded: "bg-gray-soft text-gray-text",
    cancelled: "bg-gray-soft text-gray-text",
};

const StatCard = ({ icon: Icon, value, label }) => (
    <div className="bg-white-custom rounded-xl xl:rounded-2xl p-3 xl:p-6 flex flex-col gap-1.5 xl:gap-3">
        <Icon size={18} strokeWidth={1.5} className="text-gray-text shrink-0" />
        <div>
            <p className="font-aeonik text-[20px] xl:text-[28px] text-black-custom leading-none">{value}</p>
            <p className="font-aeonik text-[11px] xl:text-[13px] text-gray-text leading-tight mt-0.5 xl:mt-1">{label}</p>
        </div>
    </div>
);

export default async function OverviewPage({ params }) {
    const { locale } = await params;

    const [user, userInfo, t] = await Promise.all([
        currentUser(),
        getOrCreateUserInfo(),
        getTranslations("account"),
    ]);

    const email = user?.primaryEmailAddress?.emailAddress ?? userInfo?.email ?? "";
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || email[0]?.toUpperCase() || "?";

    const orders = await getUserOrders({ userInfoId: userInfo?._id, locale });

    const totalOrders = orders?.length ?? 0;
    const deliveredCount = orders?.filter((o) => o.status === "delivered").length ?? 0;

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(locale, { month: "long", year: "numeric" })
        : null;

    const recentOrders = (orders ?? []).slice(0, 3);
    const wishlistCount = userInfo?.favourites?.length ?? 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Welcome card */}
            <div className="bg-white-custom rounded-2xl p-6 xl:p-8 flex items-center justify-between gap-4">
                <div>
                    <p className="font-aeonik text-[13px] text-gray-text mb-1">{t("welcomeBack")}</p>
                    <h1 className="font-aeonik text-[24px] xl:text-[32px] text-black-custom leading-tight">
                        {fullName || email}
                    </h1>
                    {memberSince && (
                        <p className="font-aeonik text-[13px] text-gray-text mt-1">
                            {t("memberSince", { date: memberSince })}
                        </p>
                    )}
                </div>
                <div className="shrink-0 w-16 h-16 rounded-full bg-gray-soft flex items-center justify-center font-aeonik text-[20px] text-black-custom">
                    {initials}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 xl:gap-4">
                <StatCard icon={ShoppingBag} value={totalOrders} label={t("stats.totalOrders")} />
                <StatCard icon={Package} value={deliveredCount} label={t("stats.delivered")} />
                <StatCard icon={Heart} value={wishlistCount} label={t("stats.wishlistItems")} />
            </div>

            {/* Recent orders */}
            <div className="bg-white-custom rounded-2xl p-6 xl:p-8">
                <div className="flex flex-col items-start xl:flex-row xl:items-center xl:justify-between mb-6">
                    <h2 className="font-aeonik text-[20px] text-black-custom">{t("recentOrders")}</h2>
                    <Link href="/account/orders" className="flex items-center gap-1 font-aeonik text-[13px] text-black-custom hover:opacity-70 transition-opacity">
                        {t("viewAll")} <ArrowRight size={15} />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <p className="font-aeonik text-[14px] text-gray-text">{t("noOrders")}</p>
                ) : (
                    <ul className="flex flex-col divide-y divide-gray-mint">
                        {recentOrders.map((order) => (
                            <li key={order._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-gray-soft flex items-center justify-center shrink-0">
                                        <Package size={18} strokeWidth={1.5} className="text-gray-text" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-aeonik text-[14px] text-black-custom truncate">#{order.orderNumber}</p>
                                        <p className="font-aeonik text-[12px] text-gray-text">
                                            {new Date(order.orderDate).toLocaleDateString(locale)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className="font-aeonik text-[14px] text-black-custom">{formatPrice(order.totalPrice)}€</span>
                                    <span className={`font-aeonik text-[11px] px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] ?? "bg-gray-soft text-gray-text"}`}>
                                        {t(`status.${order.status}`)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/account/profile" className="bg-white-custom rounded-2xl p-6 flex items-center justify-between group hover:bg-gray-soft transition-colors">
                    <div>
                        <p className="font-aeonik text-[16px] text-black-custom">{t("updateProfile")}</p>
                        <p className="font-aeonik text-[12px] text-gray-text mt-0.5">{t("updateProfileDesc")}</p>
                    </div>
                    <ArrowRight size={18} className="text-gray-text group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/account/shipping" className="bg-white-custom rounded-2xl p-6 flex items-center justify-between group hover:bg-gray-soft transition-colors">
                    <div>
                        <p className="font-aeonik text-[16px] text-black-custom">{t("manageAddresses")}</p>
                        <p className="font-aeonik text-[12px] text-gray-text mt-0.5">{t("manageAddressesDesc")}</p>
                    </div>
                    <ArrowRight size={18} className="text-gray-text group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
