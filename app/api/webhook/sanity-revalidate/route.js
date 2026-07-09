import "server-only";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

// Sanity Studio webhook config (Settings > API > Webhooks):
//   URL:      https://<your-domain>/api/webhook/sanity-revalidate
//   Dataset:  production
//   Trigger:  Create, Update, Delete
//   Filter:   _type in ["product", "category", "categoryGroup", "bundle", "homePage"]
//   Projection:
//     {
//       "type": _type,
//       "slugEn": slugs.en.current,
//       "slugEl": slugs.el.current
//     }
//   Secret:   value of SANITY_REVALIDATE_WEBHOOK_SECRET (below)
export async function POST(req) {
  const { body, isValidSignature } = await parseBody(
    req,
    process.env.SANITY_REVALIDATE_WEBHOOK_SECRET
  );

  if (!isValidSignature) {
    return new Response("Invalid signature", { status: 401 });
  }
  if (!body?.type) {
    return new Response("Missing document type", { status: 400 });
  }

  const { type, slugEn, slugEl } = body;
  const tags = [];

  switch (type) {
    case "product":
      // Bundles embed constituent product data (price/title/inventory) in both
      // their listings and detail pages, so a product change must also refresh
      // the bundle caches — hence "bundles" here alongside "products".
      tags.push("products", "bundles");
      if (slugEn) tags.push(`product:${slugEn}`);
      if (slugEl) tags.push(`product:${slugEl}`);
      break;
    case "category":
      tags.push("categories", "nav");
      if (slugEn) tags.push(`category:${slugEn}`);
      if (slugEl) tags.push(`category:${slugEl}`);
      break;
    case "categoryGroup":
      tags.push("nav");
      break;
    case "bundle":
      tags.push("bundles", "nav");
      if (slugEn) tags.push(`bundle:${slugEn}`);
      if (slugEl) tags.push(`bundle:${slugEl}`);
      break;
    case "homePage":
      tags.push("homePage", "products");
      break;
    default:
      return new Response(`Ignored type: ${type}`, { status: 200 });
  }

  // { expire: 0 } forces immediate expiration (same as the deprecated no-arg
  // call) without the deprecation warning — the next request for this tag
  // gets fresh data right away instead of stale-while-revalidate.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: true, tags });
}
