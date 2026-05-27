import { client } from '../lib/client'

export async function getOrder(orderNumber, locale) {
  const query = `
    *[_type == 'order' && orderNumber == $orderNumber][0] {
      _id,
      orderNumber,
      customerName,
      email,
      currency,
      totalPrice,
      amountDiscount,
      status,
      orderDate,
      isGuestCheckout,
      shippingAddress,
      appliedCoupon {
        code,
        sale-> { _id, title, discountAmount }
      },
      products[] {
        _key,
        quantity,
        price,
        selectedFlavour,
        "product": product-> {
          _id,
          "name": title[language == $locale][0].value,
          "imageUrl": image.asset->url
        }
      },
      bundles[] {
        _key,
        quantity,
        price,
        "bundle": bundle-> {
          _id,
          "name": title[language == $locale][0].value,
          "imageUrl": image.asset->url
        }
      },
      shippingMethod-> {
        _id,
        "name": name[language == $locale][0].value,
        "estimatedDeliveryTime": estimatedDeliveryTime[language == $locale][0].value,
        price
      }
    }
  `
  return client.fetch(
    query,
    { orderNumber, locale },
    { next: { tags: [`order:${orderNumber}`], revalidate: 0 } }
  )
}
