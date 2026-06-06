"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CheckCircle, Clock, XCircle, PackageSearch } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

// ---------------------------------------------------------------------------
// Status views
// ---------------------------------------------------------------------------

const OrderPaid = ({ order, orderNumber, locale }) => {
  const addr = order.shippingAddress;
  const fmt  = (n) => Number(n).toFixed(2).replace(".", ",");

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle className="w-16 h-16 text-teal-accent" strokeWidth={1.5} />
        <h1 className="font-aeonik text-[28px] xl:text-[35px] text-black-custom">
          Thank you for your order!
        </h1>
        <p className="font-aeonik text-[14px] text-gray-text">
          A confirmation email has been sent to{" "}
          <span className="text-black-custom">{order.email}</span>.
        </p>
        <p className="font-aeonik text-[13px] text-gray-text bg-white-custom rounded-xl px-4 py-2">
          Order number:{" "}
          <span className="font-semibold text-black-custom">{orderNumber}</span>
        </p>
      </div>

      {/* Items */}
      {(order.products?.length > 0 || order.bundles?.length > 0) && (
        <div className="bg-white-custom rounded-2xl p-6">
          <h2 className="font-aeonik text-[15px] uppercase text-black-custom mb-5">
            Items ordered
          </h2>
          <div className="flex flex-col divide-y divide-gray-mint">
            {order.products?.map((line) => (
              <div key={line._key} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                {line.product?.imageUrl && (
                  <div className="relative w-16 h-20 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-soft rounded-full z-0" />
                    <Image
                      src={line.product.imageUrl}
                      alt={line.product.name ?? "Product"}
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
                  <p className="font-aeonik text-[12px] text-gray-text">Qty: {line.quantity}</p>
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
                      alt={line.bundle.name ?? "Bundle"}
                      width={48}
                      height={60}
                      unoptimized
                      className="w-[80%] h-[80%] object-contain relative z-1"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-aeonik text-[14px] text-black-custom">{line.bundle?.name}</p>
                  <p className="font-aeonik text-[12px] text-gray-text">Bundle · Qty: {line.quantity}</p>
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
        <h2 className="font-aeonik text-[15px] uppercase text-black-custom mb-5">Order total</h2>
        <div className="flex flex-col gap-3">
          {order.amountDiscount > 0 && (
            <div className="flex justify-between">
              <span className="font-aeonik text-[13px] text-gray-text">Discount</span>
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
                {order.shippingMethod.price === 0 ? "FREE" : `${fmt(order.shippingMethod.price)}€`}
              </span>
            </div>
          )}
          <hr className="border-gray-mint" />
          <div className="flex justify-between">
            <span className="font-aeonik text-[16px] uppercase text-black-custom">Total</span>
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
            Shipping address
          </h2>
          <div className="font-aeonik text-[14px] text-black-custom space-y-1">
            <p>{addr.firstName} {addr.lastName}</p>
            <p>{addr.address}{addr.apartment ? `, ${addr.apartment}` : ""}</p>
            <p>{addr.postalCode} {addr.city}</p>
            <p>{addr.country}</p>
            {addr.phone && <p>{addr.phone}</p>}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex justify-center">
        <Link
          href="/"
          className="h-14 px-12 bg-black-custom font-aeonik text-[15px] uppercase text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 flex items-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

const OrderPending = ({ orderNumber }) => (
  <div className="flex flex-col items-center gap-6 text-center py-12">
    <Clock className="w-16 h-16 text-orange-accent" strokeWidth={1.5} />
    <h1 className="font-aeonik text-[28px] text-black-custom">Payment processing</h1>
    <p className="font-aeonik text-[14px] text-gray-text max-w-md">
      Your order <span className="font-semibold text-black-custom">{orderNumber}</span> has been
      placed and your payment is being confirmed. You will receive an email once it is complete.
    </p>
  </div>
);

const OrderFailed = ({ orderNumber, locale }) => (
  <div className="flex flex-col items-center gap-6 text-center py-12">
    <XCircle className="w-16 h-16 text-red-400" strokeWidth={1.5} />
    <h1 className="font-aeonik text-[28px] text-black-custom">Payment failed</h1>
    <p className="font-aeonik text-[14px] text-gray-text max-w-md">
      We could not process your payment for order{" "}
      <span className="font-semibold text-black-custom">{orderNumber}</span>. No charge was made.
    </p>
    <Link
      href={`/${locale}/checkout`}
      className="h-14 px-12 bg-black-custom font-aeonik text-[15px] uppercase text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 flex items-center"
    >
      Try Again
    </Link>
  </div>
);

const OrderNotFound = ({ locale }) => (
  <div className="flex flex-col items-center gap-6 text-center py-12">
    <PackageSearch className="w-16 h-16 text-gray-text" strokeWidth={1.5} />
    <h1 className="font-aeonik text-[28px] text-black-custom">Order not found</h1>
    <p className="font-aeonik text-[14px] text-gray-text max-w-md">
      We could not find this order. If you believe this is an error, please contact support.
    </p>
    <Link
      href={`/${locale}/shop/shop-all`}
      className="h-14 px-12 bg-black-custom font-aeonik text-[15px] uppercase text-white-custom rounded-xl hover:bg-gray-text transition-colors duration-300 flex items-center"
    >
      Back to Shop
    </Link>
  </div>
);

// ---------------------------------------------------------------------------
// Root client component — clears cart, then delegates to a status view
// ---------------------------------------------------------------------------

const OrderSuccess = ({ order, orderNumber, locale, paymentConfirmed }) => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (order?.status === "paid") clearCart();
  }, [order?.status, clearCart]);

  if (!order) return <OrderNotFound locale={locale} />;

  if (order.status === "paid" || paymentConfirmed) {
    return <OrderPaid order={order} orderNumber={orderNumber} locale={locale} />;
  }

  if (order.status === "pending") {
    return <OrderPending orderNumber={orderNumber} />;
  }

  return <OrderFailed orderNumber={orderNumber} locale={locale} />;
};

export default OrderSuccess;
