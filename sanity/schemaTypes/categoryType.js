import { defineField, defineType } from 'sanity'
import { greekSlugify } from '../lib/slugify'

const getLocalizedValue = (array, lang) => {
  if (!Array.isArray(array)) return ''
  return array.find((item) => item.language === lang)?.value || ''
}

const getLocalizedTitle = (doc, lang) => {
  return getLocalizedValue(doc.title, lang)
}

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    // Category Group Reference
    defineField({
      name: 'categoryGroup',
      title: 'Category Group',
      description: 'Assign this category to a group for better organization',
      type: 'reference',
      to: [{ type: 'categoryGroup' }],
      validation: (Rule) => Rule.required(),
    }),

    // Sort Order Field
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      description: 'Controls display order (lower numbers first)',
      type: 'number',
      initialValue: 100,
    }),

    // Display Number Field
    defineField({
      name: 'displayNumber',
      title: 'Display Number',
      type: 'string',
      description: 'Visual label shown on the card, e.g. "01", "02"',
    }),

    // Title Field
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),

    // Slug Field
    defineField({
      name: 'slugs',
      title: 'Localized Slugs',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'en',
          title: 'English Slug',
          type: 'slug',
          options: {
            source: (doc) => getLocalizedTitle(doc, 'en'),
            maxLength: 96,
          },
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: 'el',
          title: 'Greek Slug',
          type: 'slug',
          options: {
            source: (doc) => getLocalizedTitle(doc, 'el'),
            maxLength: 96,

            slugify: greekSlugify,
          },
          validation: (Rule) => Rule.required(),
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
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    // Image alt text for accessibility
    defineField({
      name: 'imageAlt',
      title: 'Image Alt Text',
      type: 'internationalizedArrayString',
      description: 'Alternative text for the image, used for accessibility and SEO',
    }),

    // Status Field
    defineField({
      name: 'status',
      title: 'Category Status',
      type: 'boolean',
      description: 'Mark this category as published.',
      initialValue: true,
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
  ],

  preview: {
    select: {
      titles: 'title',
      group: 'categoryGroup.title',
      displayNumber: 'displayNumber',
      sortOrder: 'sortOrder',
      media: 'image',
      status: 'status',
    },

    prepare({ titles, group, displayNumber, sortOrder, media, status }) {
      const title =
        getLocalizedValue(titles, 'el') ||
        getLocalizedValue(titles, 'en')

      const groupLabel =
        getLocalizedValue(group, 'el') ||
        getLocalizedValue(group, 'en')

      return {
        title: `${displayNumber ? `${displayNumber}. ` : ''}${title}`,
        subtitle: `${groupLabel ? `[${groupLabel}] ` : ''}#${sortOrder} ${status ? '✓ Active' : '✗ Inactive'}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
})