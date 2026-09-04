import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl:
      process.env.NODE_ENV === 'production'
        ? `https://${process.env.VERCEL_URL}/studio-spotteq`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/studio-spotteq`,
    // Stega encodes its Visual Editing metadata as zero-width characters INSIDE
    // every string it returns — a slug comes back ~1300 characters longer than
    // it looks. Draft mode turns this on, so in Presentation the product cards
    // built hrefs carrying the whole payload: ~11.8 KB of percent-encoded path.
    // Vercel's router rejects that before the function runs (502
    // ROUTER_CANNOT_MATCH), and Next echoes the URL three times in its link
    // hreflang alternates, pushing response headers past what some HTTP clients
    // accept. Values that become URLs, keys or lookup arguments must therefore
    // stay clean; only text a human reads on the page needs the overlay.
    filter: (props) =>
      props.sourcePath.includes('slugs') ||
      props.sourcePath.includes('slug') ||
      props.sourcePath.at(-1) === 'sku'
        ? false
        : props.filterDefault(props),
  },
    token: process.env.SANITY_API_TOKEN,
})
