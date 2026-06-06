import { getShippingMethods } from "@/sanity/getData/getShippingMethods";
import CheckoutForm from "@/components/checkout/checkout-form";
import OrderSummary from "@/components/checkout/order-summary";

const Checkout = async ({ params }) => {
    const { locale } = await params;
    const shippingMethods = await getShippingMethods(locale);

    return (
        <section className="w-full bg-gray-light py-16 xl:py-32">
            <div className="max-w-480 mx-auto page-x">
                <div className="grid lg:grid-cols-[1fr_700px] gap-8">
                    {/* Checkout Form — left */}
                    <div className="flex flex-col">
                        <h1 className="font-aeonik text-[28px] xl:text-[35px] text-black-custom mb-2">Checkout</h1>
                        <CheckoutForm shippingMethods={shippingMethods} />
                    </div>

                    {/* Order Summary — right, sticky */}
                    <div>
                        <div className="sticky top-28">
                            <OrderSummary shippingMethods={shippingMethods} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;
