import { getTranslations } from "next-intl/server";
import { brandTitle } from "@/lib/seo";
import { getOrCreateUserInfo } from "@/sanity/getData/getOrCreateUserInfo";
import { getUserOrders } from "@/sanity/getData/getUserOrders";
import OrderList from "@/components/account/order-list";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "account" });
    return { title: brandTitle(t("nav.orders")) };
}

export default async function OrdersPage({ params }) {
    const { locale } = await params;

    const [userInfo, t] = await Promise.all([
        getOrCreateUserInfo(),
        getTranslations("account"),
    ]);

    const orders = await getUserOrders({ userInfoId: userInfo?._id, locale });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-aeonik text-[24px] xl:text-[32px] text-black-custom">{t("ordersTitle")}</h1>
                <p className="font-aeonik text-[14px] text-gray-text">
                    {t("totalOrdersCount", { count: orders?.length ?? 0 })}
                </p>
            </div>

            {!orders?.length ? (
                <div className="bg-white-custom rounded-2xl p-8">
                    <p className="font-aeonik text-[14px] text-gray-text">{t("noOrders")}</p>
                </div>
            ) : (
                <OrderList orders={orders} />
            )}
        </div>
    );
}
