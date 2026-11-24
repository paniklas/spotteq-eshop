"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle, Clock, XCircle, PackageSearch, MapPin, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

// ---------------------------------------------------------------------------
// Status views
// ---------------------------------------------------------------------------

const OrderPaid = ({ order, orderNumber, locale }) => {
  const t = useTranslations("checkout");
  const addr = order.shippingAddress;
  const fmt  = (n) => Number(n).toFixed(2).replace(".", ",");

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle className="w-16 h-16 text-teal-accent" strokeWidth={1.5} />
        <h1 className="font-aeonik text-[28px] xl:text-[35px] text-black-custom">
          {t("success.thankYou")}
        </h1>
        <p className="font-aeonik text-[14px] text-gray-text">
          {t.rich("success.confirmationSent", {
            email: order.email,
            b: (chunks) => <span className="text-black-custom">{chunks}</span>,
          })}
        </p>
        <p className="font-aeonik text-[13px] text-gray-text bg-white-custom rounded-xl px-4 py-2">
          {t("success.orderNumber")}{" "}
          <span className="font-semibold text-black-custom">{orderNumber}</span>
        </p>
      </div>

      {/* Items */}
      {(order.products?.length > 0 || order.bundles?.length > 0) && (
        <div className="bg-white-custom rounded-2xl p-6">
          <h2 className="font-aeonik text-[15px] uppercase text-black-custom mb-5">
            {t("success.itemsOrdered")}
          </h2>
          <div className="flex flex-col divide-y divide-gray-mint">
            {order.products?.map((line) => (
              <div key={line._key} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                {line.product?.imageUrl && (
                  <div className="relative w-16 h-20 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-soft rounded-full z-0" />
                    <Image
                      src={line.product.imageUrl}
                      alt={line.product.name ?? t("success.productAlt")}
                      width={48}
                      height={60}
                      unoptimized
                      className="w-[80%] h-[80%] object-contain relative z-1"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-aeonik text-[14px] text-black-custom">{line.product?.name}</p>
                  {line.selectedFlavour && (
                    <p className="font-aeonik text-[12px] text-gray-text">{line.selectedFlavour}</p>
                  )}
                  <p className="font-aeonik text-[12px] text-gray-text">{t("success.qty", { qty: line.quantity })}</p>
                </div>
                <span className="font-tt text-[15px] text-black-custom shrink-0">
                  {fmt(line.price * line.quantity)}€
                </span>
              </div>
            ))}
            {order.bundles?.map((line) => (
              <div key={line._key} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                {line.bundle?.imageUrl && (
                  <div className="relative w-16 h-20 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-soft rounded-full z-0" />
                    <Image
                      src={line.bundle.imageUrl}
                      alt={line.bundle.name ?? t("success.bundleAlt")}
                      width={48}
                      height={60}
                      unoptimized
                      className="w-[80%] h-[80%] object-contain relative z-1"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-aeonik text-[14px] text-black-custom">{line.bundle?.name}</p>
                  {line.selectedFlavours?.map((f) => (
                    <p key={f._key} className="font-aeonik text-[12px] text-black-custom leading-snug">
                      {f.variantName}{f.flavourName ? ` – ${f.flavourName}` : ""}
                    </p>
                  ))}
                  <p className="font-aeonik text-[12px] text-gray-text">{t("success.bundleQty", { qty: line.quantity })}</p>
                </div>
                <span className="font-tt text-[15px] text-black-custom shrink-0">
                  {fmt(line.price * line.quantity)}€
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="bg-white-custom rounded-2xl p-6">
        <h2 className="font-aeonik text-[15px] uppercase text-black-custom mb-5">{t("success.orderTotal")}</h2>
        <div className="flex flex-col gap-3">
          {order.amountDiscount > 0 && (
            <div className="flex justify-between">
              <span className="font-aeonik text-[13px] text-gray-text">{t("success.discount")}</span>
              <span className="font-tt text-[14px] text-teal-accent">
                -{fmt(order.amountDiscount)}€
              </span>
            </div>
          )}
          {order.shippingMethod && (
            <div className="flex justify-between">
              <span className="font-aeonik text-[13px] text-gray-text">
                {order.shippingMethod.name}
              </span>
              <span className="font-tt text-[14px] text-black-custom">
                {order.shippingMethod.price === 0 ? t("success.free") : `${fmt(order.shippingMethod.price)}€`}
              </span>
            </div>
          )}
          <hr className="border-gray-mint" />
          <div className="flex justify-between">
            <span className="font-aeonik text-[16px] uppercase text-black-custom">{t("success.total")}</span>
            <span className="font-aeonik text-[24px] font-bold text-black-custom">
              {fmt(order.totalPrice)}€
            </span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {addr && (
        <div className="bg-white-custom rounded-2xl p-6">
          <h2 className="font-aeonik text-[15px] uppercase text-black-custom mb-4">
            {t("success.shippingAddress")}
          </h2>
          <div className="font-aeonik text-[14px] text-black-custom space-y-1">
            <p>{addr.firstName} {addr.lastName}</p>
            <p>{addr.address}{addr.apartment ? `, ${addr.apartment}` : ""}</p>
            <p>{addr.postalCode} {addr.city}</p>
            <p>{addr.country === "GR" ? t("greece") : addr.country}</p>
            {addr.phone && <p>{addr.phone}</p>}
          </div>
        </div>
      )}

      {/* BoxNow locker info */}
      {order.boxNowLockerId && (
        <div className="bg-white-custom rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-teal-accent shrink-0" strokeWidth={1.5} />
            <h2 className="font-aeonik text-[15px] uppercase text-black-custom">
              {t("success.boxNowLocker")}
            </h2>
          </div>
          <div className="font-aeonik text-[14px] text-black-custom space-y-1 mb-4">
            {order.boxNowLockerName && <p className="font-semibold">{order.boxNowLockerName}</p>}
            {order.boxNowLockerAddress && <p className="text-gray-text">{order.boxNowLockerAddress}</p>}
          </div>
          {order.boxNowParcelId ? (
            <div className="rounded-lg bg-gray-light px-4 py-3">
              <p className="font-aeonik text-[12px] text-gray-text uppercase mb-1">{t("success.parcelId")}</p>
              <p className="font-tt text-[15px] text-black-custom">{order.boxNowParcelId}</p>
            </div>
          ) : (
            <div className="rounded-lg bg-gray-light px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-gray-text animate-spin shrink-0" strokeWidth={1.5} />
              <p className="font-aeonik text-[13px] text-gray-text">
                {t("success.awaitingParcel")}
              </p>
            </div>
          )}
          <p className="mt-4 font-aeonik text-[13px] text-gray-text">
            {t("success.boxNowSms")}
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="flex justify-center">
        <Link
          href="/"
          className="h-14 px-12 bg-black-custom font-aeonik text-[15px] uppercase text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 flex items-center"
        >
          {t("success.continueShopping")}
        </Link>
      </div>
    </div>
  );
};

const bold = (chunks) => <span className="font-semibold text-black-custom">{chunks}</span>;

const OrderPending = ({ orderNumber }) => {
  const t = useTranslations("checkout.success");
  return (
    <div className="flex flex-col items-center gap-6 text-center py-12">
      <Clock className="w-16 h-16 text-orange-accent" strokeWidth={1.5} />
      <h1 className="font-aeonik text-[28px] text-black-custom">{t("pendingTitle")}</h1>
      <p className="font-aeonik text-[14px] text-gray-text max-w-md">
        {t.rich("pendingText", { orderNumber, b: bold })}
      </p>
    </div>
  );
};

const OrderFailed = ({ orderNumber }) => {
  const t = useTranslations("checkout.success");
  return (
    <div className="flex flex-col items-center gap-6 text-center py-12">
      <XCircle className="w-16 h-16 text-red-400" strokeWidth={1.5} />
      <h1 className="font-aeonik text-[28px] text-black-custom">{t("failedTitle")}</h1>
      <p className="font-aeonik text-[14px] text-gray-text max-w-md">
        {t.rich("failedText", { orderNumber, b: bold })}
      </p>
      <Link
        href="/checkout"
        className="h-14 px-12 bg-black-custom font-aeonik text-[15px] uppercase text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 flex items-center"
      >
        {t("tryAgain")}
      </Link>
    </div>
  );
};

const OrderNotFound = () => {
  const t = useTranslations("checkout.success");
  return (
    <div className="flex flex-col items-center gap-6 text-center py-12">
      <PackageSearch className="w-16 h-16 text-gray-text" strokeWidth={1.5} />
      <h1 className="font-aeonik text-[28px] text-black-custom">{t("notFoundTitle")}</h1>
      <p className="font-aeonik text-[14px] text-gray-text max-w-md">
        {t.rich("notFoundText", {
          link: (chunks) => <Link href="/contact" className="underline">{chunks}</Link>,
        })}
      </p>
      <Link
        href="/shop/shop-all"
        className="h-14 px-12 bg-black-custom font-aeonik text-[15px] uppercase text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 flex items-center"
      >
        {t("backToShop")}
      </Link>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Root client component — clears cart, then delegates to a status view
// ---------------------------------------------------------------------------

const OrderSuccess = ({ order, orderNumber, locale, paymentConfirmed }) => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (order?.status === "paid") clearCart();
  }, [order?.status, clearCart]);

  if (!order) return <OrderNotFound />;

  if (order.status === "paid" || paymentConfirmed) {
    return <OrderPaid order={order} orderNumber={orderNumber} locale={locale} />;
  }

  if (order.status === "pending") {
    return <OrderPending orderNumber={orderNumber} />;
  }

  return <OrderFailed orderNumber={orderNumber} />;
};

export default OrderSuccess;
