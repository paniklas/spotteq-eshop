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
  },
    token: process.env.SANITY_API_TOKEN,
})
