import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AccountNav from "@/components/account/account-nav";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children, params }) {
    const { locale } = await params;

    // Defense-in-depth — proxy.js already protects /account(.*).
    const { userId } = await auth();
    if (!userId) redirect(`/${locale}/sign-in`);

    return (
        <section className="w-full bg-gray-light py-16 xl:py-28 min-h-screen">
            <div className="max-w-480 mx-auto page-x">
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 xl:gap-12">
                    <aside>
                        <AccountNav />
                    </aside>
                    <div className="min-w-0">{children}</div>
                </div>
            </div>
        </section>
    );
}
