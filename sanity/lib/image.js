import { createImageUrlBuilder } from '@sanity/image-url';

import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset })

// auto('format'): product renders are uploaded as transparent PNGs, and without it
// Sanity serves PNG at every width (~1 MB at 600px vs ~57 KB as WebP). The format
// follows the requester's Accept header, so clients without WebP still get PNG.
export const urlFor = (source) => {
  return builder.image(source).auto('format')
}
