import { defineArrayMember, defineField, defineType } from 'sanity'
import { greekSlugify } from '../lib/slugify'

const getLocalizedTitle = (doc, lang) => {
  if (!Array.isArray(doc.title)) return ''
  return doc.title.find(item => item.language === lang)?.value || ''
}

export const bundleType = defineType({
  name: 'bundle',
  title: 'Bundle',
  type: 'document',
  fields: [
    // Sort Order Field
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 100,
    }),
    // Title Field
    defineField({
      name: 'title',
      title: 'Title',
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
            source: (doc) => getLocalizedTitle(doc, 'en'),
          },
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'el',
          title: 'Greek',
          type: 'slug',
          options: {
            maxLength: 96,
            source: (doc) => getLocalizedTitle(doc, 'el'),
            slugify: greekSlugify,
          },
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    // Description Field
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
    }),
    // Image Field
    defineField({
      name: 'image',
      title: 'Bundle Image',
      type: 'image',
      options: { hotspot: true },
    }),
    // Products Array
    defineField({
      name: 'products',
      title: 'Products in Bundle',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'bundleItem',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              initialValue: 1,
              validation: Rule => Rule.required().min(1).integer(),
            }),
          ],
          preview: {
            select: { titles: 'product.title', qty: 'quantity', media: 'product.image' },
            prepare({ titles, qty, media }) {
              const title = Array.isArray(titles) ? titles.find(t => t._key === 'el')?.value || titles[0]?.value : ''
              return { title, subtitle: `Qty: ${qty}`, media }
            },
          },
        }),
      ],
      validation: Rule => Rule.required().min(1),
    }),
    // Bundle Price Field
    defineField({
      name: 'bundlePrice',
      title: 'Bundle Price (€)',
      type: 'number',
      description: 'Discounted price for the full bundle',
      validation: Rule => Rule.required().positive(),
    }),
    // Badge Field
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Optional badge, e.g. "SAVE 20%"',
    }),
    // Status Field
    defineField({
      name: 'status',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    // SEO Metadata
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      validation: Rule => Rule.required(),
      fields: [
        defineField({
          name: 'metaTitle',
          type: 'internationalizedArrayString',
          title: 'Meta Title',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'metaDescription',
          type: 'internationalizedArrayText',
          title: 'Meta Description',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'ogImage',
          title: 'Social Media Image',
          type: 'image',
          description: 'Image displayed when sharing on social media (1200 x 630px recommended)',
          options: {
              hotspot: true,
          }
        }),
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
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'The preferred URL for this page (if different from the default)'
        }),
        defineField({
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          description: 'Instruct search engines not to index this page',
          initialValue: false
        })
      ],
    }),
    // Published Date
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: { titles: 'title', bundlePrice: 'bundlePrice', media: 'image', status: 'status' },
    prepare({ titles, bundlePrice, media, status }) {
      const title = Array.isArray(titles) ? titles.find(t => t._key === 'el')?.value || titles[0]?.value : ''
      return {
        title,
        subtitle: `${bundlePrice ? '€' + bundlePrice : ''} ${status ? '✓ Active' : '✗ Inactive'}`,
        media,
      }
    },
  },
  orderings: [{ title: 'Sort Order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] }],
})
