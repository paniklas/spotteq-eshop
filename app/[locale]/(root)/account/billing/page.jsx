import { getTranslations } from "next-intl/server";
import { brandTitle } from "@/lib/seo";
import { getOrCreateUserInfo } from "@/sanity/getData/getOrCreateUserInfo";
import { updateUserBillingInfo } from "@/app/actions/updateUserBillingInfo";
import AddressForm from "@/components/account/address-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "account" });
    return { title: brandTitle(t("nav.billing")) };
}

export default async function BillingPage() {
    const [userInfo, t] = await Promise.all([
        getOrCreateUserInfo(),
        getTranslations("account"),
    ]);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-aeonik text-[24px] xl:text-[32px] text-black-custom">{t("billingTitle")}</h1>
            <div className="bg-white-custom rounded-2xl p-6 xl:p-8">
                <AddressForm action={updateUserBillingInfo} defaultValues={userInfo?.billingInfo ?? undefined} />
            </div>
        </div>
    );
}
