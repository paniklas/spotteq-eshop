import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { urlFor } from '../lib/image'

// Minimal bundle data for client-side cart suggestion matching.
export async function getAllBundlesForCart(locale) {
  const QUERY = defineQuery(`
    *[_type == "bundle" && status == true] {
      _id,
      "title": title[language == $locale][0].value,
      "slug": slugs[$locale].current,
      image,
      bundlePrice,
      saleBundlePrice,
      products[] {
        quantity,
        allowFlavourChange,
        "product": product-> {
          _id,
          price
        },
        // Locked slot -> only the default product matches; unlocked slot -> any
        // active flavour variant matches. Dereference then filter in JS below,
        // since filtering references by the target doc's field is unreliable.
        "variants": product->flavours[]-> { _id, "active": status }
      }
    }
  `)

  try {
    const bundles = await catalogFetch({
      query: QUERY,
      params: { locale },
      tags: ['bundles'],
    })

    return (bundles ?? []).map(bundle => ({
      ...bundle,
      imageUrl: bundle.image ? urlFor(bundle.image).width(120).url() : null,
      products: (bundle.products ?? []).map(item => ({
        quantity: item.quantity,
        allowFlavourChange: item.allowFlavourChange ?? false,
        product: item.product,
        // The set of cart product _ids that can fill this slot: the default
        // product always, plus active flavour variants when unlocked.
        matchIds: item.allowFlavourChange
          ? [item.product?._id, ...(item.variants ?? []).filter(v => v?.active !== false).map(v => v._id)].filter(Boolean)
          : [item.product?._id].filter(Boolean),
      })),
    }))
  } catch (error) {
    console.error('Error fetching bundles for cart', error)
    return []
  }
}
