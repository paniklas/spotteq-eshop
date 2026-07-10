const inner = "bg-black/10"

// Stands in for OrderSummary until the cart rehydrates from localStorage, so the
// customer never sees "Your bag is empty." against a cart that simply has not loaded.
const OrderSummarySkeleton = () => (
    <div className="bg-white-custom rounded-2xl p-6 h-full animate-pulse">
        <div className={`h-9 w-1/2 rounded-md mb-6 ${inner}`} />

        {/* Items */}
        <div className="flex flex-col gap-4">
            {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-xl shrink-0 ${inner}`} />
                    <div className="flex-1 flex flex-col gap-2">
                        <div className={`h-4 w-3/4 rounded-md ${inner}`} />
                        <div className={`h-3 w-1/3 rounded-md ${inner}`} />
                    </div>
                    <div className={`h-6 w-16 rounded-md shrink-0 ${inner}`} />
                </div>
            ))}
        </div>

        {/* Coupon */}
        <div className={`h-12 w-full rounded-sm mt-8 ${inner}`} />

        {/* Totals */}
        <div className="mt-6 flex flex-col gap-3">
            <hr className="border-gray-mint" />
            {[0, 1].map((i) => (
                <div key={i} className="flex justify-between items-center">
                    <div className={`h-4 w-24 rounded-md ${inner}`} />
                    <div className={`h-4 w-16 rounded-md ${inner}`} />
                </div>
            ))}
            <hr className="border-gray-mint" />
            <div className="flex justify-between items-center">
                <div className={`h-6 w-20 rounded-md ${inner}`} />
                <div className={`h-6 w-24 rounded-md ${inner}`} />
            </div>
        </div>
    </div>
)

export default OrderSummarySkeleton
