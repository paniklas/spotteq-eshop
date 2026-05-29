"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart-store";
import { validateCartInventory } from "@/app/actions/cart";


const SHIPPING_METHODS = [
    { id: "geniki", name: "ΓΕΝΙΚΗ ΤΑΧΥΔΡΟΜΙΚΗ", eta: "Τα Διαθέσιμα προϊόντα παραδίδονται σε 1−3 εργάσιμες ημέρες στην πόρτα σου, Δωρεάν για παραγγελίες άνω των 95,50€.\n(εξαιρούνται οι δυσπρόσιτες περιοχές και παραγγελίες άνω των 10kg για Αττική και άνω των 5kg για την υπόλοιπη Ελλάδα.)", price: 5 },
    { id: "box", name: "Παραλαβή απο BOX NOW - LOCKER", eta: "", price: 2.50 },
    // { id: "free", name: "Free Shipping", eta: "5-7 business days", price: 0 },
]

const FloatingInput = ({ id, label, type = "text", value, onChange, optional = false, className = "" }) => (
    <div className={`relative ${className}`}>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            className="peer w-full border border-gray-mint rounded-xl px-4 py-4 font-aeonik text-[14px] text-black-custom outline-none bg-transparent focus:border-black-custom transition-colors duration-200"
        />
        <label
            htmlFor={id}
            className="absolute left-3 top-0 -translate-y-1/2 bg-white-custom px-1 font-aeonik text-[11px] text-black-custom/50 pointer-events-none transition-colors duration-200 peer-focus:text-black-custom"
        >
            {label}
        </label>
        {optional && (
            <span className="absolute right-3 top-0 -translate-y-1/2 bg-white-custom px-1 font-aeonik text-[10px] text-black-custom/40 pointer-events-none transition-colors duration-200 peer-focus:text-black-custom">
                Προαιρετικό
            </span>
        )}
    </div>
)

const FloatingSelect = ({ id, label, value, onChange, children }) => (
    <div className="relative">
        <select
            id={id}
            value={value}
            onChange={onChange}
            className="peer w-full border border-gray-mint rounded-xl px-4 py-4 font-aeonik text-[14px] text-black-custom outline-none bg-transparent focus:border-black-custom transition-colors duration-200 appearance-none"
        >
            {children}
        </select>
        <label
            htmlFor={id}
            className="absolute left-3 top-0 -translate-y-1/2 bg-white-custom px-1 font-aeonik text-[11px] text-black-custom/50 pointer-events-none transition-colors duration-200 peer-focus:text-black-custom"
        >
            {label}
        </label>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M1 1L6 6L11 1" stroke="#000" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
    </div>
)

const SectionCard = ({ title, children }) => (
    <div className="bg-white-custom rounded-2xl p-6 mb-5">
        <h2 className="font-aeonik text-[16px] xl:text-[18px] uppercase text-black-custom mb-5">{title}</h2>
        {children}
    </div>
)

const CheckoutForm = () => {
    const locale = useLocale()
    const { cartItems, couponDiscount, setCheckoutEmail } = useCartStore()
    const [validating, setValidating] = useState(false)
    const [inventoryIssues, setInventoryIssues] = useState([])
    const [validationError, setValidationError] = useState(false)

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const discountAmount = couponDiscount > 0 ? (cartTotal * couponDiscount) / 100 : 0
    const discountedTotal = cartTotal - discountAmount
    const [form, setForm] = useState({
        email: "",
        emailMe: false,
        country: "GR",
        firstName: "",
        lastName: "",
        company: "",
        address: "",
        apartment: "",
        postalCode: "",
        city: "",
        phone: "",
        saveInfo: false,
        useBillingAsShipping: true,
        billingFirstName: "",
        billingLastName: "",
        billingCompany: "",
        billingCountry: "GR",
        billingAddress: "",
        billingApartment: "",
        billingPostalCode: "",
        billingCity: "",
        billingPhone: "",
        shippingMethod: "geniki",
        agreeTerms: false,
    })

    const set = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }))

    const selectedMethod = SHIPPING_METHODS.find((m) => m.id === form.shippingMethod)

    const handlePayNow = async () => {
        setInventoryIssues([])
        setValidationError(false)
        setValidating(true)
        const { valid, issues, error } = await validateCartInventory(cartItems, locale)
        setValidating(false)
        if (error === "validation_failed") {
            setValidationError(true)
            return
        }
        if (!valid) {
            setInventoryIssues(issues)
            return
        }
        // TODO: proceed to payment
    }

    return (
        <div className="pt-4">
            {/* Contact */}
            <SectionCard title="Contact">
                <div className="flex flex-col gap-4">
                    <FloatingInput id="email" type="email" label="Email" value={form.email} onChange={(e) => { set("email")(e); setCheckoutEmail(e.target.value) }} />
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.emailMe}
                            onChange={set("emailMe")}
                            className="w-4 h-4 accent-black-custom"
                        />
                        <span className="font-aeonik text-[12px] text-black-custom">Subscribe to receive news and offers via email. Don&apos;t worry we promise not to spam you.</span>
                    </label>
                </div>
            </SectionCard>

            {/* Delivery */}
            <SectionCard title="Delivery">
                <div className="flex flex-col gap-4">
                    <FloatingSelect id="country" label="Country / Region" value={form.country} onChange={set("country")}>
                        <option value="GR">Greece</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="NL">Netherlands</option>
                        <option value="AT">Austria</option>
                        <option value="SE">Sweden</option>
                        <option value="BE">Belgium</option>
                        <option value="PT">Portugal</option>
                    </FloatingSelect>

                    <div className="grid grid-cols-2 gap-4">
                        <FloatingInput id="firstName" label="First name" value={form.firstName} onChange={set("firstName")} />
                        <FloatingInput id="lastName" label="Last name" value={form.lastName} onChange={set("lastName")} />
                    </div>

                    <FloatingInput id="company" label="Company" optional value={form.company} onChange={set("company")} />
                    <FloatingInput id="address" label="Address" value={form.address} onChange={set("address")} />
                    <FloatingInput id="apartment" label="Apartment, suite, etc." optional value={form.apartment} onChange={set("apartment")} />

                    <div className="grid grid-cols-2 gap-4">
                        <FloatingInput id="postalCode" label="Postal code" value={form.postalCode} onChange={set("postalCode")} />
                        <FloatingInput id="city" label="City" value={form.city} onChange={set("city")} />
                    </div>

                    <FloatingInput id="phone" label="Phone" value={form.phone} onChange={set("phone")} />

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.saveInfo}
                            onChange={set("saveInfo")}
                            className="w-4 h-4 accent-black-custom"
                        />
                        <span className="font-aeonik text-[12px] text-black-custom">Save this information for next time</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.useBillingAsShipping}
                            onChange={set("useBillingAsShipping")}
                            className="w-4 h-4 accent-black-custom"
                        />
                        <span className="font-aeonik text-[12px] text-black-custom">Use shipping address as billing address</span>
                    </label>

                    {!form.useBillingAsShipping && (
                        <div className="flex flex-col gap-4 mt-2 pt-4 border-t border-gray-mint">
                            <p className="font-aeonik text-[16px] text-black-custom">Billing address</p>
                            <FloatingSelect id="billingCountry" label="Country / Region" value={form.billingCountry} onChange={set("billingCountry")}>
                                <option value="GR">Greece</option>
                                <option value="DE">Germany</option>
                                <option value="FR">France</option>
                                <option value="IT">Italy</option>
                                <option value="ES">Spain</option>
                            </FloatingSelect>
                            <div className="grid grid-cols-2 gap-4">
                                <FloatingInput id="billingFirstName" label="First name" value={form.billingFirstName} onChange={set("billingFirstName")} />
                                <FloatingInput id="billingLastName" label="Last name" value={form.billingLastName} onChange={set("billingLastName")} />
                            </div>
                            <FloatingInput id="billingCompany" label="Company" optional value={form.billingCompany} onChange={set("billingCompany")} />
                            <FloatingInput id="billingAddress" label="Address" value={form.billingAddress} onChange={set("billingAddress")} />
                            <FloatingInput id="billingApartment" label="Apartment, suite, etc." optional value={form.billingApartment} onChange={set("billingApartment")} />
                            <div className="grid grid-cols-2 gap-4">
                                <FloatingInput id="billingPostalCode" label="Postal code" value={form.billingPostalCode} onChange={set("billingPostalCode")} />
                                <FloatingInput id="billingCity" label="City" value={form.billingCity} onChange={set("billingCity")} />
                            </div>
                            <FloatingInput id="billingPhone" label="Phone" value={form.billingPhone} onChange={set("billingPhone")} />
                        </div>
                    )}
                </div>
            </SectionCard>

            {/* Shipping Method */}
            <SectionCard title="Shipping Method">
                <div className="flex flex-col">
                    {SHIPPING_METHODS.map((method, i) => (
                        <label
                            key={method.id}
                            onClick={() => setForm((f) => ({ ...f, shippingMethod: method.id }))}
                            className={`flex items-center justify-between py-4 cursor-pointer transition-colors duration-200 ${i < SHIPPING_METHODS.length - 1 ? "border-b border-gray-mint" : ""}`}
                        >
                            <div className="flex items-start gap-2">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${form.shippingMethod === method.id ? "border-black-custom" : "border-gray-mint"}`}>
                                    {form.shippingMethod === method.id && (
                                        <div className="w-2 h-2 rounded-full bg-black-custom" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <p className="font-aeonik text-[14px] text-black-custom">{method.name}</p>
                                    <p className="font-aeonik text-[12px] text-gray-text">{method.eta}</p>
                                </div>
                            </div>
                            <span className="font-aeonik text-[14px] text-black-custom">
                                {method.price === 0 ? "FREE" : `${method.price.toFixed(2).replace(".", ",")}€`}
                            </span>
                        </label>
                    ))}
                </div>
            </SectionCard>

            {/* Terms + Payment */}
            <div className="p-4">
                <p className="font-aeonik text-[12px] text-black-custom leading-relaxed">
                     I agree to the{" "}
                    <Link href="/terms" className="underline">Terms & Conditions.</Link>.
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
                    <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>

                <label className="flex items-center gap-3 cursor-pointer mt-5">
                    <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={set("agreeTerms")}
                        className="w-4 h-4 accent-black-custom"
                    />
                    <span className="font-aeonik text-[12px] text-black-custom">I have read and agree to the SPOTTEQ Terms and Conditions of Sales and to the Privacy Policy.</span>
                </label>

                {validationError && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="font-aeonik text-[13px] text-red-700 font-semibold">Unable to verify stock at this time. Please try again.</p>
                    </div>
                )}

                {inventoryIssues.length > 0 && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col gap-2">
                        <p className="font-aeonik text-[13px] text-red-700 font-semibold">Some items in your cart are no longer available in the requested quantity:</p>
                        {inventoryIssues.map((issue) => (
                            <p key={issue.productId} className="font-aeonik text-[12px] text-red-600">
                                <span className="font-semibold">{issue.title}</span>
                                {" — "}requested {issue.requested}, only {issue.available} available
                            </p>
                        ))}
                        <p className="font-aeonik text-[12px] text-red-500">Please update your cart before proceeding.</p>
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={handlePayNow}
                        disabled={validating}
                        className="h-14 w-full bg-black-custom font-aeonik text-[16px] uppercase text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {validating ? "CHECKING..." : (
                            <>
                                PAY NOW - <span className="font-semibold">{discountedTotal.toFixed(2).replace(".", ",")}€</span>
                                {selectedMethod && (
                                    <span className="ml-2 font-aeonik">
                                        — {selectedMethod.price === 0 ? "FREE" : `${selectedMethod.price.toFixed(2).replace(".", ",")}€`}
                                    </span>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CheckoutForm
