import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const SHIPPING_QUERY = defineQuery(`
  *[_type == "shipping" && isActive == true] | order(price asc) {
    _id,
    "name": name[language == $locale][0].value,
    "estimatedDeliveryTime": estimatedDeliveryTime[language == $locale][0].value,
    "description": description[language == $locale][0].value,
    price,
    freeShippingMinimum,
    availableRegions
  }
`);

export async function getShippingMethods(locale = "el") {
  const result = await sanityFetch({
    query: SHIPPING_QUERY,
    params: { locale },
  });
  return result.data ?? [];
}
