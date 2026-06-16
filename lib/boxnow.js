import "server-only";

const BOXNOW_API_URL     = process.env.BOXNOW_API_URL;
const CLIENT_ID          = process.env.BOXNOW_CLIENT_ID;
const CLIENT_SECRET      = process.env.BOXNOW_CLIENT_SECRET;
const ORIGIN_LOCATION_ID = process.env.BOXNOW_ORIGIN_LOCATION_ID;
const ORIGIN_PHONE       = process.env.BOXNOW_ORIGIN_PHONE;
const ORIGIN_EMAIL       = process.env.BOXNOW_ORIGIN_EMAIL;
const ORIGIN_NAME        = process.env.BOXNOW_ORIGIN_NAME;
const COMPARTMENT_SIZE   = parseInt(process.env.BOXNOW_DEFAULT_COMPARTMENT_SIZE ?? "1", 10);

// BoxNow widget always shows production lockers; if testing against the sandbox API
// you must set this to a known sandbox locker ID (e.g. "4" from the BoxNow test email).
// Leave unset in production — the widget-selected locker ID is used directly.
const TEST_DEST_LOCATION_ID = process.env.BOXNOW_TEST_DEST_LOCATION_ID ?? null;

let _tokenCache = null;

async function getAccessToken() {
  const now = Date.now();
  if (_tokenCache && _tokenCache.expiresAt > now + 30_000) {
    return _tokenCache.token;
  }

  const res = await fetch(`${BOXNOW_API_URL}/api/v1/auth-sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type:    "client_credentials",
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BoxNow auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  _tokenCache = {
    token:     data.access_token,
    expiresAt: now + (data.expires_in ?? 3600) * 1000,
  };
  return _tokenCache.token;
}

// BoxNow requires full international format: +30XXXXXXXXXX
function toGreekInternational(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("30") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `+30${digits.slice(1)}`;
  if (digits.length === 10) return `+30${digits}`;
  return phone; // already formatted or unknown — pass through
}

export async function createDeliveryRequest(order) {
  const token = await getAccessToken();

  const customerName = [
    order.shippingAddress?.firstName,
    order.shippingAddress?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const destLocationId = TEST_DEST_LOCATION_ID ?? order.boxNowLockerId;

  const payload = {
    orderNumber:         order.orderNumber,
    invoiceValue:        parseFloat(order.totalPrice ?? 0).toFixed(2),
    paymentMode:         "prepaid",
    amountToBeCollected: "0.00",
    origin: {
      contactNumber: toGreekInternational(ORIGIN_PHONE),
      contactEmail:  ORIGIN_EMAIL,
      contactName:   ORIGIN_NAME,
      locationId:    ORIGIN_LOCATION_ID,
    },
    destination: {
      contactNumber: toGreekInternational(order.shippingAddress?.phone ?? ""),
      contactEmail:  order.email ?? "",
      contactName:   customerName,
      locationId:    destLocationId,
    },
    items: [
      {
        id:              "1",
        name:            "order",
        value:           "0.00",
        compartmentSize: COMPARTMENT_SIZE,
        weight:          0,
      },
    ],
  };

  console.log("[boxnow] createDeliveryRequest payload:", JSON.stringify(payload, null, 2));

  const res = await fetch(`${BOXNOW_API_URL}/api/v1/delivery-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BoxNow createDeliveryRequest failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    deliveryRequestId: data.id,
    parcelId:          data.parcels?.[0]?.id ?? null,
  };
}
