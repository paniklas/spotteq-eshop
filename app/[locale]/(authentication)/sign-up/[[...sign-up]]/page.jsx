import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/account/auth-layout";
import SignUpForm from "@/components/account/sign-up-form";

export default async function SignUpPage({ params }) {
    const { locale } = await params;

    const { userId } = await auth();
    if (userId) redirect(`/${locale}/account`);

    return (
        <AuthLayout>
            <SignUpForm />
        </AuthLayout>
    );
}
