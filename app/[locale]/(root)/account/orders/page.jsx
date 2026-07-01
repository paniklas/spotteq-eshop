import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { getOrCreateUserInfo } from "@/sanity/getData/getOrCreateUserInfo";
import { getUserOrders } from "@/sanity/getData/getUserOrders";
import OrderList from "@/components/account/order-list";

export const dynamic = "force-dynamic";

export default async function OrdersPage({ params }) {
    const { locale } = await params;

    const [user, userInfo, t] = await Promise.all([
        currentUser(),
        getOrCreateUserInfo(),
        getTranslations("account"),
    ]);

    const email = user?.primaryEmailAddress?.emailAddress ?? userInfo?.email ?? "";
    const orders = await getUserOrders({ userInfoId: userInfo?._id, email, locale });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-aeonik text-[24px] xl:text-[32px] text-black-custom">{t("ordersTitle")}</h1>
                <p className="font-aeonik text-[14px] text-gray-text mt-1">
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
