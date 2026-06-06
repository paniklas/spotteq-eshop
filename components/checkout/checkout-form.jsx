"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";
import { validateCartInventory } from "@/app/actions/cart";
import { checkoutSchema } from "@/lib/checkoutSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PortableText } from "@portabletext/react";
import StripePaymentWrapper from "./stripe-payment-wrapper";

// ---------------------------------------------------------------------------
// Design primitives — kept from original spotteq design
// ---------------------------------------------------------------------------

const FloatingInput = ({ id, label, type = "text", optional = false, className = "", ref, ...props }) => (
  <div className={`relative ${className}`}>
    <input
      ref={ref}
      id={id}
      type={type}
      placeholder=" "
      {...props}
      className="peer w-full border border-gray-mint rounded-xl px-4 py-4 font-aeonik text-[14px] text-black-custom outline-none bg-transparent focus:border-black-custom transition-colors duration-200"
    />
    <label
      htmlFor={id}
      className="absolute left-3 top-0 -translate-y-1/2 bg-white-custom px-1 font-aeonik text-[11px] text-black-custom/50 pointer-events-none transition-colors duration-200 peer-focus:text-black-custom"
    >
      {label}
    </label>
    {optional && (
      <span className="absolute right-3 top-0 -translate-y-1/2 bg-white-custom px-1 font-aeonik text-[10px] text-black-custom/40 pointer-events-none">
        Optional
      </span>
    )}
  </div>
);

const FloatingSelect = ({ id, label, className = "", children, ref, ...props }) => (
  <div className={`relative ${className}`}>
    <select
      ref={ref}
      id={id}
      {...props}
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
      <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
        <path d="M1 1L6 6L11 1" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-white-custom rounded-2xl p-6 mb-5">
    {title && (
      <h2 className="font-aeonik text-[16px] xl:text-[18px] uppercase text-black-custom mb-5">
        {title}
      </h2>
    )}
    {children}
  </div>
);

const BILLING_FIELDS = [
  "billingFirstName", "billingLastName", "billingCompany",
  "billingAddress",   "billingApartment", "billingCity",
  "billingPostalCode","billingCountry",   "billingPhone",
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const CheckoutForm = ({ shippingMethods = [] }) => {
  const locale = useLocale();

  const {
    cartItems,
    appliedCoupon,
    setCheckoutEmail,
    setSelectedShippingMethod,
  } = useCartStore();

  const { savedInfo, saveCustomerInfo, clearCustomerInfo } = useCustomerStore();

  const [isPending, startTransition] = useTransition();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [inventoryIssues, setInventoryIssues] = useState([]);
  const [inventoryError, setInventoryError] = useState(false);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [selectedMethodId, setSelectedMethodId] = useState(
    shippingMethods.length === 1 ? shippingMethods[0]._id : ""
  );

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email:               "",
      emailMarketing:      false,
      firstName:           "",
      lastName:            "",
      company:             "",
      address:             "",
      apartment:           "",
      city:                "",
      postalCode:          "",
      country:             "GR",
      phone:               "",
      saveInfo:            false,
      useShippingAsBilling: true,
      billingFirstName:    "",
      billingLastName:     "",
      billingCompany:      "",
      billingAddress:      "",
      billingApartment:    "",
      billingCity:         "",
      billingPostalCode:   "",
      billingCountry:      "GR",
      billingPhone:        "",
      shippingMethodId:    shippingMethods.length === 1 ? shippingMethods[0]._id : "",
      agreeTerms:          false,
    },
  });

  // Pre-fill form with saved customer info after Zustand hydrates from localStorage
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current || !savedInfo) return;
    prefilled.current = true;
    form.reset({
      ...form.getValues(),
      firstName:      savedInfo.firstName      ?? "",
      lastName:       savedInfo.lastName       ?? "",
      company:        savedInfo.company        ?? "",
      address:        savedInfo.address        ?? "",
      apartment:      savedInfo.apartment      ?? "",
      city:           savedInfo.city           ?? "",
      postalCode:     savedInfo.postalCode     ?? "",
      phone:          savedInfo.phone          ?? "",
      emailMarketing: savedInfo.emailMarketing ?? false,
      saveInfo:       true,
    });
  }, [savedInfo, form]);

  const handleShippingSelect = (method) => {
    form.setValue("shippingMethodId", method._id, { shouldValidate: true });
    setSelectedMethodId(method._id);
    setSelectedShippingMethod(method);
  };

  const onSubmit = (data) => {
    setInventoryIssues([]);
    setInventoryError(false);

    startTransition(async () => {
      // Validate inventory before proceeding to payment
      const { valid, issues, error } = await validateCartInventory(cartItems, locale);

      if (error === "validation_failed") {
        setInventoryError(true);
        return;
      }
      if (!valid) {
        setInventoryIssues(issues);
        return;
      }

      // Build customerInfo for the payment intent
      const customerInfo = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        apartment: data.apartment  ?? "",
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        emailMarketing: data.emailMarketing,
      };

      if (data.saveInfo) {
        saveCustomerInfo({
          firstName:      data.firstName,
          lastName:       data.lastName,
          company:        data.company        ?? "",
          address:        data.address,
          apartment:      data.apartment      ?? "",
          city:           data.city,
          postalCode:     data.postalCode,
          country:        data.country,
          phone:          data.phone,
          emailMarketing: data.emailMarketing,
        });
      } else {
        clearCustomerInfo();
      }

      setPaymentData({
        customerInfo,
        shippingMethodId: data.shippingMethodId,
      });
      setShowPayment(true);
    });
  };

  const handleBack = () => {
    setShowPayment(false);
    setPaymentData(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isPending || showPayment}>

          {/* ── Contact ─────────────────────────────────────────────────── */}
          <SectionCard title="Contact">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        {...field}
                        id="email"
                        type="email"
                        label="Email"
                        onChange={(e) => {
                          field.onChange(e);
                          setCheckoutEmail(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailMarketing"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-mint data-[state=checked]:bg-black-custom data-[state=checked]:border-black-custom"
                      />
                    </FormControl>
                    <span className="font-aeonik text-[12px] text-black-custom leading-tight">
                      Subscribe to receive news and offers via email.
                    </span>
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          {/* ── Delivery ────────────────────────────────────────────────── */}
          <SectionCard title="Delivery">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingSelect {...field} id="country" label="Country / Region" disabled>
                        <option value="GR">Greece</option>
                      </FloatingSelect>
                    </FormControl>
                    <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingInput {...field} id="firstName" label="First name" />
                      </FormControl>
                      <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingInput {...field} id="lastName" label="Last name" />
                      </FormControl>
                      <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput {...field} id="company" label="Company" optional />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput {...field} id="address" label="Address" />
                    </FormControl>
                    <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apartment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput {...field} id="apartment" label="Apartment, suite, etc." optional />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingInput {...field} id="postalCode" label="Postal code" />
                      </FormControl>
                      <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingInput {...field} id="city" label="City" />
                      </FormControl>
                      <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput {...field} id="phone" type="tel" label="Phone" />
                    </FormControl>
                    <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="saveInfo"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (!checked) clearCustomerInfo();
                        }}
                        className="border-gray-mint data-[state=checked]:bg-black-custom data-[state=checked]:border-black-custom"
                      />
                    </FormControl>
                    <span className="font-aeonik text-[12px] text-black-custom">
                      Save this information for next time
                    </span>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="useShippingAsBilling"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setUseShippingAsBilling(checked);
                          if (checked) {
                            BILLING_FIELDS.forEach((f) => {
                              form.setValue(f, "");
                              form.clearErrors(f);
                            });
                          }
                        }}
                        className="border-gray-mint data-[state=checked]:bg-black-custom data-[state=checked]:border-black-custom"
                      />
                    </FormControl>
                    <span className="font-aeonik text-[12px] text-black-custom">
                      Use shipping address as billing address
                    </span>
                  </FormItem>
                )}
              />

              {/* ── Billing address (conditional) ────────────────────────── */}
              {!useShippingAsBilling && (
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-mint">
                  <p className="font-aeonik text-[15px] text-black-custom">Billing address</p>

                  <FormField
                    control={form.control}
                    name="billingCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingSelect {...field} id="billingCountry" label="Country / Region" disabled>
                            <option value="GR">Greece</option>
                          </FloatingSelect>
                        </FormControl>
                        <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="billingFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingInput {...field} id="billingFirstName" label="First name" />
                          </FormControl>
                          <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingInput {...field} id="billingLastName" label="Last name" />
                          </FormControl>
                          <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="billingCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingInput {...field} id="billingCompany" label="Company" optional />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingInput {...field} id="billingAddress" label="Address" />
                        </FormControl>
                        <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billingApartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingInput {...field} id="billingApartment" label="Apartment, suite, etc." optional />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="billingPostalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingInput {...field} id="billingPostalCode" label="Postal code" />
                          </FormControl>
                          <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingInput {...field} id="billingCity" label="City" />
                          </FormControl>
                          <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="billingPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingInput {...field} id="billingPhone" type="tel" label="Phone" />
                        </FormControl>
                        <FormMessage className="font-aeonik text-[12px] text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Shipping Method ─────────────────────────────────────────── */}
          <SectionCard title="Shipping Method">
            {shippingMethods.length === 0 ? (
              <p className="font-aeonik text-[14px] text-gray-text">
                No shipping methods available. Please add them in the CMS.
              </p>
            ) : (
              <FormField
                control={form.control}
                name="shippingMethodId"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col">
                        {shippingMethods.map((method, i) => (
                          <button
                            key={method._id}
                            type="button"
                            onClick={() => handleShippingSelect(method)}
                            className={`flex items-start justify-between py-4 text-left transition-colors duration-200 ${
                              i < shippingMethods.length - 1 ? "border-b border-gray-mint" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                  selectedMethodId === method._id
                                    ? "border-black-custom"
                                    : "border-gray-mint"
                                }`}
                              >
                                {selectedMethodId === method._id && (
                                  <div className="w-2 h-2 rounded-full bg-black-custom" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="font-aeonik text-[14px] text-black-custom">
                                  {method.name}
                                </p>
                                {method.description && (
                                  <div className="font-aeonik text-[12px] text-gray-text leading-snug [&_p]:mb-0">
                                    <PortableText value={method.description} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="font-aeonik text-[14px] text-black-custom shrink-0 ml-4">
                              {method.price === 0
                                ? "FREE"
                                : `${method.price.toFixed(2).replace(".", ",")}€`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="font-aeonik text-[12px] text-red-500 mt-2" />
                  </FormItem>
                )}
              />
            )}
          </SectionCard>

          {/* ── Terms + Submit ───────────────────────────────────────────── */}
          <SectionCard>
            <p className="font-aeonik text-[12px] text-black-custom leading-relaxed">
              Your personal data will be used to process your order as described in our{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>

            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem className="mt-5 space-y-0">
                  <div className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-mint data-[state=checked]:bg-black-custom data-[state=checked]:border-black-custom mt-0.5"
                      />
                    </FormControl>
                    <span className="font-aeonik text-[12px] text-black-custom leading-snug">
                      I have read and agree to the SPOTTEQ{" "}
                      <Link href="/terms" className="underline">Terms and Conditions</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="underline">Privacy Policy</Link>.
                    </span>
                  </div>
                  <FormMessage className="font-aeonik text-[12px] text-red-500 mt-2" />
                </FormItem>
              )}
            />

            {/* Inventory errors */}
            {inventoryError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="font-aeonik text-[13px] text-red-700 font-semibold">
                  Unable to verify stock. Please try again.
                </p>
              </div>
            )}
            {inventoryIssues.length > 0 && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col gap-2">
                <p className="font-aeonik text-[13px] text-red-700 font-semibold">
                  Some items are no longer available in the requested quantity:
                </p>
                {inventoryIssues.map((issue) => (
                  <p key={issue.productId} className="font-aeonik text-[12px] text-red-600">
                    <span className="font-semibold">{issue.title}</span>
                    {" — "}requested {issue.requested}, only {issue.available} available
                  </p>
                ))}
                <p className="font-aeonik text-[12px] text-red-500">
                  Please update your cart before proceeding.
                </p>
              </div>
            )}

            {!showPayment && (
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-14 w-full bg-black-custom font-aeonik text-[16px] uppercase text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? "Checking…" : "Continue to Payment"}
                </button>
              </div>
            )}
          </SectionCard>

        </fieldset>
      </form>

      {/* ── Payment section — shown after form validates ────────────────── */}
      {showPayment && paymentData && (
        <StripePaymentWrapper
          customerInfo={paymentData.customerInfo}
          items={cartItems}
          shippingMethodId={paymentData.shippingMethodId}
          coupon={appliedCoupon}
          locale={locale}
          onBack={handleBack}
        />
      )}
    </Form>
  );
};

export default CheckoutForm;
