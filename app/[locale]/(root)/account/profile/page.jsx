import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { getOrCreateUserInfo } from "@/sanity/getData/getOrCreateUserInfo";
import ProfileForm from "@/components/account/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const [user, userInfo, t] = await Promise.all([
        currentUser(),
        getOrCreateUserInfo(),
        getTranslations("account"),
    ]);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-aeonik text-[24px] xl:text-[32px] text-black-custom">{t("nav.profile")}</h1>
            <div className="bg-white-custom rounded-2xl p-6 xl:p-8">
                <ProfileForm
                    defaultFirstName={user?.firstName ?? ""}
                    defaultLastName={user?.lastName ?? ""}
                    defaultPhone={userInfo?.phone ?? ""}
                />
            </div>
        </div>
    );
}
