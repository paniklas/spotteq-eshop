import { client } from '../lib/client'

export async function getCartBundles(bundleIds, locale) {
  if (!bundleIds?.length) return []

  const query = `
    *[_type == 'bundle' && _id in $ids] {
      _id,
      "title": title[language == $locale][0].value,
      bundlePrice,
      image,
      status,
      "slug": localizedSlugs[language == $locale][0].slug.current,
      products[] {
        quantity,
        "product": product-> {
          _id,
          "title": title[language == $locale][0].value,
          image
        }
      }
    }
  `
  return client.fetch(
    query,
    { ids: bundleIds, locale },
    { next: { tags: ['bundle'], revalidate: 60 } }
  )
}
