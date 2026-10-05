import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AccountNav from "@/components/account/account-nav";
import { NO_INDEX } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Every account page is per-user: kept out of search engines. Inherited by the
// pages below, which set only their own title.
export const metadata = { robots: NO_INDEX };

export default async function AccountLayout({ children, params }) {
    const { locale } = await params;

    // Defense-in-depth — proxy.js already protects /account(.*).
    const { userId } = await auth();
    if (!userId) redirect(`/${locale}/sign-in`);

    return (
        <section className="w-full bg-gray-light py-16 xl:py-28 min-h-screen">
            <div className="max-w-480 mx-auto page-x">
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 xl:gap-12">
                    <aside>
                        <AccountNav />
                    </aside>
                    <div className="min-w-0">{children}</div>
                </div>
            </div>
        </section>
    );
}
