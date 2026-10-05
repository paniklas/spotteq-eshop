import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/account/auth-layout";
import SignInForm from "@/components/account/sign-in-form";
import { getTranslations } from "next-intl/server";
import { brandTitle, NO_INDEX } from "@/lib/seo";

// Private page: translated title, kept out of search engines.
export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata" });
    return { title: brandTitle(t("signInTitle")), robots: NO_INDEX };
}

export default async function SignInPage({ params }) {
    const { locale } = await params;

    const { userId } = await auth();
    if (userId) redirect(`/${locale}/account`);

    return (
        <AuthLayout>
            <SignInForm />
        </AuthLayout>
    );
}
