import { client } from '../lib/client'

export async function getOrder(orderNumber, viewToken, locale) {
  if (!viewToken) return null

  const query = `
    *[_type == 'order' && orderNumber == $orderNumber && viewToken == $viewToken][0] {
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
        price,
        provider
      },
      boxNowLockerId,
      boxNowLockerName,
      boxNowLockerAddress,
      boxNowParcelId,
      boxNowParcelStatus
    }
  `
  return client.fetch(
    query,
    { orderNumber, viewToken, locale },
    { next: { tags: [`order:${orderNumber}`], revalidate: 0 } }
  )
}
