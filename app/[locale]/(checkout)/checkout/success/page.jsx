import { notFound } from "next/navigation";
import { getOrder } from "@/sanity/getData/getOrder";
import OrderSuccess from "@/components/checkout/order-success";

export const dynamic = "force-dynamic";

const SuccessPage = async ({ params, searchParams }) => {
  const { locale }       = await params;
  const { order_number, payment_confirmed } = await searchParams;

  if (!order_number) notFound();

  const order = await getOrder(order_number, locale);

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
