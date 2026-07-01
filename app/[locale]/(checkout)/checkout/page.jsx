import { auth, currentUser } from "@clerk/nextjs/server";
import { getShippingMethods } from "@/sanity/getData/getShippingMethods";
import { getOrCreateUserInfo } from "@/sanity/getData/getOrCreateUserInfo";
import CheckoutForm from "@/components/checkout/checkout-form";
import OrderSummary from "@/components/checkout/order-summary";

const Checkout = async ({ params }) => {
    const { locale } = await params;
    const shippingMethods = await getShippingMethods(locale);

    // Prefill the form for signed-in users (guests get the default empty form).
    let accountDefaults = null;
    const { userId } = await auth();
    if (userId) {
        const [user, userInfo] = await Promise.all([currentUser(), getOrCreateUserInfo()]);
        const shipping = userInfo?.shippingInfo ?? {};
        accountDefaults = {
            email: user?.primaryEmailAddress?.emailAddress ?? userInfo?.email ?? "",
            firstName:  shipping.firstName  ?? user?.firstName ?? "",
            lastName:   shipping.lastName   ?? user?.lastName ?? "",
            company:    shipping.company    ?? "",
            address:    shipping.address    ?? "",
            apartment:  shipping.apartment  ?? "",
            city:       shipping.city       ?? "",
            postalCode: shipping.postalCode ?? "",
            country:    shipping.country    ?? "",
            phone:      shipping.phone      ?? "",
        };
    }

    return (
        <section className="w-full bg-gray-light py-16 xl:py-32">
            <div className="max-w-480 mx-auto page-x">
                <div className="grid lg:grid-cols-[1fr_700px] gap-8">
                    {/* Checkout Form — left */}
                    <div className="flex flex-col">
                        <h1 className="font-aeonik text-[28px] xl:text-[35px] text-black-custom mb-2">Checkout</h1>
                        <CheckoutForm shippingMethods={shippingMethods} accountDefaults={accountDefaults} />
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
