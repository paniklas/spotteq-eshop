import { auth, currentUser } from "@clerk/nextjs/server";
import { getShippingMethods } from "@/sanity/getData/getShippingMethods";
import { getOrCreateUserInfo } from "@/sanity/getData/getOrCreateUserInfo";
import { getFirstOrderPromoPercent } from "@/sanity/getData/getFirstOrderPromo";
import CheckoutContent from "@/components/checkout/checkout-content";

const Checkout = async ({ params }) => {
    const { locale } = await params;
    const shippingMethods = await getShippingMethods(locale);

    // Prefill the form for signed-in users (guests get the default empty form).
    let accountDefaults = null;
    // Display only — the charged amount is recomputed in create-payment-intent
    // from the same two facts (promo active, profile has not used it yet).
    let firstOrderDiscountPercent = 0;
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

        if (!userInfo?.firstOrderDiscountUsed) {
            firstOrderDiscountPercent = await getFirstOrderPromoPercent();
        }
    }

    // min-h-dvh: the (checkout) group has no footer, so a short page would
    // otherwise expose the black <body> background beneath it.
    return (
        <section className="w-full min-h-dvh bg-gray-light py-16 xl:py-32">
            <div className="max-w-480 mx-auto page-x">
                <CheckoutContent
                    shippingMethods={shippingMethods}
                    accountDefaults={accountDefaults}
                    firstOrderDiscountPercent={firstOrderDiscountPercent}
                />
            </div>
        </section>
    );
};

export default Checkout;
