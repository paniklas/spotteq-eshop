import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/account/auth-layout";
import SignInForm from "@/components/account/sign-in-form";

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
