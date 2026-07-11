import { defineQuery } from 'next-sanity'
import { catalogFetch } from '../lib/catalogFetch'
import { urlFor } from '../lib/image'

export async function getBundleBySlug(slug, locale) {
  const QUERY = defineQuery(`
    *[_type == "bundle" && slugs[$locale].current == $slug && status == true][0] {
      _id,
      "title": title[language == $locale][0].value,
      "description": description[language == $locale][0].value,
      "slug": slugs[$locale].current,
      "productIds": products[].product->._id,
      image,
      galleryImages,
      bundlePrice,
      saleBundlePrice,
      badge,
      status,
      productDetails {
        "additionalInfo": additionalInfo[language == $locale][0].value
      },
      products[] {
        quantity,
        allowFlavourChange,
        "product": product-> {
          _id,
          "title": title[language == $locale][0].value,
          "flavourName": flavourName[language == $locale][0].value,
          image,
          price,
          salePrice,
          inventory,
          "slug": slugs[$locale].current
        },
        "flavours": product->flavours[]-> {
          _id,
          "flavourName": flavourName[language == $locale][0].value,
          image,
          inventory,
          "slug": slugs[$locale].current,
          "active": status
        }
      }
    }
  `)

  try {
    const bundle = await catalogFetch({
      query: QUERY,
      params: { slug, locale },
      // `bundles` (in addition to the per-slug tag) so a product change — which
      // purges `bundles` — also refreshes this page's embedded product data.
      tags: [`bundle:${slug}`, 'bundles'],
    })
    if (!bundle) return null

    return {
      ...bundle,
      imageUrl: bundle.image ? urlFor(bundle.image).width(800).url() : null,
      galleryImageUrls: bundle.galleryImages?.filter(img => img?.asset?._ref).map(img => urlFor(img).width(800).url()) ?? [],
      products: bundle.products?.map(item => ({
        ...item,
        product: item.product
          ? { ...item.product, imageUrl: item.product.image ? urlFor(item.product.image).width(300).url() : null }
          : null,
        // Only variants that are still active are selectable; the default product
        // is always included by the admin reference even if flavours is empty.
        flavours: (item.flavours ?? [])
          .filter(f => f?.active !== false)
          .map(f => ({ ...f, imageUrl: f.image ? urlFor(f.image).width(120).url() : null })),
      })) ?? [],
    }
  } catch (error) {
    console.error('Error fetching bundle by slug', error)
    return null
  }
}
