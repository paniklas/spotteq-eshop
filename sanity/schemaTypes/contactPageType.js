import { defineField, defineType } from 'sanity'

// Contact page singleton. Holds only the SEO metadata: the page copy lives in
// messages/*.json (contact.*) and the image in public/images.
export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Contact Page',
      validation: Rule => Rule.required(),
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
    select: { title: 'title' },
    prepare({ title }) {
      return { title }
    },
  },
})
