import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getOrder } from "@/sanity/getData/getOrder";
import OrderSuccess from "@/components/checkout/order-success";
import { getTranslations } from "next-intl/server";
import { brandTitle, NO_INDEX } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Private page: translated title, kept out of search engines.
export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata" });
    return { title: brandTitle(t("orderConfirmationTitle")), robots: NO_INDEX };
}

const SuccessPage = async ({ params, searchParams }) => {
  const { locale }       = await params;
  const { order_number, payment_confirmed } = await searchParams;

  if (!order_number) notFound();

  const cookieStore = await cookies();
  const viewToken = cookieStore.get(`order_token_${order_number}`)?.value ?? "";

  const order = await getOrder(order_number, viewToken, locale);

  return (
    <section className="w-full min-h-screen bg-gray-light py-16 xl:py-32">
      <div className="max-w-480 mx-auto page-x">
        <div className="max-w-2xl mx-auto">
          <OrderSuccess
            order={order ?? null}
            orderNumber={order_number}
            locale={locale}
            paymentConfirmed={payment_confirmed === "true"}
          />
        </div>
      </div>
    </section>
  );
};

export default SuccessPage;
