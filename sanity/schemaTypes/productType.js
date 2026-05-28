import { defineArrayMember, defineField, defineType } from 'sanity'
import { greekSlugify } from '../lib/slugify'

const getLocalizedTitle = (doc, lang) => {
  if (!Array.isArray(doc.title)) return ''
  return doc.title.find(item => item.language === lang)?.value || ''
}

const getLocalizedFlavour = (doc, lang) => {
  if (!Array.isArray(doc.flavourName)) return ''
  return doc.flavourName.find(item => item.language === lang)?.value || ''
}

const slugSource = (lang) => (doc) => {
  const title = getLocalizedTitle(doc, lang)
  const flavour = getLocalizedFlavour(doc, lang)
  const suffix = flavour || doc.sku || ''
  return [title, suffix].filter(Boolean).join(' ')
}

const makeIsUnique = (slugPath) => async (slug, context) => {
  const { document, getClient } = context
  if (typeof getClient !== 'function') return true
  try {
    const client = getClient({ apiVersion: '2024-01-01' })
    const id = document._id.replace(/^drafts\./, '')
    const count = await client.fetch(
      `count(*[_type == "product" && ${slugPath} == $slug && !(_id in [$pub, $draft])])`,
      { slug, pub: id, draft: `drafts.${id}` }
    )
    return count === 0
  } catch {
    return true
  }
}

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    // Sort Order Field
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      description: 'Controls display order (lower numbers first)',
      type: 'number',
      initialValue: 100,
    }),

    // SKU Field
    defineField({
      name: 'sku',
      title: 'SKU',
      description: 'Stock Keeping Unit - unique identifier for the product',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    // Title Field
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Product name shown to customers',
      type: 'internationalizedArrayString',
      validation: Rule => Rule.required(),
    }),

    // Slug Field
    defineField({
      name: 'slugs',
      title: 'Slugs',
      type: 'object',
      validation: Rule => Rule.required(),
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'slug',
          options: {
            maxLength: 96,
            source: slugSource('en'),
            isUnique: makeIsUnique('slugs.en.current'),
          },
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'el',
          title: 'Greek',
          type: 'slug',
          options: {
            maxLength: 96,
            source: slugSource('el'),
            slugify: greekSlugify,
            isUnique: makeIsUnique('slugs.el.current'),
          },
          validation: Rule => Rule.required(),
        }),
      ],
    }),

    // Subtitle Line 1
    defineField({
      name: 'subtitleLine1',
      title: 'Subtitle Line 1',
      type: 'internationalizedArrayString',
      description: 'e.g. "Advanced Intra-Workout"',
    }),

    // Subtitle Line 2
    defineField({
      name: 'subtitleLine2',
      title: 'Subtitle Line 2',
      type: 'internationalizedArrayString',
      description: 'e.g. "All-in-One Performance Formula"',
    }),

    // Tagline
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'internationalizedArrayText',
      description: 'Short marketing line shown on product page',
    }),

    // Short Description
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'internationalizedArrayBlockContent',
    }),

    // Key Highlights
    defineField({
      name: 'highlights',
      title: 'Key Highlights',
      type: 'internationalizedArrayBlockContent',
      description: 'Create a bulleted list of key features per language',
    }),

    // Size / Format
    defineField({
      name: 'size',
      title: 'Size / Format',
      type: 'internationalizedArrayString',
      description: 'e.g. "390g / 1 - Month Supply"',
    }),

    // Badge
    defineField({
      name: 'badge',
      title: 'Badge',
      description: 'Optional label shown on product card, e.g. "BESTSELLER"',
      type: 'string',
    }),

    // Price
    defineField({
      name: 'price',
      title: 'Price (€)',
      description: 'Regular price in euros',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    }),

    // Sale Price
    defineField({
      name: 'salePrice',
      title: 'Sale Price (€)',
      type: 'number',
      description: 'Must be lower than the regular price',
      validation: Rule =>
        Rule.custom((salePrice, context) => {
          const price = context.document?.price
          if (salePrice !== undefined && price !== undefined && salePrice >= price) {
            return 'Sale price must be lower than the regular price'
          }
          return true
        }),
    }),

    // Inventory
    defineField({
      name: 'inventory',
      title: 'Inventory',
      description: 'Number of items in stock. Leave blank for unlimited.',
      type: 'number',
      validation: Rule => Rule.min(0).integer(),
    }),

    // Main Image
    defineField({
      name: 'image',
      title: 'Main Image',
      description: 'Primary product image shown on listing and product page',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),

    // Gallery Images
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      description: 'Additional images shown in the product gallery (max 8)',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      validation: Rule => Rule.max(8),
    }),

    // Flavour Name (this product's own flavour label)
    defineField({
      name: 'flavourName',
      title: 'Flavour Name',
      type: 'internationalizedArrayString',
      description: 'The flavour label for this specific variant, e.g. "Apple", "Orange". Shown on the flavour selector.',
    }),

    // Flavours (Variants)
    defineField({
      name: 'flavours',
      title: 'Available Flavours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'product' }],
          options: { disableNew: true },
        }),
      ],
      description: 'Link to all flavour variants of this product (include this product itself)',
    }),

    // Related Products (Complete Your Routine)
    defineField({
      name: 'relatedProducts',
      title: 'Complete Your Routine',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'product' }],
          options: {
            disableNew: true,
            filter: ({ document }) => ({
              filter: '!(_id in [$id, $draftId])',
              params: {
                id: document._id.replace(/^drafts\./, ''),
                draftId: `drafts.${document._id.replace(/^drafts\./, '')}`,
              },
            }),
          },
        }),
      ],
      description: 'Products shown in the "Complete Your Routine" section (max 3)',
      validation: Rule => Rule.max(3),
    }),

    // Categories
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
      description: 'Assign to series and/or goals',
      validation: Rule => Rule.required().min(1),
    }),

    // Product Details (Ingredients, Directions, etc.)
    defineField({
      name: 'productDetails',
      title: 'Product Details',
      type: 'object',
      fields: [
        defineField({
          name: 'ingredients',
          title: 'Ingredients',
          type: 'internationalizedArrayBlockContent',
        }),
        defineField({
          name: 'directions',
          title: 'Directions',
          type: 'internationalizedArrayBlockContent',
        }),
        defineField({
          name: 'additionalInfo',
          title: 'Additional Information',
          type: 'internationalizedArrayBlockContent',
        }),
      ],
    }),

    // Active Status
    defineField({
      name: 'status',
      title: 'Active',
      description: 'Indicates whether the product is active and visible to customers',
      type: 'boolean',
      initialValue: true,
    }),

    // Product Number of Visits
    defineField({
        name: 'numVisits',
        title: 'Number of Visits',
        type: 'number',
        description: 'This is the number of visits to the product page.Higher number means more popular.',
        validation: (Rule) => Rule.required().min(0),
        initialValue: 0,
    }),

    // Product Number of Sells
    defineField({
        name: 'numSells',
        title: 'Number of Sells',
        type: 'number',
        description: 'This is the number of sells for the product.',
        validation: (Rule) => Rule.required().min(0),
        initialValue: 0,
    }),

    // Product Last Visited
    defineField({
        name: 'lastVisited',
        title: 'Last Visited',
        type: 'boolean',
        description: 'This is the last time the product was visited.',
        initialValue: false,
    }),

    // SEO Metadata Field
    defineField({
      name: 'metadata',
      title: 'SEO Metadata',
      type: 'object',
      validation: Rule => Rule.required(),
      fields: [
        // Meta Title Field
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'internationalizedArrayString',
          validation: (Rule) => Rule.required(),
        }),
        // Meta Description Field
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'internationalizedArrayText',
          validation: (Rule) => Rule.required(),
        }),
        // OG Image Field
        defineField({
          name: 'ogImage',
          title: 'Social Media Image',
          type: 'image',
          description: 'Image displayed when sharing on social media (1200 x 630px recommended)',
          options: {
              hotspot: true,
          }
        }),
        // Keywords Field
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'object',
          description: 'Keywords relevant to the page content',
          fields: [
            defineField({
              name: 'en',
              title: 'English Keywords',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
              layout: 'tags'
            }
            }),
            defineField({
              name: 'el',
              title: 'Greek Keywords',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                layout: 'tags'
              }
            })
          ]
        }),
        // Canonical URL Field
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          description: 'The preferred URL for this page (if different from the default)',
          type: 'url',
        }),
        // No Index Field
        defineField({
          name: 'noIndex',
          title: 'No Index',
          description: 'Instruct search engines not to index this page',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),

    // Published At
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      titles: 'title',
      sku: 'sku',
      price: 'price',
      salePrice: 'salePrice',
      media: 'image',
      status: 'status',
      sortOrder: 'sortOrder',
    },
    prepare({ titles, sku, price, salePrice, media, status, sortOrder }) {
      const title = Array.isArray(titles) ? titles.find(t => t._key === 'el')?.value || titles[0]?.value : ''
      const priceLabel = salePrice ? `€${salePrice} (was €${price})` : price ? `€${price}` : ''
      return {
        title,
        subtitle: `${sku ? '[' + sku + '] ' : ''}${priceLabel} ${status ? '✓' : '✗'} | #${sortOrder}`,
        media,
      }
    },
  },
  orderings: [{ title: 'Sort Order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] }],
})
